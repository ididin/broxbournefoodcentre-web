'use client';

import { useCartStore } from '@/store/useCartStore';
import { ShoppingCart, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CartSidebar() {
    const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore();

    if (items.length === 0) return null;

    return (
        <aside className="hidden lg:flex w-[320px] xl:w-[380px] bg-white border-l border-gray-200 sticky top-20 h-[calc(100vh-5rem)] flex-col shadow-[-4px_0_24px_-12px_rgba(0,0,0,0.1)] z-30">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white">
                <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                    <span className="bg-emerald-100 p-2 rounded-lg"><ShoppingCart className="h-5 w-5 text-emerald-600" /></span>
                    My Cart
                </h2>
                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-bold">
                    {items.reduce((acc, item) => acc + item.quantity, 0)} items
                </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50/50">
                {items.map((item) => (
                    <div key={item.id} className="flex gap-3 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm hover:border-emerald-200 transition-colors group">
                        <div className="h-20 w-20 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0 relative border border-gray-50">
                            {item.imageUrl && (
                                <Image src={item.imageUrl} alt={item.name} fill className="object-contain p-2 group-hover:scale-110 transition-transform duration-500" />
                            )}
                        </div>
                        <div className="flex-1 flex flex-col">
                            <div className="flex justify-between items-start gap-2">
                                <h3 className="font-bold text-slate-800 text-[13px] leading-tight line-clamp-2">{item.name}</h3>
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="text-slate-300 hover:text-red-500 transition-colors shrink-0"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>

                            <p className="text-emerald-600 font-extrabold mt-1">£{item.price.toFixed(2)}</p>

                            <div className="mt-auto flex items-center justify-between pt-2">
                                <div className="flex items-center bg-slate-50 rounded-lg p-0.5 border border-slate-200">
                                    <button
                                        className="h-7 w-7 flex items-center justify-center text-slate-600 hover:bg-white rounded-md shadow-sm hover:text-emerald-600 transition-all font-bold"
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    >-</button>
                                    <span className="w-8 text-center text-sm font-bold text-slate-800">{item.quantity}</span>
                                    <button
                                        className="h-7 w-7 flex items-center justify-center text-slate-600 hover:bg-white rounded-md shadow-sm hover:text-emerald-600 transition-all font-bold"
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    >+</button>
                                </div>
                                <p className="text-[13px] font-bold text-slate-500">
                                    £{(item.price * item.quantity).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="border-t border-gray-100 p-5 bg-white flex flex-col gap-4 shadow-[0_-4px_24px_-12px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between text-lg font-extrabold text-slate-900 border-b border-dashed border-gray-200 pb-4">
                    <span>Total Amount</span>
                    <span className="text-emerald-600">£{getTotalPrice().toFixed(2)}</span>
                </div>

                {getTotalPrice() < 50 ? (
                    <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 p-2.5 rounded-lg text-center font-bold">
                        Minimum order £50. Add £{(50 - getTotalPrice()).toFixed(2)} more.
                    </div>
                ) : null}

                <Link
                    href={getTotalPrice() >= 50 ? "/checkout" : "#"}
                    onClick={(e) => {
                        if (getTotalPrice() < 50) e.preventDefault();
                    }}
                    className={`w-full flex items-center justify-between py-4 px-6 rounded-xl font-bold transition-all shadow-sm ${getTotalPrice() >= 50
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/20 active:scale-95'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                >
                    <span>Proceed to Checkout</span>
                    <span>→</span>
                </Link>
            </div>
        </aside>
    );
}
