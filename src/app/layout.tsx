import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: "%s | Broxbourne Food Centre",
    default: "Broxbourne Food Centre | Online Delivery EN10, EN11",
  },
  description: "Fresh groceries, alcohol, and house essentials delivered right to your door in Broxbourne, EN10, EN11, EN8, and EN9. Quick local delivery.",
  keywords: ["Broxbourne grocery delivery", "food centre EN10", "local supermarket Broxbourne", "online grocery EN11", "fresh food delivery EN8"],
  openGraph: {
    title: "Broxbourne Food Centre | Local Online Grocery",
    description: "Fresh groceries delivered directly to your door in Broxbourne and surrounding areas (EN10, EN11, EN8, EN9).",
    url: "https://broxbournefoodcentre.com",
    siteName: "Broxbourne Food Centre",
    locale: "en_GB",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://broxbournefoodcentre.com",
  },
};

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import { NextAuthProvider } from "@/providers/NextAuthProvider";
import FloatingCart from "@/components/cart/FloatingCart";
import Script from "next/script";

import AgeVerificationModal from "@/components/ui/AgeVerificationModal";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "GroceryStore",
    "name": "Broxbourne Food Centre",
    "image": "https://broxbournefoodcentre.com/icon.png",
    "@id": "https://broxbournefoodcentre.com",
    "url": "https://broxbournefoodcentre.com",
    "telephone": "+447444474108",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "5-6, The Precinct",
      "addressLocality": "Broxbourne",
      "postalCode": "EN10 7HY",
      "addressCountry": "GB"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 51.7485, // Approximate for EN10 7HY
      "longitude": -0.0150
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "07:00",
      "closes": "23:00"
    },
    "areaServed": [
      {
        "@type": "PostalAddress",
        "postalCode": "EN10"
      },
      {
        "@type": "PostalAddress",
        "postalCode": "EN11"
      },
      {
        "@type": "PostalAddress",
        "postalCode": "EN8"
      },
      {
        "@type": "PostalAddress",
        "postalCode": "EN9"
      }
    ],
    "priceRange": "$$"
  };

  return (
    <html lang="en">
      <body
        className={`${jakarta.variable} font-sans antialiased bg-[#fcfcfc] text-slate-800 selection:bg-emerald-500 selection:text-white flex flex-col min-h-screen`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-5E70DLVMZ9`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-5E70DLVMZ9', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />

        <NextAuthProvider>
          <Navbar />
          <CartDrawer />
          <FloatingCart />
          <AgeVerificationModal />
          <main className="flex-grow pt-[140px] md:pt-[112px]">{children}</main>
          <Footer />
        </NextAuthProvider>
      </body>
    </html>
  );
}
