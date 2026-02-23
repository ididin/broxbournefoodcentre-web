'use client';

import Link from 'next/link';
import { ShoppingCart, User } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

export default function Navbar() {
    const totalItems = useCartStore((state) => state.getTotalItems());

    return (
        <nav className="bg-white border-b sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="font-bold text-2xl text-gray-900 flex items-center gap-2">
                            <img src="/logo.png" alt="Broxbournefoodcentre logo" className="h-10 w-auto object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                            <span className="hidden sm:block">Broxbourne Food Centre</span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-6">
                        <Link href="/shop" className="text-gray-600 hover:text-gray-900 font-medium">
                            Shop
                        </Link>

                        <button className="text-gray-600 hover:text-gray-900 relative">
                            <ShoppingCart className="h-6 w-6" />
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </button>
                        <Link href="/login" className="text-gray-600 hover:text-gray-900">
                            <User className="h-6 w-6" />
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
