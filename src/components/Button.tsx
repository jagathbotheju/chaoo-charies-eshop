"use client";
import { IconType } from "react-icons";

interface Props {
  label: string;
  disabled?: boolean;
  outline?: boolean;
  small?: boolean;
  custom?: string;
  icon?: IconType;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button = ({
  label,
  disabled,
  outline = false,
  small,
  custom,
  icon: Icon,
  onClick,
}: Props) => {
  return (
    <button
      disabled={disabled}
      className={`rounded-md
      hover:opacity-80
      transition
      w-fit
      border-slate-700
      items-center
      justify-center
      gap-2
      ${outline ? "bg-white" : "bg-slate-700"}
      ${outline ? "text-slate-700" : "text-white"}
      ${small ? "text-sm font-light" : "text-md font-semibold"}
      ${small ? "py-2 px-2 border-[1px]" : "py-3 px-4 border-2"}
      ${custom && custom}
    `}
    >
      {Icon && <Icon size={24} />}
      {label}
    </button>
  );
};

export default Button;
