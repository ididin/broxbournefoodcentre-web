'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const POSTAL_CITY_MAP: Record<string, string> = {
    'EN8': 'Waltham Cross',
    'EN9': 'Waltham Abbey',
    'EN10': 'Broxbourne',
    'EN11': 'Hoddesdon'
};

const SERVED_POSTAL_CODES = Object.keys(POSTAL_CITY_MAP);

export default function CheckoutPage() {
    const { items, getTotalPrice, clearCart } = useCartStore();
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        addressLine: '',
        postalCode: '',
        deliveryTime: '',
        paymentMethod: 'CASH', // or CREDIT_CARD
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.postalCode) {
            alert('Please select a valid postal code.');
            return;
        }

        setIsSubmitting(true);

        const subtotal = getTotalPrice();
        const deliveryFee = subtotal >= 50 ? 0 : 6.99;
        const totalAmount = subtotal + deliveryFee;

        const city = POSTAL_CITY_MAP[formData.postalCode] || 'London';
        const fullAddress = `${formData.addressLine}, ${formData.postalCode}, ${city}, London`;

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    guestEmail: formData.email,
                    deliveryAddress: fullAddress,
                    deliveryTimePref: formData.deliveryTime,
                    paymentMethod: formData.paymentMethod,
                    totalAmount: totalAmount,
                    items: items
                })
            });

            if (res.ok) {
                setIsSuccess(true);
                clearCart();
            } else {
                alert('Order could not be placed. Please try again.');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('A network error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-20 text-center">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-800 mb-4">Order Confirmed!</h1>
                <p className="text-xl text-gray-600 mb-8">Thank you for your order, {formData.name}. We will deliver it to {formData.postalCode} within 24 hours.</p>
                <button onClick={() => router.push('/')} className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition">Return to Home</button>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-20 text-center">
                <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
                <button onClick={() => router.push('/shop')} className="bg-black text-white px-8 py-3 rounded-full font-bold">Go Shopping</button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <div className="flex flex-col lg:flex-row gap-12">
                <div className="flex-1">
                    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <div>
                            <h2 className="text-xl font-bold border-b pb-2 mb-4">Contact Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input required type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input required type="email" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input required type="tel" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                            </div>
                        </div>

                        <div className="pt-4">
                            <h2 className="text-xl font-bold border-b pb-2 mb-4">Delivery Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                                    <input required type="text" placeholder="House number and street name" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none" value={formData.addressLine} onChange={e => setFormData({ ...formData, addressLine: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                                    <select required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none bg-white" value={formData.postalCode} onChange={e => setFormData({ ...formData, postalCode: e.target.value })}>
                                        <option value="" disabled>Select code</option>
                                        {SERVED_POSTAL_CODES.map(code => (
                                            <option key={code} value={code}>{code}</option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-emerald-600 mt-1">We only deliver to these areas.</p>
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Delivery Time (Optional)</label>
                                <input type="time" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none" value={formData.deliveryTime} onChange={e => setFormData({ ...formData, deliveryTime: e.target.value })} />
                            </div>
                        </div>

                        <div className="pt-4">
                            <h2 className="text-xl font-bold border-b pb-2 mb-4">Payment Method</h2>
                            <div className="space-y-3">
                                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                                    <input type="radio" name="paymentMethod" value="CASH" checked={formData.paymentMethod === 'CASH'} onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })} className="w-5 h-5 text-black border-gray-300 focus:ring-black" />
                                    <span className="ml-3 font-medium">Cash on Delivery</span>
                                </label>
                                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                                    <input type="radio" name="paymentMethod" value="CREDIT_CARD" checked={formData.paymentMethod === 'CREDIT_CARD'} onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })} className="w-5 h-5 text-black border-gray-300 focus:ring-black" />
                                    <span className="ml-3 font-medium">Credit Card on Delivery</span>
                                </label>
                            </div>
                        </div>

                        <button disabled={isSubmitting} type="submit" className="w-full py-4 mt-8 bg-black text-white rounded-xl font-bold text-lg hover:bg-gray-900 transition flex justify-center items-center disabled:opacity-50">
                            {isSubmitting ? <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></span> : 'Place Order'}
                        </button>
                    </form>
                </div>

                <div className="w-full lg:w-96 flex-shrink-0">
                    <div className="bg-gray-50 p-6 rounded-2xl sticky top-24">
                        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                        <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                            {items.map(item => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="w-16 h-16 bg-white rounded-md overflow-hidden relative flex-shrink-0 border">
                                        {item.imageUrl && <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-sm line-clamp-2">{item.name}</p>
                                        <p className="text-gray-500 text-sm mt-1">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="font-bold">£{(item.price * item.quantity).toFixed(2)}</div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-200 pt-4 space-y-2">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>£{getTotalPrice().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Delivery</span>
                                <span>{getTotalPrice() >= 50 ? 'Free' : '£6.99'}</span>
                            </div>
                            <div className="flex justify-between text-2xl font-bold mt-4 pt-4 border-t">
                                <span>Total</span>
                                <span>£{(getTotalPrice() + (getTotalPrice() >= 50 ? 0 : 6.99)).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
