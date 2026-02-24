'use client';

import Link from 'next/link';
import { ShoppingCart, User } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

export default function Navbar() {
    const totalItems = useCartStore((state) => state.getTotalItems());

    return (
        <>
            <div className="bg-emerald-600 text-white text-xs sm:text-sm font-semibold py-2.5 px-4 text-center tracking-wide">
                📍 Delivery to: EN10 & EN11 | 🚀 Delivered within 24 hours | 💷 Minimum Order: £50
            </div>
            <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20 items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/" className="flex items-center gap-3">
                                <img src="/logo.png" alt="Broxbournefoodcentre logo" className="h-14 md:h-16 w-auto object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                            </Link>
                        </div>

                        <div className="flex items-center space-x-8">
                            <Link href="/shop" className="text-slate-600 hover:text-emerald-600 font-semibold transition-colors">
                                Shop
                            </Link>

                            <button onClick={() => useCartStore.getState().openCart()} className="text-slate-600 hover:text-emerald-600 relative transition-colors group">
                                <ShoppingCart className="h-6 w-6 group-hover:scale-110 transition-transform" />
                                {totalItems > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
                                        {totalItems}
                                    </span>
                                )}
                            </button>
                            <Link href="/login" className="text-slate-600 hover:text-emerald-600 transition-colors">
                                <User className="h-6 w-6 hover:scale-110 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}
