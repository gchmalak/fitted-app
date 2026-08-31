import { createSlice } from "@reduxjs/toolkit";

interface UIState {
  isCartOpen: boolean;
}

const initialState: UIState = {
  isCartOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openCart: (state) => {
      state.isCartOpen = true;
    },
    closeCart: (state) => {
      state.isCartOpen = false;
    },
    toggleCart: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },
  },
});

export const { openCart, closeCart, toggleCart } = uiSlice.actions;
export default uiSlice.reducer;