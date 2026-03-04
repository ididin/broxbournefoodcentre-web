'use client';

import { useState, useEffect } from 'react';
import { Download, Upload, Plus, Edit, Trash2, X } from 'lucide-react';
import Image from 'next/image';

type Category = {
    id: string;
    name: string;
};

type Product = {
    id: string;
    name: string;
    description: string | null;
    price: number;
    imageUrl: string | null;
    category: string;
    categoryId: string | null;
    brand: string | null;
    stockOut: boolean;
    storeOrder: number;
    categoryRef?: Category | null;
};

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        id: '', name: '', description: '', price: 0, imageUrl: '', category: '', categoryId: '', brand: '', stockOut: false, storeOrder: 0
    });

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        const res = await fetch('/api/admin/products');
        const data = await res.json();
        setProducts(data);
    };

    const fetchCategories = async () => {
        const res = await fetch('/api/admin/categories');
        const data = await res.json();
        setCategories(data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = isEditing ? 'PUT' : 'POST';

        // Find category name if categoryId is selected
        const selectedCat = categories.find(c => c.id === formData.categoryId);
        const submitData = {
            ...formData,
            category: selectedCat ? selectedCat.name : formData.category
        };

        await fetch('/api/admin/products', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(submitData)
        });

        setIsModalOpen(false);
        fetchProducts();
    };

    const handleEdit = (prod: Product) => {
        setFormData({
            id: prod.id,
            name: prod.name,
            description: prod.description || '',
            price: prod.price,
            imageUrl: prod.imageUrl || '',
            category: prod.category || '',
            categoryId: prod.categoryId || '',
            brand: prod.brand || '',
            stockOut: prod.stockOut,
            storeOrder: prod.storeOrder
        });
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        await fetch('/api/admin/products', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        fetchProducts();
    };

    const openCreateModal = () => {
        setFormData({ id: '', name: '', description: '', price: 0, imageUrl: '', category: '', categoryId: '', brand: '', stockOut: false, storeOrder: 0 });
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const toggleStock = async (prod: Product) => {
        await fetch('/api/admin/products', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: prod.id, stockOut: !prod.stockOut })
        });
        fetchProducts();
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Products Management</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage product details and stock status.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button onClick={openCreateModal} className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg shadow-sm text-sm font-medium hover:bg-gray-900">
                        <Plus className="h-4 w-4" /> Add Product
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Image</th>
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
                                    <td className="px-6 py-4">
                                        <div className="h-10 w-10 bg-gray-100 rounded-lg overflow-hidden relative">
                                            {product.imageUrl ? <Image src={product.imageUrl} alt={product.name} fill className="object-cover" /> : null}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                                    <td className="px-6 py-4 text-gray-600">{product.categoryRef ? product.categoryRef.name : product.category}</td>
                                    <td className="px-6 py-4 text-gray-900 font-medium">£{product.price.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-gray-600">{product.storeOrder}</td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => toggleStock(product)}
                                            className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${product.stockOut
                                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                }`}
                                        >
                                            {product.stockOut ? 'Out of Stock' : 'In Stock'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button onClick={() => handleEdit(product)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors inline-block"><Edit className="h-4 w-4" /></button>
                                        <button onClick={() => handleDelete(product.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors inline-block"><Trash2 className="h-4 w-4" /></button>
                                    </td>
                                </tr>
                            ))}
                            {products.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">No products found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center overflow-y-auto pt-10 pb-10">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-2xl mt-auto mb-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-800"><X /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-1">Product Name</label>
                                <input required type="text" className="w-full px-3 py-2 border rounded-md" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea className="w-full px-3 py-2 border rounded-md" rows={2} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Price (£)</label>
                                <input required type="number" step="0.01" className="w-full px-3 py-2 border rounded-md" value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Brand</label>
                                <input type="text" className="w-full px-3 py-2 border rounded-md" value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Linked Category</label>
                                <select className="w-full px-3 py-2 border rounded-md" value={formData.categoryId} onChange={e => setFormData({ ...formData, categoryId: e.target.value })}>
                                    <option value="">Select a Category</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Legacy Category String</label>
                                <input type="text" className="w-full px-3 py-2 border rounded-md text-gray-500 bg-gray-50" value={formData.category} readOnly placeholder="Auto-filled from Linked Category" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-1">Image URL</label>
                                <input type="text" className="w-full px-3 py-2 border rounded-md" value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Store Order</label>
                                <input type="number" className="w-full px-3 py-2 border rounded-md" value={formData.storeOrder} onChange={e => setFormData({ ...formData, storeOrder: Number(e.target.value) })} />
                            </div>
                            <div className="flex items-center pt-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="w-5 h-5" checked={formData.stockOut} onChange={e => setFormData({ ...formData, stockOut: e.target.checked })} />
                                    <span className="font-medium text-red-600">Mark as Out of Stock</span>
                                </label>
                            </div>

                            <div className="md:col-span-2 flex justify-end gap-3 mt-4 pt-4 border-t">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg text-gray-600 font-medium">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-black text-white rounded-lg font-medium">Save Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
