"use client";
import { useEffect, useState } from "react";

interface Props {
  children: React.ReactNode;
}

const Hydration = ({ children }: Props) => {
  const [hydrate, setHydrate] = useState(false);

  useEffect(() => {
    setHydrate(true);
  }, []);

  console.log("hydrating...", hydrate);

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
