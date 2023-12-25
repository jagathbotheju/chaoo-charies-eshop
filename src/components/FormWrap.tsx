interface Props {
  children: React.ReactNode;
  width?: string;
}

const FormWrap = ({ children, width = "sm" }: Props) => {
  return (
    <div className="min-h-fit h-full flex items-center justify-center pb-12 pt-20">
      <div
        className={`flex flex-col gap-6 items-center shadow-xl shadow-slate-200 rounded-md p-4 md:p-8 w-full ${
          width === "lg" ? "max-w-[750px]" : "max-w-[450px]"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default FormWrap;
