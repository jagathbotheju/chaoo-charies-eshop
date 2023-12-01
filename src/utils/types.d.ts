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

interface SAddress extends Stripe.Address {
  city: string;
  country: string;
  line1: string;
  line2?: string;
  postalCode: string;
  state: string;
}
