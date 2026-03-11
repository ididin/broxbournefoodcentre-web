'use client';

import { useCartStore } from '@/store/useCartStore';
import { ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function FloatingCart() {
    const { items, getTotalItems, getTotalPrice, openCart } = useCartStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || items.length === 0) return null;

    return (
        <button
            onClick={openCart}
            className="md:hidden fixed bottom-6 right-6 z-50 bg-emerald-600 text-white p-4 rounded-full shadow-2xl flex items-center gap-3 hover:bg-emerald-700 hover:scale-105 active:scale-95 transition-all outline-none animate-in fade-in slide-in-from-bottom-8 duration-500"
            aria-label="Open cart"
        >
            <div className="relative">
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-3 -right-3 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-emerald-600">
                    {getTotalItems()}
                </span>
            </div>
            <div className="flex flex-col items-start pr-1">
                <span className="text-[10px] font-medium opacity-80 leading-none">Total</span>
                <span className="text-sm font-bold leading-none mt-1">£{getTotalPrice().toFixed(2)}</span>
            </div>
        </button>
    );
}
