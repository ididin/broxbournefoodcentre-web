'use client';

import { useState } from 'react';
import { Download, Upload, Plus, Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';

const MOCK_PRODUCTS = [
    { id: '1', name: 'Fresh Organic Bananas (1kg)', price: 1.50, stockOut: false, category: 'Produce', storeOrder: 1 },
    { id: '2', name: 'Whole Milk (2L)', price: 1.25, stockOut: true, category: 'Dairy', storeOrder: 2 },
    { id: '3', name: 'Farm Fresh Eggs (12 pk)', price: 2.10, stockOut: false, category: 'Dairy', storeOrder: 3 },
];

export default function AdminProductsPage() {
    const [products, setProducts] = useState(MOCK_PRODUCTS);

    const toggleStock = (id: string) => {
        setProducts(products.map(p => p.id === id ? { ...p, stockOut: !p.stockOut } : p));
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Products Management</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage product details and stock status.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                        <Download className="h-4 w-4" /> Download Excel
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                        <Upload className="h-4 w-4" /> Upload Excel
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg shadow-sm text-sm font-medium hover:bg-gray-900">
                        <Plus className="h-4 w-4" /> Add Product
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Product Name</th>
                                <th className="px-6 py-4 font-semibold">Category</th>
                                <th className="px-6 py-4 font-semibold">Price</th>
                                <th className="px-6 py-4 font-semibold">Store Order</th>
                                <th className="px-6 py-4 font-semibold text-center">Stock Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                                    <td className="px-6 py-4 text-gray-600">{product.category}</td>
                                    <td className="px-6 py-4 text-gray-900 font-medium">£{product.price.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-gray-600">{product.storeOrder}</td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => toggleStock(product.id)}
                                            className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${product.stockOut
                                                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                }`}
                                        >
                                            {product.stockOut ? 'Out of Stock' : 'In Stock'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors inline-block"><Edit className="h-4 w-4" /></button>
                                        <button className="p-2 text-gray-400 hover:text-red-600 transition-colors inline-block"><Trash2 className="h-4 w-4" /></button>
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
