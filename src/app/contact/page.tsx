'use client';

import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, CheckCircle } from 'lucide-react';

export default function ContactPage() {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate form submission delay
        await new Promise(r => setTimeout(r, 800));
        setSubmitted(true);
        setIsSubmitting(false);
    };

    return (
        <div className="bg-[#f8f9fa] min-h-screen">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-emerald-700 to-emerald-500 text-white py-16 px-4 text-center">
                <h1 className="text-4xl sm:text-5xl font-black mb-3 tracking-tight">Get In Touch</h1>
                <p className="text-emerald-100 text-lg max-w-xl mx-auto">
                    We're here to help. Send us a message and we'll get back to you as soon as possible.
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

                    {/* Left — Store Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 mb-6">Store Information</h2>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800 text-sm mb-1">Address</p>
                                    <p className="text-slate-600 text-sm leading-relaxed">
                                        Broxbourne Food Centre<br />
                                        Sturlas Way, Waltham Cross<br />
                                        EN8 7BJ, London, UK
                                    </p>
                                </div>
                            </div>

                            <div className="w-full h-px bg-gray-100" />

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                    <Phone className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800 text-sm mb-1">Phone</p>
                                    <a href="tel:+441992638888" className="text-slate-600 text-sm hover:text-emerald-600 transition-colors">
                                        +44 (0)1992 638 888
                                    </a>
                                </div>
                            </div>

                            <div className="w-full h-px bg-gray-100" />

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                    <Mail className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800 text-sm mb-1">Email</p>
                                    <a href="mailto:info@broxbournefoodcentre.co.uk" className="text-slate-600 text-sm hover:text-emerald-600 transition-colors break-all">
                                        info@broxbournefoodcentre.co.uk
                                    </a>
                                </div>
                            </div>

                            <div className="w-full h-px bg-gray-100" />

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                    <Clock className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800 text-sm mb-2">Opening Hours</p>
                                    <div className="text-slate-600 text-sm space-y-1">
                                        <div className="flex justify-between gap-8">
                                            <span>Monday – Saturday</span>
                                            <span className="font-semibold text-slate-700">8:00 – 21:00</span>
                                        </div>
                                        <div className="flex justify-between gap-8">
                                            <span>Sunday</span>
                                            <span className="font-semibold text-slate-700">9:00 – 18:00</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Areas */}
                        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
                            <p className="text-sm font-bold text-emerald-700 mb-2">🚚 Delivery Areas</p>
                            <p className="text-sm text-emerald-600">EN8 (Waltham Cross) · EN9 (Waltham Abbey) · EN10 (Broxbourne) · EN11 (Hoddesdon)</p>
                            <p className="text-xs text-emerald-500 mt-2">Free delivery on orders over £50. Under £50: £6.99 fee.</p>
                        </div>
                    </div>

                    {/* Right — Contact Form */}
                    <div className="lg:col-span-3">
                        <h2 className="text-2xl font-black text-slate-800 mb-6">Send a Message</h2>

                        {submitted ? (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 flex flex-col items-center justify-center text-center min-h-[400px]">
                                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                                </div>
                                <h3 className="text-xl font-black text-slate-800 mb-2">Message Sent!</h3>
                                <p className="text-slate-500">Thank you for reaching out. We will get back to you within 24 hours.</p>
                                <button
                                    onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', phone: '', message: '' }); }}
                                    className="mt-6 px-6 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition-colors"
                                >
                                    Send Another
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="John Smith"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
                                        <input
                                            type="tel"
                                            placeholder="+44 7700 000000"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address <span className="text-red-500">*</span></label>
                                    <input
                                        required
                                        type="email"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Message <span className="text-red-500">*</span></label>
                                    <textarea
                                        required
                                        rows={6}
                                        placeholder="How can we help you?"
                                        value={formData.message}
                                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-sm resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] text-sm"
                                >
                                    {isSubmitting ? 'Sending...' : 'Send Message →'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Google Map — full width */}
                <div className="mt-16">
                    <h2 className="text-2xl font-black text-slate-800 mb-6 text-center">Find Us</h2>
                    <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200 w-full" style={{ height: '450px' }}>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2470.2053873545583!2d-0.021267222881898754!3d51.74756777186904!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487621fbc05dee73%3A0xed9cd5e0aa42fcdd!2sBROXBOURNE%20FOOD%20CENTRE!5e0!3m2!1str!2str!4v1773303524293!5m2!1str!2str"
                            width="100%"
                            height="450"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Broxbourne Food Centre on Google Maps"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
