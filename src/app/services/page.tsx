import { ShoppingBag, Truck, CreditCard, Clock, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ServicesPage() {
    const steps = [
        {
            id: 1,
            title: 'Place Your Order',
            description: 'Browse our wide selection of fresh produce, groceries, and household essentials. Add items to your cart and proceed to checkout online.',
            icon: ShoppingBag,
            color: 'bg-blue-100 text-blue-600 border-blue-200',
        },
        {
            id: 2,
            title: 'Fast 24-Hour Delivery',
            description: 'We carefully pack your order and our local drivers will deliver it right to your doorstep within 24 hours of placing your order.',
            icon: Truck,
            color: 'bg-emerald-100 text-emerald-600 border-emerald-200',
        },
        {
            id: 3,
            title: 'Pay at Your Door',
            description: 'No need to pay online in advance! You can securely pay via Credit/Debit card or Cash when our driver arrives with your delivery.',
            icon: CreditCard,
            color: 'bg-purple-100 text-purple-600 border-purple-200',
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
                        How Our Service Works
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
                        Experience the easiest and freshest grocery shopping in Broxbourne. Follow these three simple steps to get your essentials delivered right to you.
                    </p>
                </div>

                <div className="relative">
                    {/* Connecting line for desktop */}
                    <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-1 bg-gradient-to-r from-blue-200 via-emerald-200 to-purple-200 -z-10 rounded-full" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
                        {steps.map((step) => {
                            const Icon = step.icon;
                            return (
                                <div key={step.id} className="relative flex flex-col items-center bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-shadow duration-300">
                                    <div className="absolute -top-6">
                                        <div className={`w-16 h-16 rounded-2xl border-4 border-white ${step.color} flex items-center justify-center shadow-lg transform -rotate-3 hover:rotate-0 transition-transform`}>
                                            <Icon className="w-8 h-8" strokeWidth={2.5} />
                                        </div>
                                    </div>
                                    <div className="mt-10 text-center flex-1 flex flex-col">
                                        <span className="text-sm font-bold text-slate-400 mb-2 tracking-widest uppercase">Step {step.id}</span>
                                        <h3 className="text-2xl font-bold text-slate-900 mb-4">{step.title}</h3>
                                        <p className="text-slate-600 leading-relaxed flex-1">
                                            {step.description}
                                        </p>
                                    </div>
                                    <div className="mt-6">
                                        <CheckCircle2 className="w-6 h-6 text-emerald-400/50" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-20 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-8 md:p-12 text-center text-white shadow-xl shadow-emerald-500/10">
                    <Clock className="w-12 h-12 mx-auto mb-6 text-emerald-200" />
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to get started?</h2>
                    <p className="text-emerald-100 text-lg mb-8 max-w-xl mx-auto">
                        Place your order now and enjoy fresh groceries delivered straight to your home within 24 hours.
                    </p>
                    <Link
                        href="/shop"
                        className="inline-block bg-white text-emerald-700 font-extrabold py-4 px-10 rounded-full hover:bg-emerald-50 hover:scale-105 transition-all shadow-lg"
                    >
                        Shop Now
                    </Link>
                </div>
            </div>
        </div>
    );
}
