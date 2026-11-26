import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL("https://broxbournefoodcentre.com"),
  title: {
    template: "%s | Broxbourne Food Centre",
    default: "Broxbourne Food Centre | Local Supermarket & Grocery Delivery EN10, EN11, EN8, EN9",
  },
  description:
    "Your local online supermarket in Broxbourne. Order fresh groceries, fruit & veg, snacks, drinks, and household essentials with fast 24h home delivery across Broxbourne (EN10), Hoddesdon (EN11), Cheshunt & Waltham Cross (EN8), and Waltham Abbey (EN9).",
  keywords: [
    "grocery delivery near me",
    "delivery market near me",
    "online supermarket Broxbourne",
    "shopping supermarket near me",
    "local supermarket delivery EN10",
    "grocery delivery Hoddesdon EN11",
    "supermarket delivery Cheshunt EN8",
    "food delivery Waltham Cross EN8",
    "grocery delivery Waltham Abbey EN9",
    "online food shopping Broxbourne",
    "fresh groceries delivered EN10",
    "Broxbourne Food Centre",
  ],
  openGraph: {
    title: "Broxbourne Food Centre | Local Online Supermarket & Grocery Delivery",
    description:
      "Shop fresh groceries, international foods, drinks & daily essentials online. Fast local home delivery within 24 hours in Broxbourne (EN10), Hoddesdon (EN11), Cheshunt & Waltham Cross (EN8), and Waltham Abbey (EN9).",
    url: "https://broxbournefoodcentre.com",
    siteName: "Broxbourne Food Centre",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Broxbourne Food Centre | Online Supermarket & Grocery Delivery",
    description:
      "Fast 24h local grocery delivery across EN10, EN11, EN8 & EN9. Free delivery over £50.",
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
    "description": "Local neighbourhood supermarket and online grocery delivery market serving Broxbourne (EN10), Hoddesdon (EN11), Cheshunt & Waltham Cross (EN8), and Waltham Abbey (EN9).",
    "image": "https://broxbournefoodcentre.com/icon.png",
    "logo": "https://broxbournefoodcentre.com/icon.png",
    "@id": "https://broxbournefoodcentre.com/#grocerystore",
    "url": "https://broxbournefoodcentre.com",
    "telephone": "+447444474108",
    "currenciesAccepted": "GBP",
    "paymentAccepted": "Cash, Credit Card, Debit Card, Online Payment",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "5-6, The Precinct",
      "addressLocality": "Broxbourne",
      "addressRegion": "Hertfordshire",
      "postalCode": "EN10 7HY",
      "addressCountry": "GB"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 51.747568,
      "longitude": -0.021267
    },
    "hasMap": "https://maps.google.com/?q=Broxbourne+Food+Centre+5-6+The+Precinct+EN10+7HY",
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
      { "@type": "City", "name": "Broxbourne" },
      { "@type": "City", "name": "Hoddesdon" },
      { "@type": "City", "name": "Cheshunt" },
      { "@type": "City", "name": "Waltham Cross" },
      { "@type": "City", "name": "Waltham Abbey" },
      { "@type": "City", "name": "Wormley" },
      { "@type": "City", "name": "Turnford" },
      { "@type": "City", "name": "Nazeing" },
      { "@type": "PostalAddress", "postalCode": "EN10", "addressCountry": "GB" },
      { "@type": "PostalAddress", "postalCode": "EN11", "addressCountry": "GB" },
      { "@type": "PostalAddress", "postalCode": "EN8", "addressCountry": "GB" },
      { "@type": "PostalAddress", "postalCode": "EN9", "addressCountry": "GB" }
    ],
    "priceRange": "£"
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Broxbourne Food Centre",
    "url": "https://broxbournefoodcentre.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://broxbournefoodcentre.com/shop?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
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
