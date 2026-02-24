'use client';

import Image from 'next/image';
import { useCartStore } from '@/store/useCartStore';
import { Plus, Minus, Trash2 } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    price: number;
    imageUrl?: string | null;
    stockOut: boolean;
}

export default function ProductCard({ product }: { product: Product }) {
    const addItem = useCartStore((state) => state.addItem);
    const removeItem = useCartStore((state) => state.removeItem);
    const updateQuantity = useCartStore((state) => state.updateQuantity);

    const cartItem = useCartStore((state) => state.items.find((i) => i.id === product.id));
    const quantityInCart = cartItem?.quantity || 0;

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (product.stockOut) return;

        if (quantityInCart === 0) {
            addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                imageUrl: product.imageUrl || undefined,
            });
        } else {
            updateQuantity(product.id, quantityInCart + 1);
        }
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (quantityInCart > 1) {
            updateQuantity(product.id, quantityInCart - 1);
        } else {
            removeItem(product.id);
        }
    };

    // Extract weight from name (e.g. "Bananas (1kg)" -> match "1kg", clean name -> "Bananas")
    const match = product.name.match(/\((.*?)\)/);
    const weight = match ? match[1] : '';
    const cleanName = product.name.replace(/\(.*?\)/g, '').trim();

    return (
        <div className="group flex flex-col h-full bg-white relative">
            <div className="relative aspect-square bg-slate-50 rounded-2xl border border-gray-100 shadow-sm overflow-hidden group-hover:border-emerald-200 transition-colors">
                {product.imageUrl ? (
                    <Image
                        src={product.imageUrl}
                        alt={cleanName}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                        No image
                    </div>
                )}

                {/* Top Right Add Button Container */}
                <div className="absolute top-2 right-2 z-10 flex flex-col items-end shadow-md rounded-lg overflow-hidden bg-white/90 backdrop-blur-sm border border-emerald-100/50">
                    {quantityInCart > 0 ? (
                        <div className="flex flex-col items-center bg-white shadow-sm overflow-hidden w-8 border border-emerald-100/50">
                            <button
                                onClick={handleAdd}
                                className="w-8 h-8 flex items-center justify-center text-emerald-600 hover:bg-emerald-50 transition-colors border-b border-emerald-50"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                            <span className="w-8 h-8 flex items-center justify-center text-sm font-bold bg-emerald-600 text-white shadow-inner">
                                {quantityInCart}
                            </span>
                            <button
                                onClick={handleRemove}
                                className="w-8 h-8 flex items-center justify-center text-emerald-600 hover:bg-emerald-50 transition-colors border-t border-emerald-50"
                            >
                                {quantityInCart === 1 ? <Trash2 className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleAdd}
                            disabled={product.stockOut}
                            className={`w-8 h-8 flex items-center justify-center transition-all ${product.stockOut
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-white text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700'
                                }`}
                        >
                            <Plus className="w-6 h-6 stroke-[2.5px]" />
                        </button>
                    )}
                </div>

                {product.stockOut && (
                    <div className="absolute inset-0 bg-white/60 flex flex-col items-center justify-center backdrop-blur-[1.5px] rounded-2xl">
                        <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                            Out of Stock
                        </span>
                    </div>
                )}
            </div>

            <div className="pt-2 px-1 flex flex-col mt-1">
                <p className="text-emerald-600 font-extrabold text-lg flex items-baseline gap-[1px]">
                    <span className="text-xs font-bold leading-none">£</span>
                    <span>{product.price.toFixed(2)}</span>
                </p>
                <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 mt-1 leading-[1.3]">
                    {cleanName}
                </h3>
                {weight && (
                    <p className="text-slate-400 text-[11px] font-semibold mt-1">{weight}</p>
                )}
            </div>
        </div>
    );
}
