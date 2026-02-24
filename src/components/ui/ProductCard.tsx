'use client';

import Image from 'next/image';
import { useCartStore } from '@/store/useCartStore';
import { useState } from 'react';

interface Product {
    id: string;
    name: string;
    price: number;
    imageUrl?: string | null;
    stockOut: boolean;
}

export default function ProductCard({ product }: { product: Product }) {
    const addItem = useCartStore((state) => state.addItem);
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity,
            imageUrl: product.imageUrl || undefined,
        });
        // Optional: show a toast notification
    };

    return (
        <div className="group border border-transparent hover:border-emerald-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-400 bg-white flex flex-col h-full">
            <div className="relative aspect-square bg-slate-50 overflow-hidden">
                {product.imageUrl ? (
                    <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                        No image
                    </div>
                )}
                {product.stockOut && (
                    <div className="absolute top-3 right-3 bg-red-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                        Out of Stock
                    </div>
                )}
            </div>

            <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-slate-800 line-clamp-2 min-h-[56px] group-hover:text-emerald-700 transition-colors">
                    {product.name}
                </h3>
                <p className="text-2xl font-extrabold text-emerald-600 mt-2">£{product.price.toFixed(2)}</p>

                <div className="mt-auto pt-5 flex items-center gap-3">
                    <div className="flex bg-slate-50 rounded-lg border border-slate-200 p-1">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="px-3 py-1 text-slate-600 hover:bg-white hover:shadow-sm rounded transition-all"
                            disabled={product.stockOut}
                        >
                            -
                        </button>
                        <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-10 text-center bg-transparent appearance-none focus:outline-none font-semibold text-slate-800"
                            disabled={product.stockOut}
                        />
                        <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="px-3 py-1 text-slate-600 hover:bg-white hover:shadow-sm rounded transition-all"
                            disabled={product.stockOut}
                        >
                            +
                        </button>
                    </div>
                    <button
                        onClick={handleAddToCart}
                        disabled={product.stockOut}
                        className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all shadow-sm active:scale-95 ${product.stockOut
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            : 'bg-emerald-500 text-white hover:bg-emerald-600 hover:shadow-emerald-500/25 hover:shadow-lg'
                            }`}
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
}
