export interface CartItem{
productId:string;
variantId:string; //size/color/shade...
name:string;
price:number;
image:string;
quantity:number;

}
export interface CartState{
    items:CartItem[];
}