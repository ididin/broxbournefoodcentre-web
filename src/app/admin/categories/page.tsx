'use client';

import { useState, useEffect } from 'react';

type Category = {
    id: string;
    name: string;
    slug: string;
    parentId: string | null;
    storeOrder: number;
    children?: Category[];
};

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [formData, setFormData] = useState({ id: '', name: '', slug: '', parentId: '', storeOrder: 0 });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const res = await fetch('/api/admin/categories');
        const data = await res.json();
        setCategories(data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = isEditing ? 'PUT' : 'POST';
        await fetch('/api/admin/categories', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        setFormData({ id: '', name: '', slug: '', parentId: '', storeOrder: 0 });
        setIsEditing(false);
        fetchCategories();
    };

    const handleEdit = (cat: Category) => {
        setFormData({ id: cat.id, name: cat.name, slug: cat.slug, parentId: cat.parentId || '', storeOrder: cat.storeOrder });
        setIsEditing(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category?')) return;
        await fetch('/api/admin/categories', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        fetchCategories();
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Category Management</h1>

            <div className="bg-white p-6 rounded-xl shadow-sm border mb-8">
                <h2 className="text-lg font-semibold mb-4">{isEditing ? 'Edit Category' : 'Create Category'}</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input required type="text" className="w-full px-3 py-2 border rounded-md" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Slug</label>
                        <input required type="text" className="w-full px-3 py-2 border rounded-md" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Parent Category</label>
                        <select className="w-full px-3 py-2 border rounded-md" value={formData.parentId} onChange={e => setFormData({ ...formData, parentId: e.target.value })}>
                            <option value="">None (Top Level)</option>
                            {categories.filter(c => !c.parentId && c.id !== formData.id).map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Store Order</label>
                        <input type="number" className="w-full px-3 py-2 border rounded-md" value={formData.storeOrder} onChange={e => setFormData({ ...formData, storeOrder: Number(e.target.value) })} />
                    </div>
                    <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                        {isEditing && (
                            <button type="button" onClick={() => { setIsEditing(false); setFormData({ id: '', name: '', slug: '', parentId: '', storeOrder: 0 }); }} className="px-4 py-2 border rounded-md text-gray-600">Cancel</button>
                        )}
                        <button type="submit" className="px-4 py-2 bg-black text-white rounded-md font-medium">Save</button>
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-semibold text-sm">Order</th>
                            <th className="p-4 font-semibold text-sm">Name</th>
                            <th className="p-4 font-semibold text-sm">Slug</th>
                            <th className="p-4 font-semibold text-sm">Parent</th>
                            <th className="p-4 font-semibold text-sm text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((cat) => (
                            <tr key={cat.id} className="border-b">
                                <td className="p-4">{cat.storeOrder}</td>
                                <td className="p-4 font-medium">{cat.name}</td>
                                <td className="p-4 text-gray-500">{cat.slug}</td>
                                <td className="p-4 text-gray-500">{cat.parentId ? 'Subcategory' : 'Top Level'}</td>
                                <td className="p-4 text-right">
                                    <button onClick={() => handleEdit(cat)} className="text-blue-600 hover:underline mr-3">Edit</button>
                                    <button onClick={() => handleDelete(cat.id)} className="text-red-600 hover:underline">Delete</button>
                                </td>
                            </tr>
                        ))}
                        {categories.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-500">No categories found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
