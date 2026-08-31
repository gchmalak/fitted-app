import { Category } from "./category";

export type ProductDepartment =
  | "Clothing" | "Accessories" | "Makeup" | "Skincare" | "Perfume";



export interface Variant {
  _id: string;
  size?: string;
  color?: string;
  shade?: string;
  stock: number;
  sku: string;
}

// export interface Review {
//   _id: string;
//   authorId: string;
//   rating: 1 | 2 | 3 | 4 | 5;
//   comment: string;
//   createdAt: string;
// }

export interface Product {
  _id: string;
  productId:string;//backed by backend data
  name: string;
  description: string;
  images: string[];
  brand: string;
  department: ProductDepartment;
  categoryId: Category;
  subcategory:string;
  price: number;
  variants: Variant[];
  // reviews: Review[];
  averageRating: number;
  reviewCount: number;
  authorId: string;
  care?: string;
  shipping?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  images: string[];
  brand: string;
  department: ProductDepartment;
  categoryId: string;
  subcategory?:string;
  price: number;
  variants: Omit<Variant, "_id">[];
  care?:string;
  shipping?:string;
 
}

export type UpdateProductRequest = Partial<CreateProductRequest>;

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "price" | "averageRating";
  sortOrder?: "asc" | "desc";
  search?: string;
  department?: string;
  departments?: string[];
  categoryId?: string;
}