import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
// i should add the auth slices later 
// configurestore: redux tool that creates the actual store by combining the slices(cart in here with all its reducers )
export const store = configureStore({
    reducer:{
        cart:cartReducer, // so that we access the cart just by using cart later 
    },
})
export type RootState = ReturnType <typeof store.getState>
export type AppDispatch = typeof store.dispatch