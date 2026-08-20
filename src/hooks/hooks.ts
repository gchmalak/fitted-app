import { addToCart, clearCart, removeFromCart, updateQuantity } from "@/store/cartSlice";
import { AppDispatch, RootState } from "@/store/store";
import { CartItem } from "@/types/cart";
import { useDispatch, useSelector } from "react-redux";

export function useCart() {
    const dispatch = useDispatch<AppDispatch>();
    const items = useSelector((state: RootState) => state.cart.items)
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    return {
        items,
        totalItems,
        totalPrice,
        addItem: (item: CartItem) => dispatch(addToCart(item)),
        removeItem: (productId: string, variantId: string) => dispatch(removeFromCart({ productId, variantId })),
        updateItemQuantity: (productId: string, variantId: string, quantity: number) =>
            dispatch(updateQuantity({ productId, variantId, quantity })),
        clear: () => dispatch(clearCart())
    }

}