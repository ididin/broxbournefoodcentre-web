import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop Groceries & Essentials',
  description: 'Browse our wide range of fresh groceries, drinks, and daily essentials. Fast delivery in Broxbourne, EN10, EN11.',
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
