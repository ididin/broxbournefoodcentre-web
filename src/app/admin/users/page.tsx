'use client';

import { useState, useEffect } from 'react';
import { User } from 'lucide-react';

type UserData = {
    id: string;
    name: string | null;
    email: string;
    role: string;
    createdAt: string;
    _count: {
        orders: number;
    };
};

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserData[]>([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const res = await fetch('/api/admin/users');
        const data = await res.json();
        setUsers(data);
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Registered Users</h1>
                <p className="text-gray-500 text-sm mt-1">View registered customers and their engagement.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
                            <tr>
                                <th className="px-6 py-4 font-semibold w-12">User</th>
                                <th className="px-6 py-4 font-semibold">Name</th>
                                <th className="px-6 py-4 font-semibold">Email</th>
                                <th className="px-6 py-4 font-semibold">Total Orders</th>
                                <th className="px-6 py-4 font-semibold">Joined At</th>
                                <th className="px-6 py-4 font-semibold">Role</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="h-8 w-8 bg-gray-100 rounded-full flex justify-center items-center text-gray-500">
                                            <User className="h-4 w-4" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gray-900">{user.name || 'N/A'}</td>
                                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-bold text-xs">{user._count.orders} Orders</span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-bold rounded ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No registered users found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
