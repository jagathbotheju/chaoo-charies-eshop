"use client";

import { FieldValues, UseFormRegister } from "react-hook-form";

interface Props {
  id: string;
  label: string;
  disabled?: boolean;
  register: UseFormRegister<FieldValues>;
}

const CheckBox = ({ id, label, disabled, register }: Props) => {
  return (
    <div className="w-full flex flex-row items-center gap-2">
      <input
        type="checkbox"
        id={id}
        disabled={disabled}
        {...register(id)}
        placeholder=""
        className="cursor-pointer"
      />
      <label htmlFor={id} className="cursor-pointer font-medium text-slate-400">
        {label}
      </label>
    </div>
  );
};

export default CheckBox;
