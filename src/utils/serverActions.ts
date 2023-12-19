"use server";
import { User, Product, Order } from "@prisma/client";
import bcrypt from "bcrypt";
import { FieldValues } from "react-hook-form";
import prisma from "./prismadb";
import Stripe from "stripe";
import { cartTotalAmount } from "./cartTotalAmount";
import { revalidatePath } from "next/cache";
import { deleteObject, getStorage, ref } from "firebase/storage";
import firebaseApp from "./firebase";
import { serverUser } from "./serverUser";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});
const storage = getStorage(firebaseApp);

// 1-UPDATE STOCK
// 2-GET ORDERS
// 2.1-UPDATE ORDER DELIVERY STATUS
// 2.2-GET ORDER BY ID
// 2.3-GET ORDER BY USERID
// 3-GET PRODUCTS
// 4-GET PRODUCT BY ID
// 5-DELETE A PRODUCT
// 6-ADMIN CREATE PRODUCT
// 7-CREATE PAYMENT INTENT
// 8-SIGN UP USER

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
    console.log(error);
    return {
      success: false,
      message: "Internal Server Error",
    };
  }
};

// 4-GET PRODUCT
export const getProduct = async (productId: string) => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
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
    console.log(`Error getting product - ${error}`);
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
          console.log("image deleted", item.image);
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
    console.log(`Error deleting product - ${error}`);
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
    console.log(`Error creating product - ${error}`);
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
  console.log("CREATING PAYMENT INTENT***********", paymentIntentId);
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
    console.log("CHECKOUT FOUND PAYMENT INTENT - UPDATE", paymentIntentId);
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

      console.log("UPDATE ORDER******************************************", {
        amount: totalPrice,
        products: cartProducts,
      });

      return {
        success: true,
        data: JSON.stringify(updatedPaymentIntent),
      };
    }
  } else {
    //create the payment intent and
    console.log("CHECKOUT FOUND PAYMENT INTENT - CREATE");

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

    console.log("CREATE ORDER******************************************", {
      ...orderData,
      paymentIntentId,
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
    console.log(error);
    return {
      success: false,
      message: "Internal Server Error",
    };
  }
};
