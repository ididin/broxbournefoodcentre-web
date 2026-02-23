import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
}

interface CartStore {
    items: CartItem[];
    isCartOpen: boolean;
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            isCartOpen: false,
            addItem: (item) => {
                const currentItems = get().items;
                const existingItemIndex = currentItems.findIndex((i) => i.id === item.id);

                if (existingItemIndex > -1) {
                    const newItems = [...currentItems];
                    newItems[existingItemIndex].quantity += item.quantity;
                    set({ items: newItems });
                } else {
                    set({ items: [...currentItems, item] });
                }
                // Auto open cart on add
                set({ isCartOpen: true });
            },
            removeItem: (id) => {
                set({ items: get().items.filter((item) => item.id !== id) });
            },
            updateQuantity: (id, quantity) => {
                set({
                    items: get().items.map((item) =>
                        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
                    ),
                });
            },
            clearCart: () => set({ items: [] }),
            getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
            getTotalPrice: () => get().items.reduce((total, item) => total + item.price * item.quantity, 0),
            openCart: () => set({ isCartOpen: true }),
            closeCart: () => set({ isCartOpen: false }),
            toggleCart: () => set({ isCartOpen: !get().isCartOpen }),
        }),
        {
            name: 'broxbourne-cart',
        }
    )
);
