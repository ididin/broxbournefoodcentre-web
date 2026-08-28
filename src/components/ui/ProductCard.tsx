'use client';

import Image from 'next/image';
import { useCartStore } from '@/store/useCartStore';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useAgeStore } from '@/store/useAgeStore';

interface ProductVariant {
    weightLabel: string;
    price: number;
}

interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    imageUrl?: string | null;
    stockOut: boolean;
    sellType?: 'PIECE' | 'WEIGHT';
    variants?: ProductVariant[];
}

export default function ProductCard({ product }: { product: Product }) {
    const addItem = useCartStore((state) => state.addItem);
    const removeItem = useCartStore((state) => state.removeItem);
    const updateQuantity = useCartStore((state) => state.updateQuantity);

    const hasVariants = product.sellType === 'WEIGHT' && product.variants && product.variants.length > 0;
    
    // Default to the first variant if it's a weight product
    const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
    const activeVariant = hasVariants ? product.variants![selectedVariantIdx] : null;

    const currentPrice = activeVariant ? activeVariant.price : product.price;
    const currentVariantName = activeVariant ? activeVariant.weightLabel : undefined;
    
    // Composite ID for cart
    const cartItemId = `${product.id}-${currentVariantName || 'default'}`;

    const cartItem = useCartStore((state) => state.items.find((i) => i.id === cartItemId));
    const quantityInCart = cartItem?.quantity || 0;

    const { requireVerification } = useAgeStore();

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (product.stockOut) return;

        const performAdd = () => {
            if (quantityInCart === 0) {
                addItem({
                    id: cartItemId,
                    productId: product.id,
                    name: product.name,
                    price: currentPrice,
                    quantity: 1,
                    imageUrl: product.imageUrl || undefined,
                    variantName: currentVariantName
                });
            } else {
                updateQuantity(cartItemId, quantityInCart + 1);
            }
        };

        const isRestricted = /alcohol|tobacco|spirits|beer|wine/i.test(product.category);

        if (isRestricted) {
            requireVerification(performAdd);
        } else {
            performAdd();
        }
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (quantityInCart > 1) {
            updateQuantity(cartItemId, quantityInCart - 1);
        } else {
            removeItem(cartItemId);
        }
    };

    // Extract weight from name for backward compatibility
    const match = product.name.match(/\((.*?)\)/);
    const backwardWeight = match ? match[1] : '';
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
                        <div className="flex flex-col items-center bg-white shadow-sm overflow-hidden w-10 lg:w-8 border border-emerald-100/50">
                            <button
                                onClick={handleAdd}
                                className="w-10 h-10 lg:w-8 lg:h-8 flex items-center justify-center text-emerald-600 hover:bg-emerald-50 transition-colors border-b border-emerald-50 active:bg-emerald-100"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                            <span className="w-10 h-10 lg:w-8 lg:h-8 flex items-center justify-center text-base lg:text-sm font-bold bg-emerald-600 text-white shadow-inner">
                                {quantityInCart}
                            </span>
                            <button
                                onClick={handleRemove}
                                className="w-10 h-10 lg:w-8 lg:h-8 flex items-center justify-center text-emerald-600 hover:bg-emerald-50 transition-colors border-t border-emerald-50 active:bg-emerald-100"
                            >
                                {quantityInCart === 1 ? <Trash2 className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleAdd}
                            disabled={product.stockOut}
                            className={`w-10 h-10 lg:w-8 lg:h-8 flex items-center justify-center transition-all ${product.stockOut
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-white text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 active:bg-emerald-100'
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

            <div className="p-2 sm:p-4 flex flex-col flex-1 pb-3 sm:pb-4">
                <span className="text-[10px] sm:text-xs font-bold text-emerald-600 mb-1 sm:mb-2 uppercase tracking-wider">{product.category}</span>
                <h3 className="text-sm sm:text-base font-bold text-slate-800 leading-snug mb-1">
                    {cleanName}
                </h3>
                
                {!hasVariants && backwardWeight && (
                    <p className="text-xs text-slate-500 mb-1 sm:mb-2 font-medium">{backwardWeight}</p>
                )}

                {hasVariants && (
                    <div className="flex flex-wrap gap-1 mb-2 mt-1">
                        {product.variants!.map((v, idx) => (
                            <button
                                key={idx}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setSelectedVariantIdx(idx);
                                }}
                                className={`text-[10px] sm:text-xs font-semibold px-2 py-1 rounded-full border transition-colors ${
                                    selectedVariantIdx === idx 
                                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                                        : 'bg-white border-gray-200 text-gray-500 hover:border-emerald-300'
                                }`}
                            >
                                {v.weightLabel}
                            </button>
                        ))}
                    </div>
                )}

                <div className="mt-auto pt-2 flex items-center justify-between border-t border-gray-100">
                    <div className="flex flex-col">
                        <span className="text-base sm:text-xl font-black text-slate-900">£{currentPrice.toFixed(2)}</span>
                    </div>
                </div>

                {product.stockOut && (
                    <span className="mt-2 text-[10px] sm:text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-full w-fit">OutOfStock</span>
                )}
            </div>
        </div>
    );
}
