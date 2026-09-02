'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';

function OrderTrackingContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialOrderNumber = searchParams.get('orderNumber') || '';
    
    const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchOrder = async (numberToFetch: string) => {
        if (!numberToFetch) return;
        setLoading(true);
        setError('');
        setOrder(null);
        try {
            const res = await fetch(`/api/orders/tracking?orderNumber=${numberToFetch}`);
            if (!res.ok) {
                const data = await res.json();
                setError(data.error || 'Order not found');
            } else {
                const data = await res.json();
                setOrder(data.order);
                // Update URL without reload
                if (orderNumber !== numberToFetch) {
                    router.replace(`/order-tracking?orderNumber=${numberToFetch}`);
                }
            }
        } catch (err) {
            setError('A network error occurred.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (initialOrderNumber) {
            fetchOrder(initialOrderNumber);
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchOrder(orderNumber);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800';
            case 'PROCESSING': return 'bg-blue-100 text-blue-800';
            case 'SHIPPED': return 'bg-purple-100 text-purple-800';
            case 'DELIVERED': return 'bg-green-100 text-green-800';
            case 'CANCELLED': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8 text-center">Track Your Order</h1>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
                    <input
                        type="text"
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value)}
                        placeholder="Enter your Order Number (e.g., ORD-ABC12345)"
                        className="flex-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-black outline-none"
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition disabled:opacity-50"
                    >
                        {loading ? 'Searching...' : 'Track Order'}
                    </button>
                </form>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center font-medium">
                    {error}
                </div>
            )}

            {order && (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b pb-6">
                        <div>
                            <h2 className="text-2xl font-bold">Order {order.orderNumber}</h2>
                            <p className="text-gray-500 mt-1">
                                Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                            </p>
                        </div>
                        <div className={`mt-4 md:mt-0 px-4 py-2 rounded-full font-bold text-sm ${getStatusColor(order.status)}`}>
                            {order.status}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div>
                            <h3 className="font-bold text-lg mb-2">Delivery Details</h3>
                            <p className="text-gray-600">{order.deliveryAddress}</p>
                            {order.deliveryTimePref && (
                                <p className="text-gray-600 mt-1">Preferred Time: {order.deliveryTimePref}</p>
                            )}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-2">Payment Details</h3>
                            <p className="text-gray-600">{order.paymentMethod.replace(/_/g, ' ')}</p>
                            <p className="text-gray-600 font-bold mt-1">Total: £{order.totalAmount.toFixed(2)}</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-4">Order Items</h3>
                        <div className="space-y-4">
                            {order.orderItems.map((item: any) => (
                                <div key={item.id} className="flex gap-4 border border-gray-100 p-4 rounded-xl">
                                    <div className="w-16 h-16 bg-gray-50 rounded-md overflow-hidden relative flex-shrink-0">
                                        {item.product?.imageUrl && (
                                            <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-cover" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">{item.product?.name || 'Product not found'}</p>
                                        {item.variantName && (
                                            <p className="text-emerald-600 font-bold text-xs">{item.variantName}</p>
                                        )}
                                        <p className="text-gray-500 text-sm mt-1">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="font-bold">£{(item.priceAtBuy * item.quantity).toFixed(2)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function OrderTrackingPage() {
    return (
        <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
            <OrderTrackingContent />
        </Suspense>
    );
}
