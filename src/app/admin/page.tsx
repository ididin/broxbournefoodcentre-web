import { Users, ShoppingBag, Package, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
    const stats = [
        { label: 'Total Revenue', value: '£12,450', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100' },
        { label: 'Active Orders', value: '24', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: 'Total Products', value: '1,248', icon: Package, color: 'text-purple-600', bg: 'bg-purple-100' },
        { label: 'Registered Users', value: '892', icon: Users, color: 'text-orange-600', bg: 'bg-orange-100' },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${stat.bg} ${stat.color}`}>
                            <stat.icon className="h-7 w-7" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-8">
                <h2 className="text-lg font-bold mb-4">Recent Activity</h2>
                <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-medium">New Order #ORD-1029</p>
                            <p className="text-sm text-gray-500">Placed 2 mins ago by John Doe</p>
                        </div>
                        <span className="font-bold">£45.50</span>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-medium">Product Stock Updated</p>
                            <p className="text-sm text-gray-500">"Whole Milk (2L)" marked as Out of Stock</p>
                        </div>
                        <span className="text-sm text-gray-500">1 hour ago</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
