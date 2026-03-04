'use client';

import { useState, useEffect } from 'react';
import { Eye, X } from 'lucide-react';

type Order = {
    id: string;
    userId: string | null;
    user: { name: string, email: string } | null;
    guestEmail: string | null;
    deliveryAddress: string;
    deliveryTimePref: string | null;
    paymentMethod: string;
    status: string;
    totalAmount: number;
    createdAt: string;
    orderItems: { id: string, quantity: number, priceAtBuy: number, product: { name: string } }[];
};

const STATUSES = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        const res = await fetch('/api/admin/orders');
        const data = await res.json();
        setOrders(data);
    };

    const updateStatus = async (id: string, newStatus: string) => {
        // Optimistic update
        setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));

        const res = await fetch('/api/admin/orders', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status: newStatus })
        });

        if (!res.ok) {
            // Revert on failure
            fetchOrders();
        }
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
                <p className="text-gray-500 text-sm mt-1">View and update customer order statuses.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Order ID</th>
                                <th className="px-6 py-4 font-semibold">Customer</th>
                                <th className="px-6 py-4 font-semibold">Date</th>
                                <th className="px-6 py-4 font-semibold">Total</th>
                                <th className="px-6 py-4 font-semibold">Payment</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-gray-900 text-xs">{order.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{order.user ? order.user.name : 'Guest'}</div>
                                        <div className="text-gray-500 text-xs">{order.user ? order.user.email : order.guestEmail}</div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{new Date(order.createdAt).toLocaleString()}</td>
                                    <td className="px-6 py-4 font-bold">£{order.totalAmount.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {order.paymentMethod.replace(/_/g, ' ')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateStatus(order.id, e.target.value)}
                                            className={`text-xs font-bold border-none rounded-lg focus:ring-2 focus:ring-black px-3 py-1 cursor-pointer outline-none ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                    order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                                                        order.status === 'SHIPPED' ? 'bg-purple-100 text-purple-800' :
                                                            order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                                                'bg-red-100 text-red-800'
                                                }`}
                                        >
                                            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => setSelectedOrder(order)} className="p-2 text-gray-500 hover:text-black transition-colors rounded hover:bg-gray-100">
                                            <Eye className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">No orders found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center overflow-y-auto pt-10 pb-10">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-3xl mt-auto mb-auto">
                        <div className="flex justify-between items-center mb-6 border-b pb-4">
                            <div>
                                <h2 className="text-xl font-bold">Order Details</h2>
                                <p className="text-sm text-gray-500">{selectedOrder.id}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-full"><X className="h-5 w-5" /></button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div>
                                <h3 className="font-semibold text-gray-700 mb-2 border-b pb-1">Customer Info</h3>
                                <div className="text-sm space-y-1">
                                    <p><span className="font-medium">Name:</span> {selectedOrder.user ? selectedOrder.user.name : 'Guest'}</p>
                                    <p><span className="font-medium">Email:</span> {selectedOrder.user ? selectedOrder.user.email : selectedOrder.guestEmail}</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-700 mb-2 border-b pb-1">Order Info</h3>
                                <div className="text-sm space-y-1">
                                    <p><span className="font-medium">Date:</span> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                                    <p><span className="font-medium">Status:</span>
                                        <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold bg-gray-100">
                                            {selectedOrder.status}
                                        </span>
                                    </p>
                                    <p><span className="font-medium">Payment:</span> {selectedOrder.paymentMethod}</p>
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <h3 className="font-semibold text-gray-700 mb-2 border-b pb-1">Delivery Details</h3>
                                <div className="text-sm space-y-1">
                                    <p><span className="font-medium">Address:</span> {selectedOrder.deliveryAddress}</p>
                                    <p><span className="font-medium">Preferred Time:</span> {selectedOrder.deliveryTimePref || 'Not specified'}</p>
                                </div>
                            </div>
                        </div>

                        <h3 className="font-semibold text-gray-700 mb-3 border-b pb-1">Order Items</h3>
                        <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                            {selectedOrder.orderItems.map(item => (
                                <div key={item.id} className="flex justify-between items-center text-sm p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium">{item.product.name}</p>
                                        <p className="text-gray-500">Qty: {item.quantity} x £{item.priceAtBuy.toFixed(2)}</p>
                                    </div>
                                    <div className="font-bold">
                                        £{(item.quantity * item.priceAtBuy).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center border-t pt-4">
                            <span className="font-bold text-lg text-gray-600">Total Amount</span>
                            <span className="font-black text-2xl text-emerald-600">£{selectedOrder.totalAmount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
