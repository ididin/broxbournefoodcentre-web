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
        <div className="group border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 bg-white">
            <div className="relative aspect-square bg-gray-50 overflow-hidden">
                {product.imageUrl ? (
                    <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No image
                    </div>
                )}
                {product.stockOut && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        Out of Stock
                    </div>
                )}
            </div>

            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 min-h-[56px]">
                    {product.name}
                </h3>
                <p className="text-xl font-bold text-gray-900 mt-2">£{product.price.toFixed(2)}</p>

                <div className="mt-4 flex items-center gap-2">
                    <div className="flex border border-gray-300 rounded-md">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                            disabled={product.stockOut}
                        >
                            -
                        </button>
                        <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-12 text-center border-x border-gray-300 appearance-none focus:outline-none"
                            disabled={product.stockOut}
                        />
                        <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                            disabled={product.stockOut}
                        >
                            +
                        </button>
                    </div>
                    <button
                        onClick={handleAddToCart}
                        disabled={product.stockOut}
                        className={`flex-1 py-1.5 px-3 rounded-md font-medium transition-colors ${product.stockOut
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-black text-white hover:bg-gray-800'
                            }`}
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
}
