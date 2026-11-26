import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import ProductCard from '@/components/ui/ProductCard';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, ChevronRight } from 'lucide-react';
import { buildProductSeo, SITE_URL, STORE_NAME } from '@/lib/seo';

type Props = {
  params: Promise<{ id: string }>;
};

function generateSlugId(productName: string, id: string) {
  const slug = productName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  return `${slug}-${id}`;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const idParam = params.id;
  const id = idParam.split('-').pop();

  if (!id) return { title: 'Product Not Found' };

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      categoryRef: true,
      variants: { orderBy: { sortOrder: 'asc' } },
    },
  });

  if (!product) {
    return { title: 'Product Not Found' };
  }

  const categoryName = product.categoryRef?.name || product.category;
  const fullSlug = generateSlugId(product.name, product.id);
  const seo = buildProductSeo({
    id: product.id,
    name: product.name,
    category: categoryName,
    brand: product.brand,
    description: product.description,
    price: product.price,
    promoPrice: product.promoPrice,
    isPromoted: product.isPromoted,
    sellType: product.sellType,
    variants: product.variants,
  });

  return {
    title: seo.title,
    description: seo.metaDescription,
    keywords: seo.keywords,
    alternates: {
      canonical: `${SITE_URL}/product/${fullSlug}`,
    },
    openGraph: {
      title: seo.ogTitle,
      description: seo.metaDescription,
      url: `${SITE_URL}/product/${fullSlug}`,
      images: product.imageUrl
        ? [{ url: product.imageUrl, alt: `${product.name} - ${STORE_NAME}` }]
        : [],
      siteName: STORE_NAME,
      locale: 'en_GB',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.ogTitle,
      description: seo.metaDescription,
      images: product.imageUrl ? [product.imageUrl] : [],
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
      variants: { orderBy: { sortOrder: 'asc' } },
    },
  });

  if (!product) {
    notFound();
  }

  const price = product.isPromoted && product.promoPrice ? product.promoPrice : product.price;
  const categoryName = product.categoryRef?.name || product.category;
  const fullSlug = generateSlugId(product.name, product.id);
  const productUrl = `${SITE_URL}/product/${fullSlug}`;

  const seo = buildProductSeo({
    id: product.id,
    name: product.name,
    category: categoryName,
    brand: product.brand,
    description: product.description,
    price: product.price,
    promoPrice: product.promoPrice,
    isPromoted: product.isPromoted,
    sellType: product.sellType,
    variants: product.variants,
  });

  const shippingDetails = {
    '@type': 'OfferShippingDetails',
    shippingRate: {
      '@type': 'MonetaryAmount',
      value: price >= 50 ? '0.00' : '6.99',
      currency: 'GBP',
    },
    shippingDestination: {
      '@type': 'DefinedRegion',
      addressCountry: 'GB',
      postalCodeRange: {
        '@type': 'PostalCodeRangeSpecification',
        postalCodeBegin: 'EN8',
        postalCodeEnd: 'EN11',
      },
    },
    deliveryTime: {
      '@type': 'ShippingDeliveryTime',
      handlingTime: {
        '@type': 'QuantitativeValue',
        minValue: 0,
        maxValue: 1,
        unitCode: 'DAY',
      },
      transitTime: {
        '@type': 'QuantitativeValue',
        minValue: 0,
        maxValue: 1,
        unitCode: 'DAY',
      },
    },
  };

  // Always emit a single Offer with explicit `price` so Google Merchant Center
  // reads the exact price on both piece and weighted products.
  const offerSchema = {
    '@type': 'Offer',
    url: productUrl,
    priceCurrency: 'GBP',
    price: price.toFixed(2),
    itemCondition: 'https://schema.org/NewCondition',
    availability: product.stockOut
      ? 'https://schema.org/OutOfStock'
      : 'https://schema.org/InStock',
    shippingDetails,
    hasMerchantReturnPolicy: {
      '@type': 'MerchantReturnPolicy',
      applicableCountry: 'GB',
      returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
      merchantReturnDays: 3,
      returnMethod: 'https://schema.org/ReturnInStore',
      returnFees: 'https://schema.org/FreeReturn',
    },
    seller: {
      '@type': 'GroceryStore',
      name: STORE_NAME,
      url: SITE_URL,
    },
  };

  const productSchema = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: product.imageUrl ? [product.imageUrl] : [],
    description: seo.metaDescription,
    category: categoryName,
    sku: product.barcode || product.id,
    ...(product.barcode && /^\d{8,14}$/.test(product.barcode) ? { gtin: product.barcode } : {}),
    brand: {
      '@type': 'Brand',
      name: product.brand || STORE_NAME,
    },
    offers: offerSchema,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${SITE_URL}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Shop',
        item: `${SITE_URL}/shop`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: categoryName,
        item: `${SITE_URL}/shop?category=${encodeURIComponent(categoryName)}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: product.name,
        item: productUrl,
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <Link href="/shop" className="inline-flex items-center font-medium text-emerald-600 hover:text-emerald-700">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Shop
        </Link>
        <ChevronRight className="w-4 h-4 text-slate-300" />
        <Link
          href={`/shop?category=${encodeURIComponent(categoryName)}`}
          className="hover:text-emerald-600 transition-colors"
        >
          {categoryName}
        </Link>
        <ChevronRight className="w-4 h-4 text-slate-300" />
        <span className="text-slate-800 font-medium truncate max-w-[260px] sm:max-w-md">{product.name}</span>
      </nav>

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
                alt={`${product.name} - ${categoryName} at ${STORE_NAME}`}
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
            <p className="leading-relaxed text-lg mb-4">{seo.pageDescription}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                Fast 24h Delivery ({seo.deliveryBadgeArea})
              </div>
              <div className="flex items-center gap-2 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                Local Supermarket in Broxbourne (EN10 7HY)
              </div>
              <div className="flex items-center gap-2 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                Free Delivery Over £50
              </div>
              <div className="flex items-center gap-2 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                Pay Online, Card or Cash on Delivery
              </div>
            </div>
          </div>

          <div className="w-full max-w-sm mt-4">
            <h2 className="text-sm font-semibold text-slate-500 mb-3">Order Online for Local Delivery</h2>
            <div className="h-[300px]">
              <ProductCard
                product={{
                  id: product.id,
                  name: product.name,
                  category: categoryName,
                  price: product.price,
                  promoPrice: product.promoPrice,
                  isPromoted: product.isPromoted,
                  imageUrl: product.imageUrl,
                  stockOut: product.stockOut,
                  sellType: product.sellType,
                  variants: product.variants,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
