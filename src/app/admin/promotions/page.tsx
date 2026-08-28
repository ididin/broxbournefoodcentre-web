'use client';

import { useState, useEffect } from 'react';
import { Search, Loader2, Save, X, Tag } from 'lucide-react';

interface ProductVariant {
    id?: string;
    weightLabel: string;
    price: number;
    promoPrice?: number | null;
}

interface Product {
    id: string;
    name: string;
    price: number;
    promoPrice?: number | null;
    isPromoted: boolean;
    sellType: 'PIECE' | 'WEIGHT';
    variants: ProductVariant[];
    imageUrl?: string | null;
    categoryRef?: { name: string };
}

export default function PromotionsAdmin() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [saving, setSaving] = useState(false);
    const [showOnlyPromoted, setShowOnlyPromoted] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/admin/products');
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error('Failed to fetch products', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProduct) return;
        setSaving(true);
        try {
            const res = await fetch('/api/admin/products', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: editingProduct.id,
                    isPromoted: editingProduct.isPromoted,
                    price: editingProduct.price,
                    promoPrice: editingProduct.promoPrice,
                    variants: editingProduct.variants
                })
            });
            if (res.ok) {
                await fetchProducts();
                setEditingProduct(null);
            }
        } catch (error) {
            console.error('Failed to save promotion', error);
        } finally {
            setSaving(false);
        }
    };

    const togglePromoteQuick = async (product: Product, isPromoted: boolean) => {
        try {
            const res = await fetch('/api/admin/products', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: product.id, isPromoted })
            });
            if (res.ok) {
                setProducts(products.map(p => p.id === product.id ? { ...p, isPromoted } : p));
            }
        } catch (error) {
            console.error('Failed to toggle promotion', error);
        }
    };

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = showOnlyPromoted ? p.isPromoted : true;
        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Promotions Management</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage special offers, discounts and promoted products</p>
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
                <div className="relative flex-1 max-w-md w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                        <input
                            type="checkbox"
                            className="w-4 h-4 accent-emerald-600"
                            checked={showOnlyPromoted}
                            onChange={(e) => setShowOnlyPromoted(e.target.checked)}
                        />
                        Show only promoted products
                    </label>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
                            <tr>
                                <th className="px-6 py-3 font-semibold">Product</th>
                                <th className="px-6 py-3 font-semibold">Type</th>
                                <th className="px-6 py-3 font-semibold">Current Price</th>
                                <th className="px-6 py-3 font-semibold text-center">Promoted</th>
                                <th className="px-6 py-3 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {product.imageUrl ? (
                                                <img src={product.imageUrl} alt={product.name} className="w-10 h-10 rounded-md object-cover border" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center border"><Tag className="w-4 h-4 text-gray-400" /></div>
                                            )}
                                            <div>
                                                <div className="font-bold text-gray-900">{product.name}</div>
                                                <div className="text-xs text-gray-500">{product.categoryRef?.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-semibold">{product.sellType}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {product.sellType === 'PIECE' ? (
                                            <div>
                                                {product.promoPrice && <span className="text-xs text-gray-400 line-through mr-2">£{product.promoPrice.toFixed(2)}</span>}
                                                <span className="font-semibold text-emerald-600">£{product.price.toFixed(2)}</span>
                                            </div>
                                        ) : (
                                            <div className="text-xs text-gray-500">{product.variants?.length || 0} variants</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" checked={product.isPromoted} onChange={(e) => togglePromoteQuick(product, e.target.checked)} />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                        </label>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => setEditingProduct({ ...product })} className="px-3 py-1.5 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800">
                                            Manage Prices
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredProducts.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No products found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Price Management Modal */}
            {editingProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-lg">Manage Promotion</h3>
                            <button onClick={() => setEditingProduct(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-6">
                            
                            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                <div>
                                    <h4 className="font-bold text-emerald-900">Enable Promotion</h4>
                                    <p className="text-xs text-emerald-700 mt-1">Display this product in the Special Offers sections.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={editingProduct.isPromoted} onChange={(e) => setEditingProduct({ ...editingProduct, isPromoted: e.target.checked })} />
                                    <div className="w-11 h-6 bg-emerald-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                                </label>
                            </div>

                            {editingProduct.sellType === 'PIECE' ? (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold mb-1 text-gray-700">Promo Price (£)</label>
                                        <input type="number" step="0.01" className="w-full px-3 py-2 border rounded-md" placeholder="e.g. 5.99" value={editingProduct.promoPrice || ''} onChange={e => setEditingProduct({ ...editingProduct, promoPrice: e.target.value ? Number(e.target.value) : null })} />
                                        <p className="text-[10px] text-gray-400 mt-1">Leave empty for no strike-through.</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-1 text-emerald-700">New Price (£)</label>
                                        <input required type="number" step="0.01" className="w-full px-3 py-2 border-2 border-emerald-500 rounded-md" value={editingProduct.price} onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })} />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-gray-800 border-b pb-2">Variant Prices</h4>
                                    {editingProduct.variants.map((variant, index) => (
                                        <div key={index} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border">
                                            <div className="flex-1 font-semibold text-sm">{variant.weightLabel}</div>
                                            <div className="w-24">
                                                <label className="block text-[10px] font-medium text-gray-500 mb-1">Promo Price</label>
                                                <input type="number" step="0.01" className="w-full px-2 py-1.5 border rounded text-sm" placeholder="Old" value={variant.promoPrice || ''} onChange={e => {
                                                    const newVariants = [...editingProduct.variants];
                                                    newVariants[index].promoPrice = e.target.value ? Number(e.target.value) : null;
                                                    setEditingProduct({ ...editingProduct, variants: newVariants });
                                                }} />
                                            </div>
                                            <div className="w-24">
                                                <label className="block text-[10px] font-medium text-emerald-600 mb-1">New Price</label>
                                                <input required type="number" step="0.01" className="w-full px-2 py-1.5 border-2 border-emerald-400 rounded text-sm" value={variant.price} onChange={e => {
                                                    const newVariants = [...editingProduct.variants];
                                                    newVariants[index].price = Number(e.target.value);
                                                    setEditingProduct({ ...editingProduct, variants: newVariants });
                                                }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <button type="button" onClick={() => setEditingProduct(null)} className="px-4 py-2 border rounded-lg text-gray-600 font-medium hover:bg-gray-50">Cancel</button>
                                <button type="submit" disabled={saving} className="px-6 py-2 bg-black text-white rounded-lg font-medium flex items-center gap-2 hover:bg-gray-800 disabled:opacity-50">
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
