"use client";
import { useSession } from "next-auth/react";
import { Image, Product, User } from "@prisma/client";
import Heading from "@/components/Heading";
import Input from "@/components/Input";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import TextArea from "@/components/TextArea";
import CheckBox from "@/components/CheckBox";
import { productCategories } from "@/utils/productCategories";
import Category from "@/components/Category";
import { colors } from "@/utils/Colors";
import SelectColor from "@/components/SelectColor";
import Button from "@/components/Button";
import { toast } from "react-toastify";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import firebaseApp from "@/utils/firebase";
import { adminCreateProduct } from "@/utils/serverActions";
import { Router } from "next/router";
import { useRouter } from "next/navigation";

const AdminAddProductForm = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<ImageType[] | null>();
  const [isProductCreated, setIsProductCreated] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      description: "",
      brand: "",
      category: "",
      inStock: false,
      images: [],
      price: 0,
    },
  });
  const category = watch("category");
  const user = (session?.user as User) ?? null;

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  useEffect(() => {
    setCustomValue("images", images);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  useEffect(() => {
    if (isProductCreated) {
      reset();
      setImages(null);
      setIsProductCreated(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isProductCreated]);

  const addImageToLocalState = useCallback((value: ImageType) => {
    setImages((prev) => {
      if (!prev) return [value];
      return [...prev, value];
    });
  }, []);

  const removeImageFromLocalState = useCallback((value: ImageType) => {
    setImages((prev) => {
      if (prev) {
        const filteredImages = prev.filter(
          (image) => image.color !== value.color
        );
        return filteredImages;
      }
      return prev;
    });
  }, []);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    console.log(data);
    //upload image to db
    setLoading(true);
    let uploadedImages: Image[] = [];

    if (!data.category) {
      setLoading(false);
      return toast.error("Please select a Category");
    }
    if (!data.images || data.images.length === 0) {
      setLoading(false);
      return toast.error("Please select at least one Image");
    }

    const handleImageUploads = async () => {
      toast.info("Creating product, please wait...");
      try {
        for (const item of data.images) {
          if (item.image) {
            const fileName = new Date().getTime() + "-" + item.image.name;
            const storage = getStorage(firebaseApp);
            const storageRef = ref(storage, `products/${fileName}`);
            const uploadTask = uploadBytesResumable(storageRef, item.image);

            await new Promise<void>((resolve, reject) => {
              uploadTask.on(
                "state_changed",
                (snapshot) => {
                  const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  console.log("Upload is " + progress + "% done");
                  setImageUploadProgress(progress);
                  switch (snapshot.state) {
                    case "paused":
                      console.log("Upload is paused");
                      break;
                    case "running":
                      console.log("Upload is running");
                      break;
                  }
                },
                (error) => {
                  setLoading(false);
                  console.log("Error uploading image", error);
                  reject(error);
                },
                () => {
                  getDownloadURL(uploadTask.snapshot.ref)
                    .then((downloadURL) => {
                      uploadedImages.push({
                        ...item,
                        image: downloadURL,
                      });
                      console.log("File available at", downloadURL);
                      resolve();
                    })
                    .catch((error) => {
                      console.log("error getting downloadURL");
                      reject(error);
                      setLoading(false);
                    });
                }
              );
            });
          }
        }
      } catch (error) {
        setLoading(false);
        console.log("Error handling image upload", error);
        return toast.error("Error handling image upload");
      }
    };

    await handleImageUploads();

    const productData = {
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      brand: data.brand,
      category: data.category,
      inStock: data.inStock,
      image: uploadedImages,
    } as Product;
    console.log("productData", productData);

    //save to db
    console.log("uploadImages", uploadedImages);
    adminCreateProduct({ user, product: productData })
      .then((response) => {
        if (response?.success) {
          toast.success("Product Created");
          setIsProductCreated(true);
          router.refresh();
        } else {
          toast.error("Error creating product");
        }
      })
      .catch((error) => {
        toast.error("Error creating product");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="mx-auto mt-20 p-10 w-full">
        <h1 className="text-3xl font-bold text-red-500">No Authorized!</h1>
      </div>
    );
  }

  return (
    <>
      <Heading title="Add Product" center />
      {/* name */}
      <Input
        id="name"
        label="Name"
        disabled={loading}
        register={register}
        errors={errors}
        required
      />

      {/* price */}
      <Input
        id="price"
        label="Price"
        disabled={loading}
        register={register}
        errors={errors}
        required
        type="number"
      />

      {/* brand */}
      <Input
        id="brand"
        label="Brand"
        disabled={loading}
        register={register}
        errors={errors}
        required
      />

      {/* description */}
      <TextArea
        id="description"
        label="Description"
        disabled={loading}
        register={register}
        errors={errors}
        required
      />

      {/* in stock */}
      <CheckBox id="inStock" register={register} label="Product In Stock" />

      {/* category */}
      <div className="w-full font-medium">
        <div className="mb-2 font-semibold">Select a Category</div>
        <div className="grid grid-cols-2 md:grid-cols-3 max-h-[50vh] overflow-y-auto gap-3">
          {productCategories.map((item, index) => {
            if (item.label === "All") return null;

            return (
              <div key={index}>
                <Category
                  onClick={(category) => setCustomValue("category", category)}
                  selected={category === item.label}
                  label={item.label}
                  icon={item.icon}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* image */}
      <div className="w-full flex flex-col flex-wrap gap-4">
        <div>
          <div className="font-bold">
            Select the available product colors and upload images
          </div>
          <div className="text-sm">
            You must upload an image for each of the color selected otherwise
            your color selection will be ignored.
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {colors.map((item, index) => (
            <SelectColor
              key={index}
              isProductCreated={isProductCreated}
              item={item}
              imageUploadProgress={imageUploadProgress}
              addImageToLocalState={addImageToLocalState}
              removeImageFromLocalState={removeImageFromLocalState}
            />
          ))}
        </div>
      </div>

      {/* submit button */}
      <Button
        label="Add Product"
        custom="py-1"
        loader={
          loading && (
            <span className="ml-2 loading loading-spinner loading-sm text-secondary">
              Add Product
            </span>
          )
        }
        onClick={handleSubmit(onSubmit)}
      />
    </>
  );
};

export default AdminAddProductForm;
