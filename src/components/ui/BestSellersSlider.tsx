'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';

export default function BestSellersSlider({ products }: { products: any[] }) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 300; // Adjust based on card width
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (products.length === 0) {
        return <p className="text-gray-500 italic">No best sellers available yet.</p>;
    }

    return (
        <div className="relative group">
            {/* Left navigation arrow */}
            <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 z-10 bg-white/90 backdrop-blur border border-gray-200 shadow-md text-gray-800 p-2 md:p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 hover:bg-emerald-50 hover:text-emerald-600 focus:outline-none"
                aria-label="Scroll left"
            >
                <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
            </button>

            {/* Scrollable container */}
            <div
                ref={scrollRef}
                className="flex overflow-x-auto gap-6 pb-6 pt-2 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth px-1"
            >
                {products.map((product) => (
                    <div key={product.id} className="min-w-[180px] w-[60vw] sm:w-[calc(33.33%-16px)] md:w-[calc(25%-18px)] lg:w-[calc(16.666%-20px)] flex-shrink-0 snap-start">
                        <ProductCard product={{
                            ...product,
                            category: product.categoryRef?.name || product.category
                        }} />
                    </div>
                ))}
            </div>

            {/* Right navigation arrow */}
            <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 z-10 bg-white/90 backdrop-blur border border-gray-200 shadow-md text-gray-800 p-2 md:p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 hover:bg-emerald-50 hover:text-emerald-600 focus:outline-none"
                aria-label="Scroll right"
            >
                <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
            </button>
        </div>
    );
}
