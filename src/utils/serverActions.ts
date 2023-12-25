"use server";
import { User, Product, Order, Review } from "@prisma/client";
import bcrypt from "bcrypt";
import { FieldValues } from "react-hook-form";
import prisma from "./prismadb";
import Stripe from "stripe";
import { cartTotalAmount } from "./cartTotalAmount";
import { revalidatePath } from "next/cache";
import { deleteObject, getStorage, ref } from "firebase/storage";
import firebaseApp from "./firebase";
import { serverUser } from "./serverUser";
import moment from "moment";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});
const storage = getStorage(firebaseApp);

// 1-UPDATE STOCK
// 2-GET ORDERS
// 2.1-UPDATE ORDER DELIVERY STATUS
// 2.2-GET ORDER BY ID
// 2.3-GET ORDER BY USERID
// 2.3-GET ORDERS
// 3-GET PRODUCTS
// 4-GET PRODUCT BY ID
// 5-DELETE A PRODUCT
// 6-ADMIN CREATE PRODUCT
// 7-CREATE PAYMENT INTENT
// 8-SIGN UP USER
// 9-REVIEW CREATE
// 10-USERS GET

// 1-UPDATE STOCK
export const updateStock = async (productId: string, inStock: boolean) => {
  try {
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        inStock: !inStock,
      },
    });
    if (!updatedProduct) {
      return {
        success: false,
        message: "Internal Server Error",
      };
    }

    return {
      success: true,
      data: updatedProduct,
    };
  } catch (error) {
    return {
      success: false,
      message: "Internal Server Error",
    };
  }
};

// 2-GET ORDERS
export const getOrders = async () => {
  try {
    const orders = await prisma.order.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });

    if (!orders) {
      return {
        success: false,
        message: "Orders not found",
      };
    }

    return {
      success: true,
      data: orders,
    };
  } catch (error) {
    return {
      success: false,
      message: "Internal Server Error",
    };
  }
};

//2.1-UPDATE ORDER DELIVERY STATUS
export const updateOrderDeliveryStatus = async ({
  orderId,
  deliveryStatus,
}: {
  orderId: string;
  deliveryStatus: string;
}) => {
  const user = await serverUser();
  if (!user || user.role !== "ADMIN") {
    return {
      success: false,
      message: "Not Authorized",
    };
  }

  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { deliveryStatus },
    });

    if (!updatedOrder) {
      return {
        success: false,
        message: "Error updating delivery status",
      };
    }

    return {
      success: true,
      data: deliveryStatus,
      message: `Delivery status updated to ${deliveryStatus}`,
    };
  } catch (error) {
    return {
      success: false,
      message: "Internal Server Error",
    };
  }
};

// 2.2-GET ORDER BY ID
export const getOrderById = async (orderId: string) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return {
        success: false,
        message: "Error getting order",
      };
    }

    return {
      success: true,
      order,
    };
  } catch (error) {
    return {
      success: false,
      message: "Inter Sever Error",
    };
  }
};

// 2.3-GET ORDER BY USERID
export const getOrderByUserId = async (userId: string) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!orders.length) {
      return {
        success: false,
        message: "Error getting my orders",
      };
    }

    return {
      success: true,
      data: orders,
    };
  } catch (error) {
    return {
      success: false,
      message: "Internal Server Error",
    };
  }
};

// 3-GET PRODUCTS
export const getProducts = async ({
  category,
  searchTerm,
}: {
  category?: string | null;
  searchTerm?: string | null;
}) => {
  try {
    let searchString = searchTerm;
    if (!searchTerm) searchString = "";

    let query: any = {};
    if (category) {
      query.category = category;
    }

    const products = await prisma.product.findMany({
      where: {
        ...query,
        OR: [
          {
            name: {
              contains: searchString,
              mode: "insensitive",
            },
            description: {
              contains: searchString,
              mode: "insensitive",
            },
          },
        ],
      },
      include: {
        reviews: {
          include: { user: true },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!products) {
      return { success: false, message: "Products not found" };
    }

    return {
      success: true,
      data: products,
    };
  } catch (error) {
    return {
      success: false,
      message: "Internal Server Error",
    };
  }
};

// 4-GET PRODUCT BY ID
export const getProduct = async (productId: string) => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        reviews: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!product) {
      return {
        success: false,
        message: "No product found",
      };
    }

    return {
      success: true,
      data: product,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error getting a product",
    };
  }
};

// 5-DELETE A PRODUCT
export const deleteProduct = async ({
  user,
  productId,
}: {
  user: User;
  productId: string;
}) => {
  if (!user || user.role !== "ADMIN") {
    return {
      success: false,
      message: "Not Authorized",
    };
  }

  try {
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });
    if (product && product.image.length) {
      for (const item of product.image) {
        if (item) {
          const imageRef = ref(storage, item.image);
          await deleteObject(imageRef);
        }
      }
    }
    const deletedProduct = await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    if (!deletedProduct) {
      return {
        success: false,
        message: "Error deleting product",
      };
    }

    return {
      success: true,
      message: "Product deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Error Creating Product",
    };
  }
};

// 6-ADMIN CREATE PRODUCT
export const adminCreateProduct = async ({
  user,
  product,
}: {
  user: User;
  product: Product;
}) => {
  if (!user || user.role !== "ADMIN") {
    return {
      success: false,
      message: "Not Authorized",
    };
  }

  try {
    const newProduct = await prisma.product.create({
      data: { ...product },
    });

    return {
      success: true,
      data: newProduct,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error Creating Product",
    };
  }
};

// 7-CREATE PAYMENT INTENT
export const createPaymentIntent = async ({
  cartProducts,
  user,
  paymentIntentId,
}: {
  cartProducts: CartProduct[];
  user: User;
  paymentIntentId: string | null;
}) => {
  const totalPrice = cartTotalAmount(cartProducts).totalPrice * 100;
  const orderData = {
    user: { connect: { id: user.id } },
    amount: totalPrice,
    currency: "usd",
    status: "pending",
    deliveryStatus: "pending",
    paymentIntentId,
    products: cartProducts,
  };

  if (paymentIntentId) {
    //update payment intent
    const currentPaymentIntent = await stripe.paymentIntents.retrieve(
      paymentIntentId
    );
    if (currentPaymentIntent) {
      const updatedPaymentIntent = await stripe.paymentIntents.update(
        paymentIntentId,
        {
          amount: totalPrice,
        }
      );

      //update order
      const [existingOrder, updatedOrder] = await Promise.all([
        prisma.order.findFirst({
          where: { paymentIntentId },
        }),
        prisma.order.update({
          where: { paymentIntentId },
          data: {
            amount: totalPrice,
            products: cartProducts,
          },
        }),
      ]);

      if (!existingOrder) {
        return {
          success: false,
          message: "Invalid Payment Intent",
        };
      }

      return {
        success: true,
        data: JSON.stringify(updatedPaymentIntent),
      };
    }
  } else {
    //create the payment intent and
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalPrice,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    //create order
    const paymentIntentId = paymentIntent.id;
    await prisma.order.create({
      data: {
        ...orderData,
        paymentIntentId,
      },
    });

    return {
      success: true,
      data: JSON.stringify(paymentIntent),
    };
  }
};

// 8-SIGN UP USER
export const signupUser = async (formData: FieldValues) => {
  try {
    const { name, email, password } = formData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
      },
    });

    if (!user) {
      return {
        success: false,
        message: "Internal Server Error",
      };
    }

    return {
      success: true,
      data: user,
    };
  } catch (error) {
    return {
      success: false,
      message: "Internal Server Error",
    };
  }
};

// 9-REVIEW CREATE
export const createReview = async ({
  comment,
  rating,
  product,
}: {
  comment: string;
  rating: number;
  product: ExtraProduct;
}) => {
  try {
    const currentUser = await serverUser();
    const myOrders = await prisma.order.findMany({
      where: {
        userId: currentUser.id,
      },
    });
    const orderDelivered = myOrders.some(
      (order) =>
        order.products.find((item) => item.id === product.id) &&
        order.deliveryStatus === "delivered"
    );
    const userReview = product.reviews.find(
      (review: Review) => review.userId === currentUser.id
    );

    if (!orderDelivered) {
      return {
        success: false,
        message: "You must purchase to comment",
      };
    }

    const review = await prisma.review.create({
      data: {
        comment,
        rating,
        productId: product.id,
        userId: currentUser.id,
      },
    });

    if (!review) {
      return {
        success: false,
        message: "Error reviewing this product",
      };
    }

    revalidatePath(`/product/${product.id}`);

    return {
      success: true,
      message: "Successfully comment this product",
      data: review,
    };
  } catch (error) {
    return {
      success: false,
      message: "Create Review - Internal Server Error",
    };
  }
};

// 10-USERS GET
export const getUsers = async () => {
  try {
    const users = await prisma.user.findMany();
    if (!users) {
      return {
        success: false,
        message: "Error getting users",
      };
    }

    return {
      success: true,
      data: users,
    };
  } catch (error) {
    return {
      success: false,
      message: "Getting All Users/Internal Server Error",
    };
  }
};

// 11-CHART DATA
export const getChartData = async () => {
  try {
    const startDate = moment().subtract(30, "days").startOf("day");
    const endDate = moment().endOf("day");

    const result = await prisma.order.groupBy({
      by: ["createdAt"],
      where: {
        createdAt: {
          gte: startDate.toISOString(),
          lte: endDate.toISOString(),
        },
        status: "complete",
      },
      _sum: {
        amount: true,
      },
    });

    const aggregatedData: {
      [day: string]: { day: string; date: string; totalAmount: number };
    } = {};

    const currentDate = startDate.clone();
    while (currentDate <= endDate) {
      const day = currentDate.format("dddd");
      aggregatedData[day] = {
        day,
        date: currentDate.format("YYYY-MM-DD"),
        totalAmount: 0,
      };
      currentDate.add(1, "day");
    }

    result.forEach((entry) => {
      const day = moment(entry.createdAt).format("dddd");
      const amount = entry._sum.amount || 0;
      aggregatedData[day].totalAmount += amount / 100;
    });

    const formattedData = Object.values(aggregatedData).sort((a, b) =>
      moment(a.date).diff(moment(b.date))
    );

    if (!result) {
      return {
        success: false,
        message: "Error getting chart data",
      };
    }

    return {
      success: true,
      data: formattedData,
    };
  } catch (error) {
    return {
      success: false,
      message: "Getting chart data/Internal Server Error",
    };
  }
};
