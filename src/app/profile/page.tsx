'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCartStore } from '@/store/useCartStore';

const POSTAL_CITY_MAP: Record<string, string> = {
    'EN8': 'Waltham Cross',
    'EN9': 'Waltham Abbey',
    'EN10': 'Broxbourne',
    'EN11': 'Hoddesdon'
};

const SERVED_POSTAL_CODES = Object.keys(POSTAL_CITY_MAP);

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { addItem, openCart } = useCartStore();

    const [activeTab, setActiveTab] = useState<'orders' | 'addresses'>('orders');
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [newAddress, setNewAddress] = useState({ 
        title: '', 
        name: '', 
        email: '', 
        phone: '', 
        addressLine: '', 
        postalCode: '', 
        city: '',
        isDefault: false
    });
    const [isAddingAddress, setIsAddingAddress] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated') {
            fetchProfile();
        }
    }, [status]);

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/profile');
            if (res.ok) {
                const data = await res.json();
                setProfile(data);
            }
        } catch (error) {
            console.error('Failed to fetch profile', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newAddress)
            });
            if (res.ok) {
                setNewAddress({ 
                    title: '', name: '', email: '', phone: '', addressLine: '', postalCode: '', city: '', isDefault: false 
                });
                setIsAddingAddress(false);
                fetchProfile();
            }
        } catch (error) {
            console.error('Failed to add address', error);
        }
    };

    const handleDeleteAddress = async (id: string) => {
        if (!confirm('Are you sure you want to delete this address?')) return;
        try {
            const res = await fetch(`/api/profile/addresses/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchProfile();
            }
        } catch (error) {
            console.error('Failed to delete address', error);
        }
    };

    const handleReorder = (order: any) => {
        let itemsAdded = 0;
        
        order.orderItems.forEach((item: any) => {
            if (item.product && !item.product.stockOut) {
                // Ensure we use the current price, not priceAtBuy
                // Depending on the logic, if they used a variant, we should look up variant price, but for simplicity here we use the current product price or promoPrice.
                const currentPrice = item.product.promoPrice || item.product.price;

                addItem({
                    id: item.variantName ? `${item.product.id}-${item.variantName}` : item.product.id,
                    productId: item.product.id,
                    name: item.product.name,
                    price: currentPrice, // Güncel fiyat!
                    quantity: item.quantity,
                    imageUrl: item.product.imageUrl,
                    variantName: item.variantName
                });
                itemsAdded++;
            }
        });

        if (itemsAdded > 0) {
            openCart();
        } else {
            alert('Unfortunately, none of the items in this order are currently available.');
        }
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

    if (loading || status === 'loading') {
        return <div className="text-center py-20">Loading profile...</div>;
    }

    if (!profile) {
        return null; // Will redirect in useEffect
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">My Profile</h1>
                    <p className="text-gray-500 mt-1">Welcome back, {profile.name || profile.email}</p>
                </div>
            </div>

            <div className="flex gap-4 border-b border-gray-200 mb-8">
                <button
                    onClick={() => setActiveTab('orders')}
                    className={`pb-4 px-2 font-medium border-b-2 transition ${activeTab === 'orders' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-black'}`}
                >
                    Order History
                </button>
                <button
                    onClick={() => setActiveTab('addresses')}
                    className={`pb-4 px-2 font-medium border-b-2 transition ${activeTab === 'addresses' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-black'}`}
                >
                    Saved Addresses
                </button>
            </div>

            {activeTab === 'orders' && (
                <div>
                    {profile.orders.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-2xl">
                            <h2 className="text-xl font-bold mb-2">No orders yet</h2>
                            <p className="text-gray-500 mb-6">Looks like you haven't placed any orders.</p>
                            <button onClick={() => router.push('/shop')} className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800">
                                Start Shopping
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {profile.orders.map((order: any) => (
                                <div key={order.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b">
                                        <div>
                                            <p className="text-sm text-gray-500">Order {order.orderNumber || order.id.slice(-8).toUpperCase()}</p>
                                            <p className="font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="flex items-center gap-4 mt-4 md:mt-0">
                                            <div className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </div>
                                            <p className="font-bold text-lg">£{order.totalAmount.toFixed(2)}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 overflow-x-auto pb-4 mb-4">
                                        {order.orderItems.map((item: any) => (
                                            <div key={item.id} className="flex-shrink-0 w-16 h-16 bg-gray-50 rounded-lg overflow-hidden relative border">
                                                {item.product?.imageUrl && (
                                                    <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-cover" />
                                                )}
                                                <div className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                                                    {item.quantity}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <button 
                                            onClick={() => handleReorder(order)}
                                            className="bg-black text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-gray-800 transition"
                                        >
                                            Reorder Items
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'addresses' && (
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">My Addresses</h2>
                        <button 
                            onClick={() => setIsAddingAddress(!isAddingAddress)}
                            className="text-sm font-bold bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200"
                        >
                            {isAddingAddress ? 'Cancel' : '+ Add New'}
                        </button>
                    </div>

                    {isAddingAddress && (
                        <form onSubmit={handleAddAddress} className="bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Title (e.g., Home, Work)</label>
                                    <input required type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none" value={newAddress.title} onChange={e => setNewAddress({...newAddress, title: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Full Name</label>
                                    <input required type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none" value={newAddress.name} onChange={e => setNewAddress({...newAddress, name: e.target.value})} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Email</label>
                                    <input required type="email" className="w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none" value={newAddress.email} onChange={e => setNewAddress({...newAddress, email: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Phone Number</label>
                                    <input required type="tel" className="w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none" value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Postal Code</label>
                                    <select 
                                        required 
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none bg-white" 
                                        value={newAddress.postalCode} 
                                        onChange={e => {
                                            const code = e.target.value;
                                            setNewAddress({
                                                ...newAddress, 
                                                postalCode: code,
                                                city: POSTAL_CITY_MAP[code] || newAddress.city
                                            });
                                        }}
                                    >
                                        <option value="" disabled>Select code</option>
                                        {SERVED_POSTAL_CODES.map(code => (
                                            <option key={code} value={code}>{code}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">City</label>
                                    <input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none bg-gray-100" readOnly value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Street Address</label>
                                <input required type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none" value={newAddress.addressLine} onChange={e => setNewAddress({...newAddress, addressLine: e.target.value})} />
                            </div>
                            <div className="mb-4 flex items-center">
                                <input type="checkbox" id="isDefault" className="w-4 h-4 mr-2 cursor-pointer text-black focus:ring-black" checked={newAddress.isDefault} onChange={e => setNewAddress({...newAddress, isDefault: e.target.checked})} />
                                <label htmlFor="isDefault" className="text-sm font-medium cursor-pointer">Set as default address</label>
                            </div>
                            <button type="submit" className="bg-black text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800">
                                Save Address
                            </button>
                        </form>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {profile.addresses.map((address: any) => (
                            <div key={address.id} className={`border p-6 rounded-2xl relative ${address.isDefault ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold">{address.title}</h3>
                                    {address.isDefault && (
                                        <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded">Default</span>
                                    )}
                                </div>
                                {address.name && <p className="text-gray-800 font-medium text-sm mb-1">{address.name}</p>}
                                {address.phone && <p className="text-gray-600 text-sm mb-1">{address.phone}</p>}
                                {address.email && <p className="text-gray-600 text-sm mb-2">{address.email}</p>}
                                <p className="text-gray-600 text-sm mb-1">{address.addressLine}</p>
                                <p className="text-gray-600 text-sm mb-1">{address.city}</p>
                                <p className="text-gray-600 text-sm">{address.postalCode}</p>

                                <button 
                                    onClick={() => handleDeleteAddress(address.id)}
                                    className="absolute bottom-4 right-4 text-red-500 hover:text-red-700 text-sm font-medium bg-white px-2 py-1 rounded"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
