'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/ui/ProductCard';
import { Search, Loader2 } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import CartSidebar from '@/components/cart/CartSidebar';

export default function Shop() {
    const { items } = useCartStore();
    const [categories, setCategories] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        Promise.all([
            fetch('/api/admin/categories').then(res => res.json()),
            fetch('/api/admin/products').then(res => res.json())
        ]).then(([cats, prods]) => {
            // Reformat categories into parent-child structure for UI
            const topLevel = cats.filter((c: any) => !c.parentId);
            const formattedCats = topLevel.map((parent: any) => ({
                id: parent.id,
                name: parent.name,
                subcategories: cats.filter((c: any) => c.parentId === parent.id).map((c: any) => c.name)
            }));

            setCategories(formattedCats);
            setProducts(prods);
            setLoading(false);
        }).catch(err => {
            console.error('Failed to load shop data', err);
            setLoading(false);
        });
    }, []);

    const filteredProducts = products.filter((product) => {
        // Handle relation and fallback string
        const pCat = product.categoryRef ? product.categoryRef.name : product.category;

        // Find if selectedCategory is a parent of pCat
        let isInCategoryOrSub = false;
        if (selectedCategory === 'All') {
            isInCategoryOrSub = true;
        } else if (pCat === selectedCategory) {
            isInCategoryOrSub = true;
        } else {
            // check if pCat is a subcategory of selectedCategory
            const parentCatObj = categories.find(c => c.name === selectedCategory);
            if (parentCatObj && parentCatObj.subcategories.includes(pCat)) {
                isInCategoryOrSub = true;
            }
        }

        const matchSubcategory = !selectedSubcategory || pCat === selectedSubcategory;
        const matchSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());

        return isInCategoryOrSub && matchSubcategory && matchSearch;
    });

    const activeSubcategories = categories.find(c => c.name === selectedCategory)?.subcategories || [];

    const handleCategoryClick = (categoryName: string) => {
        setSelectedCategory(categoryName);
        setSelectedSubcategory(null);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#f8f9fa]">
                <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#f8f9fa] overflow-x-hidden">
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
                        {categories.map((cat) => (
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
                                        {cat.subcategories.map((sub: string) => (
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
            <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
                {/* Mobile Main Categories Row */}
                <div className="flex lg:hidden gap-3 mb-4 overflow-x-auto pb-2 custom-scrollbar snap-x">
                    <button
                        onClick={() => handleCategoryClick('All')}
                        className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold border transition-all flex-shrink-0 snap-start ${selectedCategory === 'All'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                            : 'bg-white text-slate-600 border-gray-200 hover:border-emerald-500 hover:text-emerald-600'
                            }`}
                    >
                        All Products
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => handleCategoryClick(cat.name)}
                            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold border transition-all flex-shrink-0 snap-start ${selectedCategory === cat.name
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                                : 'bg-white text-slate-600 border-gray-200 hover:border-emerald-500 hover:text-emerald-600'
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Search Header */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col justify-between gap-4 mb-6">
                    <div className="relative w-full">
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
                        {activeSubcategories.map((sub: string) => (
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

                {/* Products Grid */}
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
                    <div className={`grid gap-3 sm:gap-4 lg:gap-5 ${items.length > 0
                        ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4'
                        : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
                        }`}>
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </main>

            {/* Right Sidebar - Desktop Cart */}
            <CartSidebar />
        </div>
    );
}
