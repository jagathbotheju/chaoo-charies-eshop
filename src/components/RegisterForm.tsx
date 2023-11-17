"use client";
import { useState } from "react";
import Heading from "./Heading";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Input from "./Input";
import Button from "./Button";
import Link from "next/link";
import { AiOutlineGoogle } from "react-icons/ai";

const RegisterForm = () => {
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

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    console.log(data);
  };

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
        label="Signup with Google"
        onClick={() => {}}
        icon={AiOutlineGoogle}
        width="w-full"
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
