
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/types/product";

interface WishlistState {
  items: Product[];
  isLoading: boolean;
}

const initialState: WishlistState = {
  items: [],
  isLoading: false,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,

  reducers: {
    setWishlist: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
    },

    addToWishlist: (state, action: PayloadAction<Product>) => {
      const exists = state.items.some(
        (item) => item._id === action.payload._id,
      );

      if (!exists) {
        state.items.push(action.payload);
      }
    },

    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item._id !== action.payload,
      );
    },

    clearWishlist: (state) => {
      state.items = [];
    },

    setWishlistLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  setWishlistLoading,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;

