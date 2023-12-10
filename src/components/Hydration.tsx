"use client";
import { useCart } from "@/hooks/useCart";
import { useEffect, useState } from "react";

interface Props {
  children: React.ReactNode;
}

const Hydration = ({ children }: Props) => {
  const [hydrate, setHydrate] = useState(false);

  useEffect(() => {
    //useCart.persist.rehydrate();
    setHydrate(true);
  }, []);

  return (
    <>
      {hydrate ? (
        <>{children}</>
      ) : (
        <div className="h-screen flex items-center justify-center mx-0">
          <span className="loading loading-ring loading-lg text-primary"></span>
        </div>
      )}
    </>
  );
};

export default Hydration;
