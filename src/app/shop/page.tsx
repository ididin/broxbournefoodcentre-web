import ProductCard from '@/components/ui/ProductCard';

const MOCK_PRODUCTS = [
    { id: 'p1', name: 'Fresh Organic Bananas (1kg)', price: 1.50, imageUrl: 'https://images.unsplash.com/photo-1571501715200-afcb8cc6e927?auto=format&fit=crop&q=80&w=500', stockOut: false, category: 'Produce' },
    { id: 'p2', name: 'Whole Milk (2L)', price: 1.25, imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=500', stockOut: false, category: 'Dairy' },
    { id: 'p3', name: 'Farm Fresh Eggs (12 pk)', price: 2.10, imageUrl: 'https://images.unsplash.com/photo-1582722872421-5a50e5fdcf91?auto=format&fit=crop&q=80&w=500', stockOut: false, category: 'Dairy' },
    { id: 'p4', name: 'Sourdough Bread', price: 3.50, imageUrl: 'https://images.unsplash.com/photo-1589367920969-ab8e050eb0e9?auto=format&fit=crop&q=80&w=500', stockOut: false, category: 'Bakery' },
    { id: 'p5', name: 'Premium Ground Coffee', price: 6.99, imageUrl: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=500', stockOut: false, category: 'Pantry' },
    { id: 'p6', name: 'Olive Oil Extra Virgin', price: 5.49, imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=500', stockOut: false, category: 'Pantry' },
    { id: 'p7', name: 'Sparkling Mineral Water', price: 0.99, imageUrl: 'https://images.unsplash.com/photo-1560624052-449f5ddf0c31?auto=format&fit=crop&q=80&w=500', stockOut: false, category: 'Beverages' },
    { id: 'p8', name: 'Free Range Chicken Breast', price: 4.80, imageUrl: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&q=80&w=500', stockOut: false, category: 'Meat' },
];

export default function Shop() {
    const categories = ['All', 'Produce', 'Dairy', 'Bakery', 'Pantry', 'Beverages', 'Meat'];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row justify-between items-baseline mb-8">
                <h1 className="text-4xl font-bold text-gray-900">All Products</h1>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                <aside className="w-full lg:w-64 flex-shrink-0">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-lg mb-4 border-b pb-2">Categories</h3>
                        <ul className="space-y-3">
                            {categories.map((category) => (
                                <li key={category}>
                                    <button className="text-gray-600 hover:text-black font-medium transition-colors w-full text-left">
                                        {category}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                <main className="flex-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {MOCK_PRODUCTS.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
