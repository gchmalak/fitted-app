import { ProductDepartment } from "./product";

export interface Subcategory {
    _id:string;
    name:string
}
export interface Category{
    _id:string;
    name:string;
    department:ProductDepartment;
    subcategories:Subcategory[]
}

export interface CreateCategoryRequest {
  name: string;
  department: ProductDepartment;
  subcategories?: { name: string }[];
}

export type UpdateCategoryRequest = Partial<CreateCategoryRequest>;
