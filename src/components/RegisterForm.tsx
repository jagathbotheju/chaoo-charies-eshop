"use client";
import { useEffect, useState, useTransition } from "react";
import Heading from "./Heading";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Input from "./Input";
import Button from "./Button";
import Link from "next/link";
import { AiOutlineGoogle } from "react-icons/ai";
import { signupUser } from "@/utils/serverActions";
import { toast } from "react-toastify";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const RegisterForm = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (formData) => {
    setIsLoading(true);
    startTransition(() => {
      signupUser(formData)
        .then((response) => {
          if (response.success) {
            console.log("user from serverActions", response.data);
            toast.success("User create successfully");
            signIn("credentials", {
              email: formData.email,
              password: formData.password,
              redirect: false,
            }).then((cb) => {
              if (cb?.ok) {
                router.push("/cart");
                router.refresh();
                toast.success("Successfully LoggedIn");
              }
              if (cb?.error) {
                toast.error(cb.error);
              }
            });
          } else {
            toast.error(response.message);
          }
        })
        .catch((error) => {
          console.log(error);
          toast.error(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    });
  };

  useEffect(() => {
    if (session && session.user) {
      router.back();
    }
  }, [session, router]);

  if (session && session.user) {
    return (
      <p className="text-center">You are already logged in, redirecting...</p>
    );
  }

  return (
    <>
      <Heading title="Sign up for E-Shop" />
      <hr className="bg-slate-300 w-full" />

      {/* name */}
      <Input
        id="name"
        label="Name"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />

      {/* email */}
      <Input
        id="email"
        label="Email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />

      {/* password */}
      <Input
        id="password"
        label="Password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        type="password"
      />

      {/* submit button */}
      <Button
        disabled={isLoading}
        label="Sing Up"
        onClick={handleSubmit(onSubmit)}
        width="w-full"
        loader={
          isLoading && (
            <span className="loading loading-spinner text-secondary loading-sm"></span>
          )
        }
      />

      <p className="text-sm">
        Already have an account?
        <Link className="underline ml-1" href="/login">
          Login
        </Link>
      </p>
    </>
  );
};

export default RegisterForm;
