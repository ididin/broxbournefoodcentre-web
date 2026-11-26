import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact & Store Location | 5-6 The Precinct, Broxbourne EN10 7HY',
  description:
    'Visit Broxbourne Food Centre at 5-6, The Precinct, Broxbourne EN10 7HY (open daily 07:00–23:00) or contact us about local home grocery delivery in EN10, EN11, EN8 & EN9.',
  alternates: {
    canonical: 'https://broxbournefoodcentre.com/contact',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
