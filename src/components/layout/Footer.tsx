import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-emerald-600 text-emerald-50 py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-white text-lg font-bold mb-4">Broxbourne Food Centre</h3>
                    <p className="text-sm leading-relaxed">
                        Delivering fresh groceries and house essentials directly to your doorstep in Broxbourne, EN10, EN11, EN8, and EN9.
                    </p>
                </div>

                <div>
                    <h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/" className="hover:text-emerald-200 transition-colors">Home Page</Link></li>
                        <li><Link href="/shop" className="hover:text-emerald-200 transition-colors">Shop</Link></li>
                        <li><Link href="/services" className="hover:text-emerald-200 transition-colors">Services</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-white text-lg font-bold mb-4">Customer Service</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/contact" className="hover:text-emerald-200 transition-colors">Contact us</Link></li>
                        <li><Link href="/help" className="hover:text-emerald-200 transition-colors">Help Centre</Link></li>
                        <li><Link href="/terms" className="hover:text-emerald-200 transition-colors">Term & conditions</Link></li>
                        <li><Link href="/privacy" className="hover:text-emerald-200 transition-colors">Privacy Policy</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-white text-lg font-bold mb-4">Contact</h3>
                    <ul className="space-y-2 text-sm">
                        <li>📍 5-6, The Precinct, Broxbourne EN10 7HY</li>
                        <li>📞 <a href="tel:+447444474108" className="hover:text-emerald-200 transition-colors">+44 7444 474108</a></li>
                        <li>🕐 Mon – Sun: 07:00 – 23:00</li>
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-emerald-500 text-sm text-center">
                &copy; {new Date().getFullYear()} Broxbourne Food Centre. All rights reserved.
            </div>
        </footer>
    );
}
