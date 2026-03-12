'use client';

import { useState, useEffect } from 'react';
import { Eye, X, Printer } from 'lucide-react';

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
            fetchOrders();
        }
    };

    const handlePrint = () => {
        if (!selectedOrder) return;

        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        printWindow.document.write(`
            <html>
                <head>
                    <title>Order Receipt - ${selectedOrder.id}</title>
                    <style>
                        body { font-family: monospace; padding: 20px; color: #000; }
                        .header { text-align: center; border-bottom: 2px dashed #000; padding-bottom: 15px; margin-bottom: 20px; }
                        .header h1 { margin: 0; font-size: 24px; }
                        .header p { margin: 5px 0 0 0; font-size: 14px; }
                        .section { margin-bottom: 20px; }
                        .strong { font-weight: bold; }
                        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                        th, td { text-align: left; padding: 8px 0; border-bottom: 1px solid #ddd; }
                        th.right, td.right { text-align: right; }
                        .totals { border-top: 2px dashed #000; padding-top: 15px; text-align: right; font-size: 18px; }
                        .footer { text-align: center; margin-top: 40px; font-size: 12px; }
                        @media print {
                            body { width: 80mm; padding: 0; margin: 0 auto; }
                            @page { margin: 0; }
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>BROXBOURNE FOOD CENTRE</h1>
                        <p>Order ID: ${selectedOrder.id}</p>
                        <p>Date: ${new Date(selectedOrder.createdAt).toLocaleString()}</p>
                    </div>
                    
                    <div class="section">
                        <p><span class="strong">Customer:</span> ${selectedOrder.user ? selectedOrder.user.name : 'Guest'}</p>
                        <p><span class="strong">Phone/Email:</span> ${selectedOrder.user ? selectedOrder.user.email : selectedOrder.guestEmail}</p>
                        <p><span class="strong">Address:</span> ${selectedOrder.deliveryAddress}</p>
                        <p><span class="strong">Payment:</span> ${selectedOrder.paymentMethod.replace(/_/g, ' ')}</p>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th class="right">Unit</th>
                                <th class="right">Qty</th>
                                <th class="right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${selectedOrder.orderItems.map(item => `
                                <tr>
                                    <td>${item.product.name}</td>
                                    <td class="right">£${item.priceAtBuy.toFixed(2)}</td>
                                    <td class="right">${item.quantity}</td>
                                    <td class="right">£${(item.quantity * item.priceAtBuy).toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>

                    <div class="totals">
                        <span class="strong">TOTAL: £${selectedOrder.totalAmount.toFixed(2)}</span>
                    </div>

                    <div class="footer">
                        <p>Thank you for shopping with us!</p>
                    </div>
                </body>
            </html>
        `);

        printWindow.document.close();

        // Wait for styles to load then print
        setTimeout(() => {
            printWindow.print();
        }, 250);
    };

    const activeOrders = orders.filter(o => !['DELIVERED', 'CANCELLED'].includes(o.status));
    const passiveOrders = orders.filter(o => ['DELIVERED', 'CANCELLED'].includes(o.status));

    const renderOrderTable = (orderList: Order[], emptyMessage: string) => (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
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
                        {orderList.map((order) => (
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
                        {orderList.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">{emptyMessage}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-10">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
                <p className="text-gray-500 text-sm mt-1">View and update customer order statuses.</p>
            </div>

            <div>
                <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span> Active Orders
                </h2>
                {renderOrderTable(activeOrders, "No active orders.")}
            </div>

            <div>
                <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gray-400"></span> Resolved / Past Orders
                </h2>
                {renderOrderTable(passiveOrders, "No past orders.")}
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
                            <div className="flex gap-2">
                                <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-lg text-sm font-bold transition-colors">
                                    <Printer className="h-4 w-4" />
                                    <span>Print</span>
                                </button>
                                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-full"><X className="h-5 w-5" /></button>
                            </div>
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
