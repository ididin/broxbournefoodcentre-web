'use client';

import { useState } from 'react';
import { Eye } from 'lucide-react';

const MOCK_ORDERS = [
    { id: 'ORD-1029', customer: 'John Doe', email: 'john@example.com', total: 45.50, status: 'PENDING', date: '2 mins ago', method: 'Cash' },
    { id: 'ORD-1028', customer: 'Jane Smith', email: 'jane@example.com', total: 112.00, status: 'PROCESSING', date: '1 hour ago', method: 'Card' },
    { id: 'ORD-1027', customer: 'Guest User', email: 'guest123@guest.com', total: 15.20, status: 'DELIVERED', date: 'Yesterday', method: 'Cash' },
];

const STATUSES = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState(MOCK_ORDERS);

    const updateStatus = (id: string, newStatus: string) => {
        setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
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
                                    <td className="px-6 py-4 font-bold text-gray-900">{order.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{order.customer}</div>
                                        <div className="text-gray-500 text-xs">{order.email}</div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{order.date}</td>
                                    <td className="px-6 py-4 font-bold">£{order.total.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-gray-600">{order.method}</td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateStatus(order.id, e.target.value)}
                                            className={`text-sm font-bold border-none rounded-lg focus:ring-2 focus:ring-black px-3 py-1 cursor-pointer outline-none ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
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
                                        <button className="p-2 text-gray-500 hover:text-black transition-colors rounded hover:bg-gray-100">
                                            <Eye className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
