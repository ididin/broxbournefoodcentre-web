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
                        <div className="h-full flex flex-col items-center justify-center text-slate-500">
                            <div className="h-24 w-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                                <ShoppingCart className="h-10 w-10 text-emerald-500" />
                            </div>
                            <p className="text-xl font-bold text-slate-800">Your cart is empty</p>
                            <p className="text-slate-500 mt-2 text-center">Looks like you haven't added anything to your cart yet.</p>
                            <button
                                onClick={closeCart}
                                className="mt-8 px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold border-2 border-emerald-600 hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/20 active:scale-95 transition-all w-full"
                            >
                                Start Shopping
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm hover:border-emerald-200 transition-colors group">
                                    <div className="h-24 w-24 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0 relative border border-gray-100">
                                        {item.imageUrl && (
                                            <Image src={item.imageUrl} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                        )}
                                    </div>
                                    <div className="flex-1 flex flex-col pt-1">
                                        <div className="flex justify-between">
                                            <h3 className="font-bold text-slate-800 line-clamp-2 pr-2">{item.name}</h3>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-all"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <p className="text-emerald-600 font-extrabold mt-1 text-lg">£{item.price.toFixed(2)}</p>
                                        <div className="mt-auto flex items-center justify-between">
                                            <div className="flex items-center bg-slate-50 rounded-lg p-1 border border-slate-200">
                                                <button
                                                    className="px-2 py-1 text-slate-600 hover:bg-white rounded shadow-sm hover:text-emerald-600 transition-all font-bold"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                >-</button>
                                                <span className="w-8 text-center text-sm font-bold text-slate-800">{item.quantity}</span>
                                                <button
                                                    className="px-2 py-1 text-slate-600 hover:bg-white rounded shadow-sm hover:text-emerald-600 transition-all font-bold"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                >+</button>
                                            </div>
                                            <p className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
                                                £{(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {items.length > 0 && (
                    <div className="border-t p-6 bg-slate-50 flex flex-col gap-4">
                        <div className="flex justify-between text-lg font-extrabold text-slate-900">
                            <span>Total</span>
                            <span>£{getTotalPrice().toFixed(2)}</span>
                        </div>

                        {getTotalPrice() < 50 ? (
                            <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 p-3 rounded-lg text-center font-medium shadow-sm">
                                Minimum order amount is £50.<br />
                                Please add £{(50 - getTotalPrice()).toFixed(2)} more to checkout.
                            </div>
                        ) : null}

                        <Link
                            href={getTotalPrice() >= 50 ? "/checkout" : "#"}
                            onClick={(e) => {
                                if (getTotalPrice() < 50) {
                                    e.preventDefault();
                                } else {
                                    closeCart();
                                }
                            }}
                            className={`w-full flex justify-center py-3.5 rounded-xl font-bold transition-all shadow-sm ${getTotalPrice() >= 50
                                ? 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/20 active:scale-95'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                }`}
                        >
                            Proceed to Checkout
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}
