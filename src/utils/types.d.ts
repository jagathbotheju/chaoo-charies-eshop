type CartProduct = {
  id: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  selectedImg: SelectedImg;
  quantity: number;
  price: number;
};

type SelectedImg = {
  color: string;
  colorCode: string;
  image: string;
};
