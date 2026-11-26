import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Online Supermarket & Grocery Shopping | EN10, EN11, EN8, EN9',
  description:
    'Order fresh fruit & veg, dairy, bakery, international foods, snacks, and drinks online from your local delivery market. Fast 24h home delivery across Broxbourne, Hoddesdon, Cheshunt, Waltham Cross & Waltham Abbey.',
  keywords: [
    'online grocery shopping',
    'shopping supermarket near me',
    'delivery market near me',
    'grocery delivery Broxbourne',
    'supermarket delivery Hoddesdon',
    'food shopping EN10 EN11 EN8 EN9',
  ],
  alternates: {
    canonical: 'https://broxbournefoodcentre.com/shop',
  },
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
