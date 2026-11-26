import type { Metadata } from 'next';
import Link from 'next/link';
import { Lock, Shield, Cookie, UserCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Learn how Broxbourne Food Centre collects, uses, and protects your personal data under UK GDPR when you shop online for local grocery delivery in EN10, EN11, EN8 & EN9.',
  alternates: {
    canonical: 'https://broxbournefoodcentre.com/privacy',
  },
};

export default function PrivacyPage() {
  const lastUpdated = 'November 2026';

  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-500 text-white py-14 px-4 text-center">
        <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
          <Lock className="w-4 h-4" /> UK GDPR Compliant
        </div>
        <h1 className="text-3xl sm:text-5xl font-black mb-3 tracking-tight">Privacy Policy</h1>
        <p className="text-emerald-100 text-base sm:text-lg max-w-2xl mx-auto">
          We respect your privacy and are committed to keeping your personal details safe when you shop online with Broxbourne Food Centre.
        </p>
        <p className="text-emerald-200 text-xs mt-4">Last updated: {lastUpdated}</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Quick Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <Shield className="w-6 h-6 text-emerald-600 mb-2" />
            <h2 className="font-bold text-slate-900 text-sm">Safe &amp; Encrypted</h2>
            <p className="text-xs text-slate-600 mt-1">
              Passwords are encrypted and online card payments are processed securely by Square.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <UserCheck className="w-6 h-6 text-emerald-600 mb-2" />
            <h2 className="font-bold text-slate-900 text-sm">Never Sold</h2>
            <p className="text-xs text-slate-600 mt-1">
              We never sell or rent your personal contact or address details to third parties.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <Cookie className="w-6 h-6 text-emerald-600 mb-2" />
            <h2 className="font-bold text-slate-900 text-sm">Your UK GDPR Rights</h2>
            <p className="text-xs text-slate-600 mt-1">
              Request access, correction, or deletion of your personal data at any time.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100 space-y-8 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-extrabold text-slate-900 mb-3">1. Data Controller</h2>
            <p>
              <strong>Broxbourne Food Centre</strong> (5-6, The Precinct, Broxbourne, EN10 7HY, United
              Kingdom) is the data controller responsible for the personal information collected through{' '}
              <strong>broxbournefoodcentre.com</strong>. We process your data in accordance with the UK
              General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-slate-900 mb-3">2. Information We Collect</h2>
            <p className="mb-2">When you browse our store, create an account, or place a delivery order, we may collect:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Identity &amp; Contact Data:</strong> Your name, email address, and phone number.
              </li>
              <li>
                <strong>Delivery Information:</strong> Your street address, postcode (EN8, EN9, EN10,
                EN11), city, and delivery time preferences.
              </li>
              <li>
                <strong>Order &amp; Account History:</strong> Items purchased, order numbers, saved
                addresses, and customer support messages.
              </li>
              <li>
                <strong>Payment Information:</strong> Payment method selected (online card via Square,
                card on delivery, or cash on delivery) and transaction reference IDs.{' '}
                <em>We never see or store your full debit/credit card number or CVV.</em>
              </li>
              <li>
                <strong>Technical &amp; Usage Data:</strong> Standard browser information, device type,
                and anonymised site analytics (via Google Analytics) to help us improve our website.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-slate-900 mb-3">3. How We Use Your Information</h2>
            <p className="mb-2">We use your personal data only for legitimate, customer-focused purposes:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>To prepare, pack, and deliver your grocery orders to your doorstep.</li>
              <li>To send order confirmations, delivery updates, and respond to your enquiries.</li>
              <li>To process payments and issue refunds when needed.</li>
              <li>To verify age eligibility (18+) for alcohol and tobacco orders in line with UK law.</li>
              <li>To maintain website security, prevent fraud, and improve our online shopping experience.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-slate-900 mb-3">4. Lawful Basis for Processing</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Contract:</strong> Processing your name, address, contact details, and order
                items is necessary to fulfil your grocery delivery order.
              </li>
              <li>
                <strong>Legal Obligation:</strong> Keeping basic transaction records for UK tax/accounting
                laws and enforcing 18+ age verification.
              </li>
              <li>
                <strong>Legitimate Interests:</strong> Improving store performance, preventing fraud, and
                ensuring smooth customer support.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-slate-900 mb-3">5. Sharing Your Data</h2>
            <p className="mb-2">
              We do <strong>not</strong> sell your data. We only share limited information with trusted
              service providers strictly required to run our online store:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Square:</strong> For secure online card payment processing.
              </li>
              <li>
                <strong>Hosting &amp; Email Infrastructure:</strong> Secure cloud hosting and
                transactional email delivery to send order receipts.
              </li>
              <li>
                <strong>Google Analytics:</strong> Aggregated, anonymised traffic statistics to
                understand which categories and products customers search for.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-slate-900 mb-3">6. Cookies</h2>
            <p>
              Our website uses essential cookies to keep you signed in, remember items in your shopping
              basket, and store age-verification confirmations. We also use Google Analytics cookies to
              measure site performance. You can control or clear cookies at any time through your browser
              settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-slate-900 mb-3">7. Data Retention</h2>
            <p>
              We retain order and invoice records only for as long as necessary to fulfil your orders,
              provide customer support, and comply with UK tax and accounting obligations (typically up
              to 6 years for financial records). Account data can be updated or deleted on request.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-slate-900 mb-3">8. Your UK GDPR Rights</h2>
            <p className="mb-2">Under UK data protection law, you have the right to:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Request a copy of the personal data we hold about you (Right of Access).</li>
              <li>Ask us to correct inaccurate or incomplete details (Right to Rectification).</li>
              <li>Ask us to delete your personal data where we have no legal reason to keep it (Right to Erasure).</li>
              <li>Object to or restrict certain types of processing.</li>
              <li>
                Lodge a complaint with the UK Information Commissioner&apos;s Office (ICO) at{' '}
                <a
                  href="https://ico.org.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 font-semibold hover:underline"
                >
                  ico.org.uk
                </a>
                .
              </li>
            </ul>
          </section>

          <section className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-sm text-slate-600">
              <p className="font-bold text-slate-900">Privacy Questions or Data Requests?</p>
              <p>
                Call{' '}
                <a href="tel:+447444474108" className="text-emerald-600 font-semibold hover:underline">
                  +44 7444 474108
                </a>{' '}
                or visit us at 5-6, The Precinct, Broxbourne EN10 7HY.
              </p>
            </div>
            <Link
              href="/contact"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-colors shrink-0"
            >
              Contact Us
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
