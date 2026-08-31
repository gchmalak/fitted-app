import { CartItem, CartState} from "@/types/cart";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState:CartState={
items:[]
}

const cartSlice = createSlice({
name:"cart",
initialState,
reducers:{
    addToCart:(state, action:PayloadAction<CartItem>) =>{
//    we search if item already exists in the cart
    const existingItem= state.items.find(
        (item)=>item.productId === action.payload.productId && item.variantId === action.payload.variantId
    )
    // if it exists we add to its quantity
    if (existingItem){
        existingItem.quantity += action.payload.quantity;
    } else{
        // if it doesn't we push it into the cart
        state.items.push(action.payload);
    }
    },
    // we dont need the whole info of the item just its id and its variant's id 
    removeFromCart:(state, action:PayloadAction<{productId:string; variantId:string}>)=>{
        state.items = state.items.filter(
            (item)=>item.productId !== action.payload.productId || item.variantId !== action.payload.variantId 
        )
    },
    updateQuantity:(state, action:PayloadAction<{productId:string; variantId:string; quantity:number}>)=>{
      const matchingItem = state.items.find(
        (item)=>item.productId === action.payload.productId && item.variantId === action.payload.variantId
      )
    //   if there is a matching item
    if(matchingItem){
        matchingItem.quantity = action.payload.quantity 
    }
    },
    // we set back the array items to an empty array 
    clearCart:(state)=>{
        state.items =[]
    },
    
setCart: (state, action: PayloadAction<CartItem[]>) => {
  state.items = action.payload;
},



}
})
export const {addToCart, removeFromCart, updateQuantity, clearCart,setCart} =cartSlice.actions
export default cartSlice.reducer;