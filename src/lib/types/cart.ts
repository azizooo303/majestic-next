/** Cart types for the Majestic storefront */

export interface CartItem {
  key: string;
  id: number;
  name: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
  totals: {
    line_subtotal: string;
    line_total: string;
  };
}

export interface Cart {
  items: CartItem[];
  itemCount: number;
  totals: {
    subtotal: string;
    shipping: string;
    discount: string;
    total: string;
    currency: string;
  };
  coupons: { code: string; discount: string }[];
}

export interface ShippingAddress {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  phone: string;
  email: string;
}
