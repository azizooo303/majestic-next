/**
 * Cart types — shared between cart context and Supabase persistence layer.
 */

export interface CartItem {
  id: number;
  name: string;
  nameAr: string;
  price: number;
  image: string;
  category: string;
  categoryAr: string;
  quantity: number;
}
