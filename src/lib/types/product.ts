/** Product types for the Majestic storefront */

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  sku: string;
  price: number;
  regularPrice: number;
  salePrice: number | null;
  categories: Pick<Category, "id" | "name" | "slug">[];
  images: ProductImage[];
  attributes: ProductAttribute[];
  relatedIds: number[];
  stockStatus: "instock" | "outofstock" | "onbackorder";
  weight: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  parent: number;
  description: string;
  image: ProductImage | null;
  count: number;
}

export interface ProductImage {
  id: number;
  src: string;
  alt: string;
}

export interface ProductAttribute {
  id: number;
  name: string;
  options: string[];
}

/** Maps WooCommerce API response to our Product type */
export function mapWCProduct(wc: {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  categories: { id: number; name: string; slug: string }[];
  images: { id: number; src: string; alt: string }[];
  attributes: { id: number; name: string; options: string[] }[];
  related_ids: number[];
  stock_status: string;
  weight: string;
  dimensions: { length: string; width: string; height: string };
}): Product {
  return {
    id: wc.id,
    name: wc.name,
    slug: wc.slug,
    description: wc.description,
    shortDescription: wc.short_description,
    sku: wc.sku,
    price: parseInt(wc.price, 10) || 0,
    regularPrice: parseInt(wc.regular_price, 10) || 0,
    salePrice: wc.sale_price ? parseInt(wc.sale_price, 10) : null,
    categories: wc.categories,
    images: wc.images,
    attributes: wc.attributes,
    relatedIds: wc.related_ids,
    stockStatus: wc.stock_status as Product["stockStatus"],
    weight: wc.weight,
    dimensions: wc.dimensions,
  };
}
