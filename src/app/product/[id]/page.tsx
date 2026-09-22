import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import ProductCard from '@/components/ui/ProductCard';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { categoryRef: true }
  });

  if (!product) {
    return { title: 'Product Not Found' };
  }

  const categoryName = product.categoryRef?.name || product.category;
  const price = product.isPromoted && product.promoPrice ? product.promoPrice : product.price;

  return {
    title: `${product.name} | ${categoryName} | Broxbourne Food Centre`,
    description: product.description || `Buy ${product.name} online. Fast delivery in Broxbourne, EN10, EN11, EN8, EN9.`,
    alternates: {
      canonical: `https://broxbournefoodcentre.com/product/${product.id}`,
    },
    openGraph: {
      title: product.name,
      description: `Buy ${product.name} online for £${price.toFixed(2)}. Fresh groceries delivered to Broxbourne.`,
      url: `https://broxbournefoodcentre.com/product/${product.id}`,
      images: product.imageUrl ? [{ url: product.imageUrl }] : [],
      siteName: 'Broxbourne Food Centre',
      type: 'website', // using website or article, ideally product but Next.js OG type product is limited. we will use JSON-LD for product.
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { 
      categoryRef: true,
      variants: { orderBy: { sortOrder: 'asc' } } 
    }
  });

  if (!product) {
    notFound();
  }

  const price = product.isPromoted && product.promoPrice ? product.promoPrice : product.price;
  const categoryName = product.categoryRef?.name || product.category;

  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.imageUrl ? [product.imageUrl] : [],
    "description": product.description || `Buy ${product.name} from Broxbourne Food Centre.`,
    "sku": product.barcode || product.id,
    "brand": {
      "@type": "Brand",
      "name": product.brand || "Broxbourne Food Centre"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://broxbournefoodcentre.com/product/${product.id}`,
      "priceCurrency": "GBP",
      "price": price.toFixed(2),
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.stockOut ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Broxbourne Food Centre"
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      
      <div className="mb-6">
        <Link href="/shop" className="inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-700">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Shop
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center min-h-[300px] relative">
           {product.isPromoted && (
              <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-xs font-black px-3 py-1.5 rounded-lg shadow-sm">
                  PROMO
              </div>
          )}
          {product.imageUrl ? (
            <div className="relative w-full h-[400px]">
              <Image 
                src={product.imageUrl} 
                alt={product.name}
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <div className="text-slate-300">No Image Available</div>
          )}
        </div>

        <div className="flex flex-col justify-center">
          <span className="text-sm font-bold text-emerald-600 mb-2 uppercase tracking-wider">
            {categoryName}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">
            {product.name}
          </h1>
          
          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-black text-slate-900">
              £{price.toFixed(2)}
            </span>
            {product.isPromoted && product.promoPrice && (
              <span className="text-xl text-slate-400 line-through font-semibold">
                £{product.price.toFixed(2)}
              </span>
            )}
          </div>

          {product.description && (
            <p className="text-slate-600 mb-8 leading-relaxed">
              {product.description}
            </p>
          )}

          <div className="w-full max-w-sm">
            <h3 className="text-sm font-semibold text-slate-500 mb-3">Order Now</h3>
            <div className="h-[300px]">
              <ProductCard product={{
                id: product.id,
                name: product.name,
                category: categoryName,
                price: product.price,
                promoPrice: product.promoPrice,
                isPromoted: product.isPromoted,
                imageUrl: product.imageUrl,
                stockOut: product.stockOut,
                sellType: product.sellType,
                variants: product.variants
              }} />
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
