"use client";

interface Props {
  onClick: () => void;
}

const BackDrop = ({ onClick }: Props) => {
  return (
    <div
      onClick={onClick}
      className="z-20 bg-slate-200 opacity-20 w-screen h-screen fixed top-0 left-0"
    ></div>
  );
};

export default BackDrop;
