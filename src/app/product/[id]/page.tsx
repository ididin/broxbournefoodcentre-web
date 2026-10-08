import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import ProductCard from '@/components/ui/ProductCard';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

type Props = {
  params: Promise<{ id: string }>;
};

function generateSeoText(productName: string, categoryName: string) {
  return `Buy ${productName} online from Broxbourne Food Centre. Your trusted local supermarket offering fast same day delivery and next day delivery for fresh groceries in EN8, EN9, EN10, EN11, Hoddesdon, Cheshunt, and Broxbourne. Order online food delivery, international brands, and daily essentials with cash on delivery and pay on delivery options. Better than Tesco grocery offers and Sainsburys Hoddesdon - shop at the best grocery store near me today!`;
}

function generateSlugId(productName: string, id: string) {
  const slug = productName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  return `${slug}-${id}`;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const idParam = params.id;
  const id = idParam.split('-').pop();

  if (!id) return { title: 'Product Not Found' };

  const product = await prisma.product.findUnique({
    where: { id },
    include: { categoryRef: true }
  });

  if (!product) {
    return { title: 'Product Not Found' };
  }

  const categoryName = product.categoryRef?.name || product.category;
  const price = product.isPromoted && product.promoPrice ? product.promoPrice : product.price;
  const seoDescription = product.description || generateSeoText(product.name, categoryName);
  const fullSlug = generateSlugId(product.name, product.id);

  return {
    title: `${product.name} | Local Grocery Delivery | Broxbourne Food Centre`,
    description: seoDescription,
    keywords: ['Market', 'Supermarket', 'Local Market', 'Market Order', 'shopping delivery', 'food delivery', 'online food delivery', 'EN8', 'EN9', 'EN10', 'EN11', 'Online Delivery', 'grocery store near me', 'grocery delivery', 'next day delivery', 'same day delivery', 'hoddesdon', 'cheshunt', 'broxbourne'],
    alternates: {
      canonical: `https://broxbournefoodcentre.com/product/${fullSlug}`,
    },
    openGraph: {
      title: `${product.name} - Buy Online | Broxbourne Food Centre`,
      description: seoDescription,
      url: `https://broxbournefoodcentre.com/product/${fullSlug}`,
      images: product.imageUrl ? [{ url: product.imageUrl }] : [],
      siteName: 'Broxbourne Food Centre',
      type: 'website',
    },
  };
}

export default async function ProductPage(props: Props) {
  const params = await props.params;
  const idParam = params.id;
  const id = idParam.split('-').pop();

  if (!id) notFound();

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
  const seoDescription = product.description || generateSeoText(product.name, categoryName);
  const fullSlug = generateSlugId(product.name, product.id);

  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.imageUrl ? [product.imageUrl] : [],
    "description": seoDescription,
    "sku": product.barcode || product.id,
    "brand": {
      "@type": "Brand",
      "name": product.brand || "Broxbourne Food Centre"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://broxbournefoodcentre.com/product/${fullSlug}`,
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

          <div className="prose prose-emerald max-w-none mb-8 text-slate-600">
            <p className="leading-relaxed text-lg mb-4">{seoDescription}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Fast Delivery (EN10, EN11, EN8, EN9)</div>
              <div className="flex items-center gap-2 text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Local Supermarket in Broxbourne</div>
              <div className="flex items-center gap-2 text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Pay on Delivery / Cash</div>
              <div className="flex items-center gap-2 text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Same Day & Next Day Options</div>
            </div>
          </div>

          <div className="w-full max-w-sm mt-4">
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
