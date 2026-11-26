import type { Metadata } from 'next';
import Link from 'next/link';
import { FileText, ShieldCheck, Truck, CreditCard, RotateCcw, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description:
    'Read the Terms & Conditions for online grocery orders, 24-hour local home delivery (EN10, EN11, EN8, EN9), payments, age-restricted items, and refunds at Broxbourne Food Centre.',
  alternates: {
    canonical: 'https://broxbournefoodcentre.com/terms',
  },
};

export default function TermsPage() {
  const lastUpdated = 'November 2026';

  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-500 text-white py-14 px-4 text-center">
        <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
          <FileText className="w-4 h-4" /> Legal Information
        </div>
        <h1 className="text-3xl sm:text-5xl font-black mb-3 tracking-tight">Terms &amp; Conditions</h1>
        <p className="text-emerald-100 text-base sm:text-lg max-w-2xl mx-auto">
          Clear, fair terms for shopping online with Broxbourne Food Centre across Broxbourne (EN10), Hoddesdon (EN11), Cheshunt &amp; Waltham Cross (EN8), and Waltham Abbey (EN9).
        </p>
        <p className="text-emerald-200 text-xs mt-4">Last updated: {lastUpdated}</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Quick Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <Truck className="w-6 h-6 text-emerald-600 mb-2" />
            <h2 className="font-bold text-slate-900 text-sm">Local Delivery Areas</h2>
            <p className="text-xs text-slate-600 mt-1">
              EN8, EN9, EN10 &amp; EN11 within 24 hours. Free over £50 (£6.99 under £50).
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <CreditCard className="w-6 h-6 text-emerald-600 mb-2" />
            <h2 className="font-bold text-slate-900 text-sm">Flexible Payments</h2>
            <p className="text-xs text-slate-600 mt-1">
              Pay securely online via Square, or pay by Cash or Card upon delivery.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <RotateCcw className="w-6 h-6 text-emerald-600 mb-2" />
            <h2 className="font-bold text-slate-900 text-sm">72-Hour In-Store Returns</h2>
            <p className="text-xs text-slate-600 mt-1">
              Unopened items accepted in store within 72 hours with no restocking fee. Refunds within 1 day.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100 space-y-8 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-extrabold text-slate-900 mb-3">1. About Us</h2>
            <p>
              This website (<strong>broxbournefoodcentre.com</strong>) is operated by{' '}
              <strong>Broxbourne Food Centre</strong>, located at{' '}
              <strong>5-6, The Precinct, Broxbourne, EN10 7HY, United Kingdom</strong>. We are a local
              neighbourhood supermarket offering everyday groceries, fresh fruit &amp; vegetables, dairy,
              bakery, international foods, drinks, and household essentials for in-store shopping and
              local doorstep delivery.
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Store opening hours: Monday – Sunday, 07:00 – 23:00 | Phone:{' '}
              <a href="tel:+447444474108" className="text-emerald-600 font-semibold hover:underline">
                +44 7444 474108
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-slate-900 mb-3">2. Placing an Order</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                By placing an order through our website, you confirm that you are at least 18 years old
                (or have the consent of a parent/guardian for non-age-restricted groceries) and that the
                delivery address and contact details you provide are accurate.
              </li>
              <li>
                All prices displayed on the website are in British Pounds Sterling (GBP, £) and include
                applicable UK VAT where relevant.
              </li>
              <li>
                Product images are for illustrative purposes. Packaging may occasionally vary from the
                photograph shown, while the product size and quality remain as described.
              </li>
              <li>
                For loose or weighted produce (such as fresh fruit and vegetables), items are packed as
                closely as possible to the weight you select.
              </li>
              <li>
                If an item is temporarily out of stock after you place your order, we will contact you by
                phone or email to offer a suitable substitute or remove the item and adjust your total.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-slate-900 mb-3">3. Local Delivery Policy</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Delivery Coverage:</strong> We deliver exclusively to residential and local
                addresses within postcodes <strong>EN10</strong> (Broxbourne, Wormley, Turnford),{' '}
                <strong>EN11</strong> (Hoddesdon), <strong>EN8</strong> (Waltham Cross, Cheshunt), and{' '}
                <strong>EN9</strong> (Waltham Abbey, Nazeing).
              </li>
              <li>
                <strong>Delivery Timeframe:</strong> Orders are packed fresh at our Broxbourne store and
                delivered to your doorstep within <strong>24 hours</strong> (same-day or next-day
                depending on order time and preferred slot).
              </li>
              <li>
                <strong>Delivery Fees:</strong> Delivery is <strong>FREE</strong> on all orders of{' '}
                <strong>£50.00 or more</strong>. Orders under £50.00 carry a flat local delivery fee of{' '}
                <strong>£6.99</strong>.
              </li>
              <li>
                <strong>Receiving Your Order:</strong> Please ensure someone is available at the delivery
                address to receive your groceries. If we are unable to deliver after attempting to contact
                you, we will arrange a redelivery or refund minus perishable/delivery costs where
                applicable.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-slate-900 mb-3">4. Payment Methods</h2>
            <p className="mb-2">We offer three convenient ways to pay for your online grocery order:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Online Card Payment (Square):</strong> Securely processed at checkout via
                Square&apos;s PCI-DSS compliant payment platform. We do not store your full card details.
              </li>
              <li>
                <strong>Card on Delivery:</strong> Pay by debit or credit card when our driver arrives at
                your door.
              </li>
              <li>
                <strong>Cash on Delivery:</strong> Pay in cash directly to our driver upon receiving your
                order.
              </li>
            </ul>
          </section>

          <section className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <h2 className="text-lg font-extrabold text-amber-900 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              5. Age-Restricted Products (Alcohol &amp; Tobacco — Challenge 25)
            </h2>
            <p className="text-sm text-amber-900/90 leading-relaxed">
              Under UK law, it is an offence to sell alcohol, tobacco, or nicotine products to anyone
              under the age of <strong>18</strong>. Broxbourne Food Centre strictly operates a{' '}
              <strong>Challenge 25</strong> policy. If your order contains age-restricted items and the
              recipient appears to be under 25, our driver will ask for valid photographic ID (UK/EU
              passport, UK driving licence, or PASS-accredited proof-of-age card). If valid ID cannot be
              provided, we are legally required to withhold the age-restricted items.
            </p>
          </section>

          <section id="returns-refunds">
            <h2 className="text-xl font-extrabold text-slate-900 mb-3">6. Returns, Exchanges &amp; Refunds Policy (United Kingdom)</h2>
            <p className="mb-3">
              Our return and refund policy applies to all orders placed in the{' '}
              <strong>United Kingdom</strong> through Broxbourne Food Centre:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Return Window (72 Hours / 3 Days):</strong> Returns and exchanges are accepted
                within <strong>72 hours (3 days)</strong> of delivery.
              </li>
              <li>
                <strong>Product Condition (New &amp; Unopened Only):</strong> Because all local orders are
                delivered directly by our own team, items delivered in sound condition cannot be returned
                as defective afterwards. Returned or exchanged products must be{' '}
                <strong>unopened, unused, and in new original condition</strong> with intact packaging.
              </li>
              <li>
                <strong>Exchanges Accepted:</strong> We accept <strong>exchanges</strong> for eligible
                unopened items within 72 hours of delivery.
              </li>
              <li>
                <strong>Return Method (In-Store):</strong> Returns and exchanges are accepted{' '}
                <strong>in-store</strong> at our shop: <strong>5-6, The Precinct, Broxbourne, EN10 7HY</strong>{' '}
                (open Monday – Sunday, 07:00 – 23:00). Please bring your order confirmation or receipt.
              </li>
              <li>
                <strong>Restocking Fees:</strong> There are <strong>no restocking fees (£0.00 / free)</strong>{' '}
                for returning or exchanging eligible products.
              </li>
              <li>
                <strong>Refund Processing Time:</strong> Approved refunds are processed within{' '}
                <strong>1 day</strong> back to your original payment method (or refunded immediately in
                store).
              </li>
              <li>
                <strong>Order Cancellations Before Dispatch:</strong> You may cancel or amend your order
                free of charge before it leaves our store by calling{' '}
                <a href="tel:+447444474108" className="text-emerald-600 font-semibold hover:underline">
                  +44 7444 474108
                </a>
                .
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-slate-900 mb-3">7. Allergens &amp; Product Information</h2>
            <p>
              While we take care to keep product listings accurate, ingredients and allergen information
              may occasionally be updated by manufacturers. Always read the physical product label,
              warnings, and allergen declarations before consuming or using any item. If you have a
              severe allergy, please call our store before ordering so we can check the packaging for you.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-slate-900 mb-3">8. Privacy &amp; Governing Law</h2>
            <p>
              Your personal information is handled in accordance with UK GDPR and our{' '}
              <Link href="/privacy" className="text-emerald-600 font-semibold hover:underline">
                Privacy Policy
              </Link>
              . These Terms &amp; Conditions are governed by the laws of England and Wales, and any
              disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.
            </p>
          </section>

          <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Have a question about these terms?</span>
            </div>
            <div className="flex gap-3">
              <Link
                href="/help"
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-bold transition-colors"
              >
                Visit Help Centre
              </Link>
              <Link
                href="/contact"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
