import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Broxbourne Food Centre | Online Delivery",
  description: "Fresh groceries delivered right to your door within 24 hours in Broxbourne.",
};

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import { NextAuthProvider } from "@/providers/NextAuthProvider";
import FloatingCart from "@/components/cart/FloatingCart";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jakarta.variable} font-sans antialiased bg-[#fcfcfc] text-slate-800 selection:bg-emerald-500 selection:text-white flex flex-col min-h-screen`}
      >
        <NextAuthProvider>
          <Navbar />
          <CartDrawer />
          <FloatingCart />
          <main className="flex-grow">{children}</main>
          <Footer />
        </NextAuthProvider>
      </body>
    </html>
  );
}
