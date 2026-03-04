'use client';

import { useState, useEffect } from 'react';
import { Users, ShoppingBag, Package, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any[]>([]);
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const res = await fetch('/api/admin/dashboard');
        if (res.ok) {
            const data = await res.json();
            setStats(data.stats);
            setRecentActivity(data.recentActivity);
        }
        setLoading(false);
    };

    const getIconInfo = (type: string) => {
        switch (type) {
            case 'revenue': return { icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100' };
            case 'orders': return { icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-100' };
            case 'products': return { icon: Package, color: 'text-purple-600', bg: 'bg-purple-100' };
            case 'users': return { icon: Users, color: 'text-orange-600', bg: 'bg-orange-100' };
            default: return { icon: Package, color: 'text-gray-600', bg: 'bg-gray-100' };
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading dashboard data...</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.length > 0 ? stats.map((stat, index) => {
                    const iconInfo = getIconInfo(stat.type);
                    const Icon = iconInfo.icon;
                    return (
                        <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${iconInfo.bg} ${iconInfo.color}`}>
                                <Icon className="h-7 w-7" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                        </div>
                    );
                }) : <p className="text-gray-500">No stats available.</p>}
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-8">
                <h2 className="text-lg font-bold mb-4">Recent Activity</h2>
                <div className="space-y-4">
                    {recentActivity.length > 0 ? recentActivity.map((activity, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-medium">{activity.title}</p>
                                <p className="text-sm text-gray-500">{activity.subtitle}</p>
                            </div>
                            <span className="font-bold">{activity.value}</span>
                        </div>
                    )) : (
                        <div className="text-gray-500 text-center py-4">No recent activity</div>
                    )}
                </div>
            </div>
        </div>
    );
}
