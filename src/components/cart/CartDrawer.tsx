'use client';

import { useCartStore } from '@/store/useCartStore';
import { ShoppingCart, X, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CartDrawer() {
    const { items, isCartOpen, closeCart, updateQuantity, removeItem, getTotalPrice } = useCartStore();

    if (!isCartOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm transition-opacity"
                onClick={closeCart}
            />

            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] transform transition-transform duration-300 flex flex-col">
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <ShoppingCart className="h-6 w-6" />
                        Your Cart
                    </h2>
                    <button onClick={closeCart} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500">
                            <ShoppingCart className="h-16 w-16 mb-4 opacity-20" />
                            <p className="text-lg">Your cart is empty</p>
                            <button
                                onClick={closeCart}
                                className="mt-6 px-6 py-2 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="h-24 w-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 relative">
                                        {item.imageUrl && (
                                            <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                                        )}
                                    </div>
                                    <div className="flex-1 flex flex-col">
                                        <div className="flex justify-between">
                                            <h3 className="font-medium text-gray-900 line-clamp-2">{item.name}</h3>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <p className="text-black font-bold mt-1">£{item.price.toFixed(2)}</p>
                                        <div className="mt-auto flex items-center gap-3">
                                            <div className="flex items-center border rounded-md">
                                                <button
                                                    className="px-2 py-1 text-gray-600 hover:bg-gray-50"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                >-</button>
                                                <span className="w-8 text-center text-sm">{item.quantity}</span>
                                                <button
                                                    className="px-2 py-1 text-gray-600 hover:bg-gray-50"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                >+</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {items.length > 0 && (
                    <div className="border-t p-6 bg-gray-50">
                        <div className="flex justify-between text-lg font-bold mb-4">
                            <span>Total</span>
                            <span>£{getTotalPrice().toFixed(2)}</span>
                        </div>
                        <Link
                            href="/checkout"
                            onClick={closeCart}
                            className="w-full flex justify-center py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-900 transition-colors"
                        >
                            Proceed to Checkout
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}
