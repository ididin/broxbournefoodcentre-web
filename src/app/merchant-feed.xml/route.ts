import { prisma } from '@/lib/prisma';
import { buildProductSeo, SITE_URL, STORE_NAME } from '@/lib/seo';

export const dynamic = 'force-dynamic';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generateSlugId(productName: string, id: string): string {
  const slug = productName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  return `${slug}-${id}`;
}

function isExcludedFromMerchantCenter(category: string, name: string): boolean {
  const cat = category.toLowerCase();
  const title = name.toLowerCase();
  // Exclude Tobacco / Nicotine / Vapes AND Alcohol categories or explicit items
  if (
    /\b(tobacco|cigarette|cigarettes|vape|vapes|nicotine|snus|alcohol|alcoholic|beer|beers|wine|wines|whiskey|whisky|raki|rakı|coctail|cocktail|cocktails|vodka|gin|rum|tequila|brandy|liqueur|cider|champagne|prosecco|spirits?)\b/.test(
      cat
    )
  ) {
    return true;
  }
  return /\b(tobacco|cigarette|cigarettes|vape|vapes|nicotine|snus|pablo|velo|zyn|elf bar|lost mary|rolling paper|lighter|beer|wine|whiskey|whisky|raki|rakı|vodka|gin|rum|tequila|brandy|liqueur|cider|champagne|prosecco)\b/.test(
    title
  );
}

function mapGoogleProductCategory(categoryName: string): string {
  const c = categoryName.toLowerCase();
  if (c.includes('fruit') || c.includes('vegetable')) {
    return 'Food, Beverages & Tobacco > Food Items > Fruits & Vegetables';
  }
  if (c.includes('dairy') || c.includes('milk') || c.includes('cheese')) {
    return 'Food, Beverages & Tobacco > Food Items > Dairy Products';
  }
  if (c.includes('bakery') || c.includes('bread') || c.includes('cake') || c.includes('biscuit')) {
    return 'Food, Beverages & Tobacco > Food Items > Bakery';
  }
  if (c.includes('chocolate') || c.includes('candy') || c.includes('jelly') || c.includes('gum') || c.includes('confectionery')) {
    return 'Food, Beverages & Tobacco > Food Items > Candy & Chocolate';
  }
  if (c.includes('chips')) {
    return 'Food, Beverages & Tobacco > Food Items > Snack Foods';
  }
  if (c.includes('beer') || c.includes('wine') || c.includes('whiskey') || c.includes('raki') || c.includes('coctail') || c.includes('alcohol')) {
    return 'Food, Beverages & Tobacco > Beverages > Alcoholic Beverages';
  }
  if (c.includes('soft drink') || c.includes('juice') || c.includes('water') || c.includes('beverage') || c.includes('coffee') || c.includes('tea')) {
    return 'Food, Beverages & Tobacco > Beverages';
  }
  if (c.includes('spice') || c.includes('herb') || c.includes('sauce') || c.includes('jam')) {
    return 'Food, Beverages & Tobacco > Food Items > Condiments & Sauces';
  }
  if (c.includes('pasta') || c.includes('noodle') || c.includes('pulse')) {
    return 'Food, Beverages & Tobacco > Food Items > Pasta & Noodles';
  }
  return 'Food, Beverages & Tobacco > Food Items';
}

const GENERIC_BRANDS = new Set([
  'vegetables', 'vegetable', 'fruits', 'fruit', 'food', 'drinks', 'drink',
  'grocery', 'groceries', 'others', 'other', 'general', 'none', 'n/a',
]);

export async function GET() {
  const products = await prisma.product.findMany({
    where: {
      price: { gt: 0 },
    },
    include: {
      categoryRef: true,
      variants: { orderBy: { sortOrder: 'asc' } },
    },
    orderBy: { storeOrder: 'asc' },
  });

  const itemsXml: string[] = [];

  for (const product of products) {
    if (!product.imageUrl || !product.imageUrl.startsWith('http')) continue;

    const categoryName = product.categoryRef?.name || product.category || 'Groceries';
    if (isExcludedFromMerchantCenter(categoryName, product.name)) continue;

    const fullSlug = generateSlugId(product.name, product.id);
    const link = `${SITE_URL}/product/${fullSlug}`;
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

    const cleanName = product.name.trim().replace(/\s+/g, ' ');
    const regularPrice = product.price;
    const hasSale =
      Boolean(product.isPromoted) &&
      typeof product.promoPrice === 'number' &&
      product.promoPrice > 0 &&
      product.promoPrice < regularPrice;

    const effectivePrice = hasSale ? product.promoPrice! : regularPrice;
    const shippingPrice = effectivePrice >= 50 ? '0.00' : '6.99';

    const rawBrand = product.brand?.trim();
    const brand =
      rawBrand && !GENERIC_BRANDS.has(rawBrand.toLowerCase()) ? rawBrand : STORE_NAME;

    const validGtin =
      product.barcode && /^\d{8,14}$/.test(product.barcode.trim())
        ? product.barcode.trim()
        : null;

    const availability = product.stockOut ? 'out_of_stock' : 'in_stock';
    const googleCategory = mapGoogleProductCategory(categoryName);

    itemsXml.push(`    <item>
      <g:id>${escapeXml(product.id)}</g:id>
      <g:title>${escapeXml(cleanName)}</g:title>
      <g:description>${escapeXml(seo.metaDescription)}</g:description>
      <g:link>${escapeXml(link)}</g:link>
      <g:image_link>${escapeXml(product.imageUrl)}</g:image_link>
      <g:availability>${availability}</g:availability>
      <g:price>${regularPrice.toFixed(2)} GBP</g:price>${
        hasSale
          ? `\n      <g:sale_price>${product.promoPrice!.toFixed(2)} GBP</g:sale_price>`
          : ''
      }
      <g:condition>new</g:condition>
      <g:brand>${escapeXml(brand)}</g:brand>${
        validGtin
          ? `\n      <g:gtin>${escapeXml(validGtin)}</g:gtin>`
          : `\n      <g:identifier_exists>no</g:identifier_exists>`
      }
      <g:google_product_category>${escapeXml(googleCategory)}</g:google_product_category>
      <g:product_type>${escapeXml(categoryName)}</g:product_type>
      <g:shipping>
        <g:country>GB</g:country>
        <g:service>Local Delivery (EN8, EN9, EN10, EN11)</g:service>
        <g:price>${shippingPrice} GBP</g:price>
      </g:shipping>
    </item>`);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>${escapeXml(STORE_NAME)} Product Feed</title>
    <link>${SITE_URL}</link>
    <description>Local online supermarket &amp; grocery delivery in Broxbourne (EN10), Hoddesdon (EN11), Cheshunt &amp; Waltham Cross (EN8), and Waltham Abbey (EN9).</description>
${itemsXml.join('\n')}
  </channel>
</rss>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
    },
  });
}
