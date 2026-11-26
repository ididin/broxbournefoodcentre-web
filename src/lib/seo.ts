export interface ProductSeoInput {
  id: string;
  name: string;
  category: string;
  brand?: string | null;
  description?: string | null;
  price: number;
  promoPrice?: number | null;
  isPromoted?: boolean;
  sellType?: 'PIECE' | 'WEIGHT' | string;
  variants?: { weightLabel: string; price: number; promoPrice?: number | null }[];
}

export interface ProductSeoOutput {
  title: string;
  metaDescription: string;
  pageDescription: string;
  ogTitle: string;
  keywords: string[];
  deliveryBadgeArea: string;
}

export const SITE_URL = 'https://broxbournefoodcentre.com';
export const STORE_NAME = 'Broxbourne Food Centre';

export const DELIVERY_POSTCODES = ['EN10', 'EN11', 'EN8', 'EN9'] as const;

export const DELIVERY_TOWNS = [
  'Broxbourne',
  'Hoddesdon',
  'Cheshunt',
  'Waltham Cross',
  'Waltham Abbey',
  'Wormley',
  'Turnford',
  'Nazeing',
] as const;

/**
 * Deterministic hash so each product consistently gets its own unique copy angle
 * without flickering across requests or SSR/hydration.
 */
function hashString(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0);
}

function pick<T>(arr: readonly T[], seed: number, offset = 0): T {
  return arr[(seed + offset) % arr.length];
}

/**
 * Detects whether a database product description is genuinely informative
 * rather than a 1-word tag (e.g. "Juice", "Redbull", "Biscuit") or a duplicate of the product name.
 */
export function hasMeaningfulDescription(
  description: string | null | undefined,
  productName: string
): boolean {
  if (!description) return false;
  const cleanDesc = description.trim();
  if (cleanDesc.length < 45) return false;

  const normDesc = cleanDesc.toLowerCase().replace(/[^a-z0-9]+/g, '');
  const normName = productName.toLowerCase().replace(/[^a-z0-9]+/g, '');
  if (normDesc === normName || normDesc.length <= normName.length + 8) {
    return false;
  }

  return true;
}

interface CategoryProfile {
  nouns: string[];
  benefits: string[];
  intents: string[];
  keywords: string[];
}

function getCategoryProfile(categoryName: string): CategoryProfile {
  const c = categoryName.toLowerCase();

  if (c.includes('fruit') || c.includes('vegetable')) {
    return {
      nouns: ['fresh produce', 'farm-fresh greens & fruit', 'hand-picked market produce', 'daily fresh groceries'],
      benefits: [
        'Hand-selected every morning for peak crispness and flavour',
        'Picked fresh from our local greengrocer aisle for your kitchen',
        'Packed carefully so it arrives crisp, fresh, and ready to cook',
        'Quality local market produce brought straight to your doorstep',
      ],
      intents: ['fresh produce delivery', 'online greengrocer', 'fresh food shopping', 'local grocery delivery'],
      keywords: ['fresh produce delivery', 'fruit and veg delivery near me', 'local greengrocer delivery', 'fresh groceries online'],
    };
  }

  if (c.includes('dairy') || c.includes('milk') || c.includes('cheese')) {
    return {
      nouns: ['chilled dairy essentials', 'fresh fridge staples', 'everyday dairy groceries', 'family dairy favourites'],
      benefits: [
        'Kept chilled and fresh until it reaches your front door',
        'Ideal for family breakfasts, cooking, and everyday fridge top-ups',
        'Freshly stocked daily at our local Broxbourne supermarket',
        'Convenient doorstep delivery for your weekly chilled shopping',
      ],
      intents: ['dairy delivery', 'chilled grocery shopping', 'online supermarket', 'local milk & dairy delivery'],
      keywords: ['dairy delivery near me', 'fresh milk and cheese delivery', 'local supermarket delivery', 'online grocery shopping'],
    };
  }

  if (c.includes('bakery') || c.includes('bread') || c.includes('cake') || c.includes('biscuit')) {
    return {
      nouns: ['bakery treats & tea-time favourites', 'freshly stocked bakes & biscuits', 'sweet treats & snacks', 'everyday bakery essentials'],
      benefits: [
        'Great for morning tea, lunchboxes, or sharing with family at home',
        'Stock up your cupboard without leaving home',
        'A popular pick from our local supermarket snack & bakery aisle',
        'Delivered right to your door for easy home shopping',
      ],
      intents: ['online snack shopping', 'bakery delivery', 'supermarket delivery', 'local grocery store'],
      keywords: ['bakery delivery near me', 'biscuits and snacks online', 'online supermarket near me', 'home grocery delivery'],
    };
  }

  if (c.includes('chocolate') || c.includes('candy') || c.includes('jelly') || c.includes('gum') || c.includes('confectionery') || c.includes('chips')) {
    return {
      nouns: ['sweets & snacks', 'treats & nibbles', 'movie-night snacks', 'family-favourite treats'],
      benefits: [
        'Perfect for film nights, sharing with friends, or a quick sweet craving',
        'Skip the corner shop run and get your favourite treats delivered home',
        'Always freshly stocked in our local supermarket confectionery aisle',
        'Easy online ordering with doorstep delivery across your neighbourhood',
      ],
      intents: ['snack delivery', 'sweet shop delivery', 'online convenience store', 'supermarket delivery near me'],
      keywords: ['snack delivery near me', 'chocolate and sweets delivery', 'late night grocery delivery', 'online corner shop'],
    };
  }

  if (c.includes('soft drink') || c.includes('juice') || c.includes('water') || c.includes('beverage') || c.includes('coffee') || c.includes('tea')) {
    return {
      nouns: ['refreshing drinks', 'cold beverages & pantry drinks', 'everyday drinks', 'chilled refreshment'],
      benefits: [
        'Save yourself carrying heavy bottles and packs from the shop',
        'Ideal for stocking the fridge, family meals, or busy weekdays',
        'Delivered straight to your doorstep by our local drivers',
        'Quick and easy online drinks shopping from your neighbourhood supermarket',
      ],
      intents: ['drinks delivery', 'online supermarket drinks', 'beverage delivery near me', 'local grocery delivery'],
      keywords: ['drinks delivery near me', 'soft drinks home delivery', 'online supermarket delivery', 'grocery delivery near me'],
    };
  }

  if (c.includes('alcohol') || c.includes('beer') || c.includes('wine') || c.includes('whiskey') || c.includes('raki') || c.includes('coctail') || c.includes('cocktail') || c.includes('spirit')) {
    return {
      nouns: ['beers, wines & spirits', 'off-licence favourites', 'drinks for the weekend', 'quality alcoholic drinks'],
      benefits: [
        'Convenient local off-licence delivery right to your door (18+ ID verified)',
        'Perfect for dinners, celebrations, and relaxing evenings at home',
        'Order online from your trusted local store without making a trip out',
        'Carefully packed and delivered locally across our service area',
      ],
      intents: ['alcohol delivery', 'local off-licence delivery', 'wine and beer delivery near me', 'home drinks delivery'],
      keywords: ['alcohol delivery near me', 'wine and beer delivery', 'local off licence delivery', 'online drinks supermarket'],
    };
  }

  if (c.includes('tobacco') || c.includes('vape') || c.includes('nicotine') || c.includes('cigarette')) {
    return {
      nouns: ['convenience store items', '18+ convenience essentials', 'local shop favourites', 'everyday convenience items'],
      benefits: [
        'Convenient local doorstep delivery from your neighbourhood store (18+ ID required)',
        'Order online from our Broxbourne shop with discreet, reliable local delivery',
        'Available for quick home delivery across our local postcode area (18+ only)',
        'Skip the trip to the corner shop with fast local doorstep delivery',
      ],
      intents: ['local shop delivery', 'convenience delivery', 'home delivery near me', 'local market delivery'],
      keywords: ['local convenience store delivery', 'delivery market near me', 'Broxbourne local shop', 'EN10 home delivery'],
    };
  }

  if (c.includes('spice') || c.includes('herb') || c.includes('sauce') || c.includes('canned') || c.includes('pasta') || c.includes('noodle') || c.includes('pulse') || c.includes('jam') || c.includes('food')) {
    return {
      nouns: ['cupboard essentials', 'home-cooking ingredients', 'pantry & international groceries', 'everyday kitchen staples'],
      benefits: [
        'Essential for flavourful home-cooked meals and well-stocked kitchen cupboards',
        'Authentic international & everyday supermarket brands delivered locally',
        'Make weekly food shopping effortless with fast local delivery',
        'Everything you need for dinner, brought straight from our aisles to your door',
      ],
      intents: ['pantry grocery delivery', 'online food shopping', 'international supermarket near me', 'local grocery delivery'],
      keywords: ['online food shopping', 'pantry essentials delivery', 'international supermarket near me', 'supermarket delivery'],
    };
  }

  return {
    nouns: ['everyday groceries', 'local supermarket essentials', 'home shopping favourites', 'quality daily essentials'],
    benefits: [
      'Freshly stocked and delivered directly from our local store to your home',
      'Make your weekly supermarket shop quick and stress-free',
      'Order online in seconds and let our local drivers bring it to your door',
      'Trusted neighbourhood quality with convenient doorstep delivery',
    ],
    intents: ['online grocery delivery', 'local supermarket near me', 'food shopping delivery', 'delivery market near me'],
    keywords: ['grocery delivery near me', 'delivery market near me', 'online supermarket', 'shopping supermarket delivery'],
  };
}

const LOCAL_AREA_CLUSTERS = [
  { label: 'Broxbourne (EN10) & Hoddesdon (EN11)', short: 'Broxbourne & Hoddesdon', postcodes: 'EN10, EN11' },
  { label: 'Cheshunt, Waltham Cross (EN8) & Broxbourne (EN10)', short: 'Cheshunt & Waltham Cross', postcodes: 'EN8, EN10' },
  { label: 'Waltham Abbey (EN9), Broxbourne (EN10) & Hoddesdon (EN11)', short: 'Waltham Abbey & EN10', postcodes: 'EN9, EN10, EN11' },
  { label: 'Broxbourne, Hoddesdon, Cheshunt & Waltham Abbey', short: 'EN10, EN11, EN8 & EN9', postcodes: 'EN10, EN11, EN8, EN9' },
  { label: 'Wormley, Turnford, Broxbourne (EN10) & Hoddesdon (EN11)', short: 'Broxbourne, Wormley & EN11', postcodes: 'EN10, EN11' },
  { label: 'Waltham Cross (EN8), Waltham Abbey (EN9) & Broxbourne (EN10)', short: 'EN8, EN9 & EN10', postcodes: 'EN8, EN9, EN10' },
] as const;

const TITLE_PATTERNS = [
  (name: string, area: string) => `Buy ${name} Online | Grocery Delivery ${area}`,
  (name: string, area: string) => `${name} | Local Supermarket Delivery ${area}`,
  (name: string, area: string) => `Order ${name} | Fast Food Shopping ${area}`,
  (name: string, area: string) => `${name} Delivered to Your Door | ${area}`,
  (name: string, area: string) => `Shop ${name} Online | Local Market ${area}`,
  (name: string, area: string) => `${name} | Home Grocery Delivery ${area}`,
] as const;

const DELIVERY_CLOSERS = [
  'Delivered within 24 hours with free delivery on orders over £50.',
  'Fast local doorstep delivery within 24h — pay online or at your door.',
  'Enjoy quick home delivery within 24 hours (free over £50) from your local market.',
  'Order online today for 24-hour doorstep delivery with card or cash on delivery.',
  'Shop from home with reliable local delivery within 24 hours — free on £50+ baskets.',
] as const;

const GENERIC_BRANDS = new Set([
  'vegetables', 'vegetable', 'fruits', 'fruit', 'food', 'drinks', 'drink',
  'grocery', 'groceries', 'others', 'other', 'general', 'none', 'n/a',
  'alcohol', 'tobacco', 'dairy', 'bakery', 'snacks', 'sweets', 'juice',
]);

export function buildProductSeo(product: ProductSeoInput): ProductSeoOutput {
  const cleanName = product.name.trim().replace(/\s+/g, ' ');
  const categoryName = (product.category || 'Groceries').trim();
  const brand = product.brand?.trim();
  const effectivePrice =
    product.isPromoted && product.promoPrice ? product.promoPrice : product.price;
  const priceText = `£${effectivePrice.toFixed(2)}`;

  const seed = hashString(`${product.id}:${cleanName}:${categoryName}`);
  const profile = getCategoryProfile(categoryName);
  const area = pick(LOCAL_AREA_CLUSTERS, seed, 1);
  const noun = pick(profile.nouns, seed, 2);
  const benefit = pick(profile.benefits, seed, 3);
  const intent = pick(profile.intents, seed, 4);
  const closer = pick(DELIVERY_CLOSERS, seed, 5);
  const titleBuilder = pick(TITLE_PATTERNS, seed, 6);

  // Title (layout.tsx appends "| Broxbourne Food Centre" via template)
  const title = titleBuilder(cleanName, area.short);
  const ogTitle = `${cleanName} (${priceText}) | ${STORE_NAME}`;

  const weightHint =
    product.sellType === 'WEIGHT' && product.variants && product.variants.length > 0
      ? ` Available in ${product.variants.map((v) => v.weightLabel).join(', ')}.`
      : '';

  const promoHint =
    product.isPromoted && product.promoPrice
      ? ` On special offer at ${priceText}!`
      : ` Only ${priceText}.`;

  // Concise, unique Meta Description (~120-158 chars) that ends cleanly
  const metaVariants = [
    `Buy ${cleanName} (${priceText}) online at ${STORE_NAME}. Fast local grocery delivery in ${area.short} (${area.postcodes}) within 24h.`,
    `Order ${cleanName} for ${priceText} from your local supermarket in ${area.short}. Delivered to your door within 24h — free over £50.`,
    `Shop ${cleanName} (${priceText}) with fast ${intent} across ${area.short} (${area.postcodes}). Pay online or at your door.`,
    `Looking for ${cleanName} near you? Get ${noun} delivered in ${area.short} (${area.postcodes}) within 24h from ${STORE_NAME}.`,
    `Get ${cleanName} (${priceText}) delivered straight to your home in ${area.short}. Easy online food shopping from ${STORE_NAME}.`,
  ];

  const hasCustomDesc = hasMeaningfulDescription(product.description, cleanName);
  const rawMeta = hasCustomDesc
    ? `${product.description!.trim()} Order online (${priceText}) with fast local grocery delivery in ${area.short}.`
    : pick(metaVariants, seed, 7);

  const metaDescription =
    rawMeta.length > 160 ? `${rawMeta.slice(0, 157).replace(/\s+\S*$/, '')}...` : rawMeta;

  const isRealBrand =
    Boolean(brand) &&
    !GENERIC_BRANDS.has(brand!.toLowerCase()) &&
    brand!.toLowerCase() !== categoryName.toLowerCase() &&
    !cleanName.toLowerCase().includes(brand!.toLowerCase());

  const brandPhrase = isRealBrand ? ` by ${brand}` : '';

  const pageOpeners = [
    `Order ${cleanName}${brandPhrase} online from ${STORE_NAME}, your local neighbourhood supermarket for ${noun}.${promoHint}${weightHint}`,
    `Add ${cleanName}${brandPhrase} to your online basket at ${STORE_NAME} for fast local home shopping.${promoHint}${weightHint}`,
    `Enjoy convenient online shopping with ${cleanName}${brandPhrase} from our ${categoryName} aisle.${promoHint}${weightHint}`,
    `Stock up on ${cleanName}${brandPhrase} with quick ${intent} straight from ${STORE_NAME}.${promoHint}${weightHint}`,
  ];

  const pageBody = hasCustomDesc
    ? `${product.description!.trim()} ${closer} Serving ${area.label} (EN10, EN11, EN8 & EN9).`
    : `${pick(pageOpeners, seed, 8)} ${benefit}. ${closer} We deliver directly to homes across ${area.label} and surrounding EN10, EN11, EN8 & EN9 neighbourhoods.`;

  const keywords = Array.from(
    new Set([
      cleanName,
      `buy ${cleanName} online`,
      `${cleanName} delivery ${area.short}`,
      categoryName,
      `${categoryName} delivery near me`,
      ...(isRealBrand && brand ? [brand, `${brand} online UK`] : []),
      ...profile.keywords,
      'delivery market near me',
      'online supermarket Broxbourne',
      'grocery delivery EN10',
      'grocery delivery EN11',
      'grocery delivery EN8',
      'grocery delivery EN9',
      'Broxbourne Food Centre',
    ])
  );

  return {
    title,
    metaDescription,
    pageDescription: pageBody,
    ogTitle,
    keywords,
    deliveryBadgeArea: area.label,
  };
}
