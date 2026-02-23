'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const defaultSlides = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80',
        title: 'Fresh Groceries Delivered Daily',
        subtitle: 'Order online and get it delivered within 24 hours.',
        btnText: 'Shop Now',
        href: '/shop'
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=1200&q=80',
        title: 'Huge Variety of Products',
        subtitle: 'From local produce to thousands of household items.',
        btnText: 'View Categories',
        href: '/#categories'
    }
];

export default function Slider({ slides = defaultSlides }) {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    return (
        <div className="relative w-full h-[60vh] max-h-[600px] min-h-[400px] overflow-hidden group">
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                >
                    <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        priority={index === 0}
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="text-center px-4 max-w-3xl transform transition-transform duration-700 translate-y-0">
                            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-md">
                                {slide.title}
                            </h2>
                            <p className="text-lg md:text-2xl text-white/90 mb-8 drop-shadow">
                                {slide.subtitle}
                            </p>
                            <Link
                                href={slide.href}
                                className="inline-block bg-white text-black font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors shadow-lg hover:scale-105"
                            >
                                {slide.btnText}
                            </Link>
                        </div>
                    </div>
                </div>
            ))}

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`h-3 rounded-full transition-all duration-300 ${index === current ? 'w-10 bg-white' : 'w-3 bg-white/50 hover:bg-white/80'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
