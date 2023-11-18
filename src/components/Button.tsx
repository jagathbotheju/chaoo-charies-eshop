"use client";
import { IconType } from "react-icons";

interface Props {
  label: string;
  disabled?: boolean;
  outline?: boolean;
  small?: boolean;
  custom?: string;
  icon?: IconType;
  width?: "w-full" | "w-fit";
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  loader?: React.ReactNode;
}

const Button = ({
  label,
  disabled,
  outline = false,
  small,
  custom,
  icon: Icon,
  onClick,
  loader,
  width = "w-fit",
}: Props) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-md
      hover:opacity-80
      transition
      ${width}
      border-slate-700
      items-center
      justify-center
      gap-2
      flex
      ${disabled && "opacity-80"}
      ${disabled && "cursor-wait"}
      ${outline ? "bg-white" : "bg-slate-700"}
      ${outline ? "text-slate-700" : "text-white"}
      ${small ? "text-sm font-light" : "text-md font-semibold"}
      ${small ? "py-2 px-2 border-[1px]" : "py-3 px-4 border-2"}
      ${custom && custom}
    `}
    >
      {Icon && <Icon size={24} />}
      {loader}
      {label}
    </button>
  );
};

export default Button;
