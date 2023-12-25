"use client";
import { ExtProduct } from "@/app/(pages)/product/ProductDetails";
import Heading from "./Heading";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Rating as ReactRating, RoundedStar } from "@smastrom/react-rating";
import { useState, useTransition } from "react";
import type { ItemStyles } from "@smastrom/react-rating";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { createReview } from "@/utils/serverActions";

interface Props {
  product: ExtProduct;
}

const ratingStyles: ItemStyles = {
  itemShapes: RoundedStar,
  activeFillColor: "#ffb700",
  inactiveFillColor: "#fbf1a9",
};

const RatingSchema = z
  .object({
    comment: z.string().min(1, { message: "Please enter some comments..." }),
  })
  .required();

const AddRating = ({ product }: Props) => {
  const [isPending, startTransition] = useTransition();
  const { data: session } = useSession();
  const user = session?.user;
  const [rating, setRating] = useState(0);
  const form = useForm<z.infer<typeof RatingSchema>>({
    resolver: zodResolver(RatingSchema),
    defaultValues: {
      comment: "",
    },
  });

  const onSubmit = (formData: z.infer<typeof RatingSchema>) => {
    if (rating === 0) return toast.error("Please add rating");
    const data = { ...formData, rating };
    startTransition(() => {
      createReview({
        ...data,
        product,
      })
        .then((res) => {
          if (res.success) {
            return toast.success(res.message);
          }
          toast.error(res.message);
        })
        .catch((err) => {
          toast.error(err.message);
        });
      form.reset();
      setRating(0);
    });
  };

  return (
    <div className="flex flex-col gap-2 max-w-[500px]">
      <Heading title="Rate this product" />
      <ReactRating
        style={{ maxWidth: 150 }}
        value={rating}
        onChange={setRating}
        itemStyles={ratingStyles}
      />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="gap-2 flex flex-col w-[300px]"
        >
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Add comment..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" size="sm" className="w-fit">
            Comment
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddRating;
