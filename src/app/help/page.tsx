import type { Metadata } from 'next';
import Link from 'next/link';
import { HelpCircle, Truck, CreditCard, RotateCcw, Clock, Phone, MapPin, ShieldAlert } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Help Centre & FAQs | Local Grocery Delivery EN10, EN11, EN8, EN9',
  description:
    'Find quick answers about online grocery shopping, 24-hour doorstep delivery in Broxbourne (EN10), Hoddesdon (EN11), Waltham Cross & Cheshunt (EN8), and Waltham Abbey (EN9), delivery fees, payments, and returns.',
  alternates: {
    canonical: 'https://broxbournefoodcentre.com/help',
  },
};

const FAQ_GROUPS = [
  {
    title: 'Local Delivery & Coverage',
    icon: Truck,
    items: [
      {
        q: 'Which areas do you deliver groceries to?',
        a: 'We deliver directly from our Broxbourne supermarket to homes across EN10 (Broxbourne, Wormley, Turnford), EN11 (Hoddesdon), EN8 (Waltham Cross, Cheshunt), and EN9 (Waltham Abbey, Nazeing).',
      },
      {
        q: 'How fast is delivery?',
        a: 'All online grocery orders are carefully packed at our store and delivered to your doorstep within 24 hours (same-day or next-day depending on when you order).',
      },
      {
        q: 'How much does delivery cost?',
        a: 'Delivery is completely FREE on orders of £50 or more. For orders under £50, there is a flat local delivery fee of £6.99.',
      },
    ],
  },
  {
    title: 'Ordering & Payments',
    icon: CreditCard,
    items: [
      {
        q: 'What payment methods do you accept?',
        a: 'You can pay securely online by debit or credit card via Square at checkout, or choose to pay by Card on Delivery or Cash on Delivery when our driver arrives at your door.',
      },
      {
        q: 'Do I need an account to place an order?',
        a: 'No — you can check out quickly as a guest, or create a free account to save your delivery address and view your past orders.',
      },
      {
        q: 'How can I track my order?',
        a: 'Once your order is placed, you receive an order number. You can check your order status anytime on our Order Tracking page or by calling our store on +44 7444 474108.',
      },
    ],
  },
  {
    title: 'Returns, Substitutions & Age-Restricted Items',
    icon: RotateCcw,
    items: [
      {
        q: 'What is your return, exchange, and refund policy?',
        a: 'We accept in-store returns and exchanges in the UK for both defective and non-defective products in new condition, with a lifetime return window and no restocking fees. Bring your item to 5-6, The Precinct, Broxbourne EN10 7HY and refunds are processed within 1 day.',
      },
      {
        q: 'Can I cancel or change my order after placing it?',
        a: 'Yes! Call us on +44 7444 474108 before your order is dispatched and we will happily update or cancel it for you at no extra charge.',
      },
      {
        q: 'Do I need ID for alcohol or tobacco orders?',
        a: 'Yes. We operate a strict Challenge 25 policy in accordance with UK law. You must be 18 or over to order alcohol, tobacco, or nicotine products, and our driver may ask for valid photo ID at your door.',
      },
    ],
  },
];

export default function HelpPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_GROUPS.flatMap((group) =>
      group.items.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a,
        },
      }))
    ),
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-500 text-white py-14 px-4 text-center">
        <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
          <HelpCircle className="w-4 h-4" /> Customer Support
        </div>
        <h1 className="text-3xl sm:text-5xl font-black mb-3 tracking-tight">Help Centre &amp; FAQs</h1>
        <p className="text-emerald-100 text-base sm:text-lg max-w-2xl mx-auto">
          Everything you need to know about shopping online and getting fresh groceries delivered to your door in EN10, EN11, EN8 &amp; EN9.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Quick Links Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/order-tracking"
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all flex items-start gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-sm">Track Your Order</h2>
              <p className="text-xs text-slate-500 mt-0.5">Check live status using your order number</p>
            </div>
          </Link>

          <Link
            href="/services"
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all flex items-start gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-sm">How Delivery Works</h2>
              <p className="text-xs text-slate-500 mt-0.5">24-hour doorstep delivery explained</p>
            </div>
          </Link>

          <Link
            href="/contact"
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all flex items-start gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-sm">Speak With Our Store</h2>
              <p className="text-xs text-slate-500 mt-0.5">Open daily 07:00 – 23:00 on +44 7444 474108</p>
            </div>
          </Link>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          {FAQ_GROUPS.map((group) => {
            const Icon = group.icon;
            return (
              <section key={group.title} className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-emerald-600" />
                  </span>
                  {group.title}
                </h2>
                <div className="divide-y divide-gray-100">
                  {group.items.map((item) => (
                    <div key={item.q} className="py-4 first:pt-0 last:pb-0">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5">
                        {item.q}
                      </h3>
                      <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                        {item.a}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* Store Contact & Legal Links */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-lg">
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold">Still need help with your order?</h2>
            <p className="text-emerald-100 text-sm sm:text-base flex items-center gap-2">
              <MapPin className="w-4 h-4 shrink-0" /> 5-6, The Precinct, Broxbourne EN10 7HY (Open 07:00 – 23:00 daily)
            </p>
            <p className="text-emerald-100 text-sm flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" /> View our{' '}
              <Link href="/terms" className="underline font-semibold hover:text-white">
                Terms &amp; Conditions
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="underline font-semibold hover:text-white">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <a
              href="tel:+447444474108"
              className="px-6 py-3 rounded-full bg-white text-emerald-700 font-extrabold text-sm hover:bg-emerald-50 transition-colors shadow"
            >
              Call +44 7444 474108
            </a>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-full bg-emerald-800/60 hover:bg-emerald-800 text-white font-bold text-sm transition-colors border border-emerald-400/30"
            >
              Send a Message
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
