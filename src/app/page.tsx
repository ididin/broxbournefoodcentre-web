import Slider from '@/components/ui/Slider';
import ProductCard from '@/components/ui/ProductCard';
import Link from 'next/link';
import Image from 'next/image';

const MOCK_BEST_SELLERS = [
  {
    id: 'prod-1',
    name: 'Fresh Organic Bananas (1kg)',
    price: 1.50,
    imageUrl: 'https://images.unsplash.com/photo-1571501715200-afcb8cc6e927?auto=format&fit=crop&q=80&w=500',
    stockOut: false,
    category: 'Produce',
  },
  {
    id: 'prod-2',
    name: 'Whole Milk (2L)',
    price: 1.25,
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=500',
    stockOut: false,
    category: 'Dairy',
  },
  {
    id: 'prod-3',
    name: 'Farm Fresh Eggs (12 pk)',
    price: 2.10,
    imageUrl: 'https://images.unsplash.com/photo-1582722872421-5a50e5fdcf91?auto=format&fit=crop&q=80&w=500',
    stockOut: false,
    category: 'Dairy',
  },
  {
    id: 'prod-4',
    name: 'Sourdough Bread',
    price: 3.50,
    imageUrl: 'https://images.unsplash.com/photo-1589367920969-ab8e050eb0e9?auto=format&fit=crop&q=80&w=500',
    stockOut: false,
    category: 'Bakery',
  },
];

const CATEGORIES = [
  { name: 'Fresh Produce', image: 'https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&q=80&w=400', slug: 'produce' },
  { name: 'Dairy & Eggs', image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&q=80&w=400', slug: 'dairy' },
  { name: 'Bakery', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400', slug: 'bakery' },
  { name: 'Meat & Seafood', image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&q=80&w=400', slug: 'meat' },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-16 pb-16">
      <Slider />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-4">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Best Selling Products</h2>
          <Link href="/shop" className="text-black font-semibold hover:underline">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_BEST_SELLERS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="bg-white py-16" id="categories">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Shop by Category</h2>
              <p className="text-slate-500 mt-2 text-lg">Browse our wide selection of fresh products.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.map((category) => (
              <Link
                href={`/shop?category=${category.slug}`}
                key={category.name}
                className="group relative h-72 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 block"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent flex items-end p-8">
                  <h3 className="text-2xl font-bold text-white group-hover:-translate-y-2 transition-transform duration-300">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-12">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-[2rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 shadow-xl shadow-emerald-500/10">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">Fast Delivery in Broxbourne</h2>
            <p className="text-emerald-50 text-lg md:text-xl mb-10 leading-relaxed font-medium">
              We deliver your favorite groceries and house essentials within 24 hours right to your doorstep. Guaranteed freshness.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-white text-emerald-700 font-extrabold py-4 px-10 rounded-full hover:bg-emerald-50 hover:scale-105 transition-all shadow-lg"
            >
              Start Shopping Now
            </Link>
          </div>
          <div className="relative w-full md:w-1/2 aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500 max-w-md">
            <Image
              src="https://images.unsplash.com/photo-1615469363071-7eb9273c8d35?auto=format&fit=crop&q=80&w=800"
              alt="Fast Grocery Delivery"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
