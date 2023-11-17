"use client";
import { useState } from "react";
import Heading from "./Heading";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Input from "./Input";
import Button from "./Button";
import Link from "next/link";
import { AiOutlineGoogle } from "react-icons/ai";

const LoginForm = () => {
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
    console.log(data);
  };

  return (
    <>
      <Heading title="Sign in to E-Shop" />
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
        label="Sing Up"
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
        onClick={() => {}}
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
