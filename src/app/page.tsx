import Slider from '@/components/ui/Slider';
import ProductCard from '@/components/ui/ProductCard';
import BestSellersSlider from '@/components/ui/BestSellersSlider';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    orderBy: { storeOrder: 'asc' },
    take: 12
  });

  const bestSellers = await prisma.product.findMany({
    where: { isBestSeller: true, stockOut: false },
    orderBy: { storeOrder: 'asc' },
    take: 8,
    include: { categoryRef: true }
  });
  return (
    <div className="flex flex-col gap-16 pb-16">
      <Slider />

      <section className="max-w-7xl flex-1 px-4 sm:px-6 lg:px-8 w-full mt-4 mx-auto relative overflow-hidden">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Best Selling Products</h2>
          <Link href="/shop" className="text-black font-semibold hover:underline">
            View All →
          </Link>
        </div>

        <BestSellersSlider products={bestSellers} />
      </section>

      <section className="bg-white py-16" id="categories">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Shop by Category</h2>
              <p className="text-slate-500 mt-2 text-lg">Browse our wide selection of fresh products.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
            {categories.map((category) => (
              <Link
                href={`/shop?category=${category.slug}`}
                key={category.id}
                className="group relative h-40 sm:h-48 md:h-56 rounded-2xl md:rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 block bg-emerald-50"
              >
                {category.imageUrl ? (
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700 ease-out"
                  />
                ) : (
                  <div className="absolute inset-0 bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold text-xl">
                    {category.name}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent flex items-end p-8">
                  <h3 className="text-2xl font-bold text-white group-hover:-translate-y-2 transition-transform duration-300">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
            {categories.length === 0 && (
              <p className="col-span-full text-gray-500 italic">Categories are being updated...</p>
            )}
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
