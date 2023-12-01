"use client";
import { useEffect, useState } from "react";
import Heading from "../../../components/Heading";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import Link from "next/link";
import { AiOutlineGoogle } from "react-icons/ai";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

const LoginForm = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      password: "",
      name: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    signIn("credentials", {
      ...data,
      redirect: false,
    }).then((cb) => {
      setIsLoading(false);
      if (cb?.ok) {
        if (cb?.ok) {
          router.push("/cart");
          router.refresh();
          toast.success("Successfully LoggedIn");
        }
        if (cb?.error) {
          toast.error(cb.error);
        }
      }
    });
  };

  useEffect(() => {
    if (session && session.user) {
      router.back();
    }
  }, [session, router]);

  if (session && session.user) {
    return (
      // <p className="text-center">You are already logged in, redirecting...</p>
      <span className="loading loading-ring loading-lg"></span>
    );
  }

  return (
    <>
      <Heading title="Log in to E-Shop" />
      <hr className="bg-slate-300 w-full" />

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
        label="Log In"
        onClick={handleSubmit(onSubmit)}
        width="w-full"
        loader={
          isLoading && (
            <span className="loading loading-spinner text-secondary loading-sm"></span>
          )
        }
      />

      {/* with google */}
      <div className="divider">OR</div>
      <Button
        outline
        label="Continue with Google"
        onClick={() => signIn("google")}
        icon={AiOutlineGoogle}
        width="w-full"
      />

      <p className="text-sm">
        Do not have an account?
        <Link className="underline ml-1" href="/register">
          Sing Up
        </Link>
      </p>
    </>
  );
};

export default LoginForm;
