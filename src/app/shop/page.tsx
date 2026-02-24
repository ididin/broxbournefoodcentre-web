'use client';

import { useState } from 'react';
import ProductCard from '@/components/ui/ProductCard';
import { Search } from 'lucide-react';

const CATEGORIES = [
    {
        id: 'c1',
        name: 'Produce',
        subcategories: ['Fruit', 'Vegetables', 'Salads'],
    },
    {
        id: 'c2',
        name: 'Dairy & Eggs',
        subcategories: ['Milk', 'Cheese', 'Eggs', 'Yogurt'],
    },
    {
        id: 'c3',
        name: 'Bakery',
        subcategories: ['Bread', 'Pastries', 'Bagels'],
    },
    {
        id: 'c4',
        name: 'Beverages',
        subcategories: ['Water', 'Juice', 'Soda', 'Coffee'],
    },
    {
        id: 'c5',
        name: 'Pantry',
        subcategories: ['Oils', 'Spices', 'Canned Goods'],
    },
    {
        id: 'c6',
        name: 'Meat & Seafood',
        subcategories: ['Chicken', 'Beef', 'Fish'],
    }
];

const MOCK_PRODUCTS = [
    { id: 'p1', name: 'Fresh Organic Bananas (1kg)', price: 1.50, imageUrl: 'https://images.unsplash.com/photo-1571501715200-afcb8cc6e927?auto=format&fit=crop&q=80&w=500', stockOut: false, category: 'Produce', subcategory: 'Fruit' },
    { id: 'p2', name: 'Whole Milk (2L)', price: 1.25, imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=500', stockOut: false, category: 'Dairy & Eggs', subcategory: 'Milk' },
    { id: 'p3', name: 'Farm Fresh Eggs (12 pk)', price: 2.10, imageUrl: 'https://images.unsplash.com/photo-1582722872421-5a50e5fdcf91?auto=format&fit=crop&q=80&w=500', stockOut: false, category: 'Dairy & Eggs', subcategory: 'Eggs' },
    { id: 'p4', name: 'Sourdough Bread', price: 3.50, imageUrl: 'https://images.unsplash.com/photo-1589367920969-ab8e050eb0e9?auto=format&fit=crop&q=80&w=500', stockOut: false, category: 'Bakery', subcategory: 'Bread' },
    { id: 'p5', name: 'Premium Ground Coffee', price: 6.99, imageUrl: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=500', stockOut: false, category: 'Beverages', subcategory: 'Coffee' },
    { id: 'p6', name: 'Olive Oil Extra Virgin', price: 5.49, imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=500', stockOut: false, category: 'Pantry', subcategory: 'Oils' },
    { id: 'p7', name: 'Sparkling Mineral Water', price: 0.99, imageUrl: 'https://images.unsplash.com/photo-1560624052-449f5ddf0c31?auto=format&fit=crop&q=80&w=500', stockOut: false, category: 'Beverages', subcategory: 'Water' },
    { id: 'p8', name: 'Free Range Chicken Breast', price: 4.80, imageUrl: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&q=80&w=500', stockOut: false, category: 'Meat & Seafood', subcategory: 'Chicken' },
    { id: 'p9', name: 'Fresh Apples (1kg)', price: 2.50, imageUrl: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=500', stockOut: false, category: 'Produce', subcategory: 'Fruit' },
    { id: 'p10', name: 'Cheddar Cheese (250g)', price: 3.20, imageUrl: 'https://images.unsplash.com/photo-1618164422027-55739bc4e240?auto=format&fit=crop&q=80&w=500', stockOut: false, category: 'Dairy & Eggs', subcategory: 'Cheese' },
    { id: 'p11', name: 'Fresh Tomatoes', price: 1.80, imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=500', stockOut: false, category: 'Produce', subcategory: 'Vegetables' },
    { id: 'p12', name: 'Orange Juice (1L)', price: 2.50, imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=500', stockOut: false, category: 'Beverages', subcategory: 'Juice' },
];

export default function Shop() {
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredProducts = MOCK_PRODUCTS.filter((product) => {
        const matchCategory = selectedCategory === 'All' || product.category === selectedCategory;
        const matchSubcategory = !selectedSubcategory || product.subcategory === selectedSubcategory;
        const matchSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCategory && matchSubcategory && matchSearch;
    });

    const activeSubcategories = CATEGORIES.find(c => c.name === selectedCategory)?.subcategories || [];

    const handleCategoryClick = (categoryName: string) => {
        setSelectedCategory(categoryName);
        setSelectedSubcategory(null); // Reset subcategory when changing main category
    };

    return (
        <div className="flex min-h-screen bg-[#f8f9fa]">
            {/* Left Sidebar - Categories (Sticky) */}
            <aside className="hidden lg:block w-72 bg-white border-r border-gray-200 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto custom-scrollbar">
                <div className="p-6">
                    <h2 className="text-xl font-extrabold text-slate-800 mb-6">Categories</h2>
                    <ul className="space-y-2">
                        <li>
                            <button
                                onClick={() => handleCategoryClick('All')}
                                className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-all ${selectedCategory === 'All'
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm'
                                        : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                All Products
                            </button>
                        </li>
                        {CATEGORIES.map((cat) => (
                            <li key={cat.id}>
                                <button
                                    onClick={() => handleCategoryClick(cat.name)}
                                    className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-all ${selectedCategory === cat.name
                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm'
                                            : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    {cat.name}
                                </button>
                                {/* Subcategories Accordion */}
                                {selectedCategory === cat.name && cat.subcategories.length > 0 && (
                                    <ul className="mt-2 ml-4 space-y-1 border-l-2 border-emerald-100 pl-4 py-2">
                                        {cat.subcategories.map(sub => (
                                            <li key={sub}>
                                                <button
                                                    onClick={() => setSelectedSubcategory(sub)}
                                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-all ${selectedSubcategory === sub
                                                            ? 'text-emerald-700 bg-emerald-50 shadow-sm'
                                                            : 'text-slate-500 hover:text-emerald-600 hover:bg-slate-50'
                                                        }`}
                                                >
                                                    {sub}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8">
                {/* Search Header */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between gap-4 mb-8 sticky top-24 z-40">
                    <div className="relative w-full sm:max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-600" />
                        <input
                            type="text"
                            placeholder="Search thousands of products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-emerald-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium text-slate-800 placeholder:text-slate-400 outline-none"
                        />
                    </div>
                </div>

                {/* Subcategory Pills (Mobile/Row view) */}
                {selectedCategory !== 'All' && activeSubcategories.length > 0 && (
                    <div className="flex lg:hidden gap-3 mb-6 overflow-x-auto pb-2 custom-scrollbar">
                        <button
                            onClick={() => setSelectedSubcategory(null)}
                            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold border transition-all ${selectedSubcategory === null
                                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                                    : 'bg-white text-slate-600 border-gray-200 hover:border-emerald-500 hover:text-emerald-600'
                                }`}
                        >
                            All {selectedCategory}
                        </button>
                        {activeSubcategories.map(sub => (
                            <button
                                key={sub}
                                onClick={() => setSelectedSubcategory(sub)}
                                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold border transition-all ${selectedSubcategory === sub
                                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                                        : 'bg-white text-slate-600 border-gray-200 hover:border-emerald-500 hover:text-emerald-600'
                                    }`}
                            >
                                {sub}
                            </button>
                        ))}
                    </div>
                )}

                {/* Products Grid - Getir Style (6 col on large screens) */}
                <h1 className="text-2xl font-extrabold text-slate-900 mb-6">
                    {selectedSubcategory ? `${selectedSubcategory} (${filteredProducts.length})`
                        : selectedCategory !== 'All' ? `${selectedCategory} (${filteredProducts.length})`
                            : `All Products (${filteredProducts.length})`}
                </h1>

                {filteredProducts.length === 0 ? (
                    <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm">
                        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="h-10 w-10 text-emerald-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-2">No products found</h3>
                        <p className="text-slate-500 text-lg">Try adjusting your search or category filter to find what you're looking for.</p>
                        <button
                            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSelectedSubcategory(null); }}
                            className="mt-8 px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/20 transition-all active:scale-95"
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
