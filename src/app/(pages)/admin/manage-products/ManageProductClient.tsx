import { formatPrice } from "@/utils/formatPrice";
import { Product } from "@prisma/client";
import { DataTable } from "./DataTable";
import { columns } from "./Columns";
import Heading from "@/components/Heading";

interface Props {
  products: Product[];
}

const ManageProductClient = ({ products }: Props) => {
  const data = products?.map((product: Product) => {
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      brand: product.brand,
      inStock: product.inStock,
    };
  });

  return (
    <div>
      <div className="mb-4 mt-8">
        <Heading title="Manage Products" center />
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default ManageProductClient;
