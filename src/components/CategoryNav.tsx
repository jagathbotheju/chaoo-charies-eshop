"use client";
import { usePathname, useSearchParams } from "next/navigation";
import Category from "./Category";
import CategoryNavItem from "./CategoryNavItem";
import Container from "./Container";
import { productCategories } from "@/utils/productCategories";

const CategoryNav = () => {
  const params = useSearchParams();
  const category = params?.get("category");

  const pathname = usePathname();
  const isMainPage = pathname === "/";

  //if not in home page, do not show categories
  if (!isMainPage) return null;

  return (
    <div className="bg-white">
      <Container>
        <div className="pt-4 flex flex-row items-center justify-between overflow-x-auto">
          {productCategories.map((item, index) => (
            <CategoryNavItem
              key={index}
              label={item.label}
              icon={item.icon}
              selected={
                category === item.label ||
                (category === null && item.label === "All")
              }
            />
          ))}
        </div>
      </Container>
    </div>
  );
};

export default CategoryNav;
