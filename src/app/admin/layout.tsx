import Link from 'next/link';
import { Package, ShoppingBag, LayoutDashboard, Settings } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-gray-200">
                    <span className="text-xl font-bold">Admin Panel</span>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2">
                    <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                        <LayoutDashboard className="h-5 w-5" /> Dashboard
                    </Link>
                    <Link href="/admin/products" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                        <Package className="h-5 w-5" /> Products
                    </Link>
                    <Link href="/admin/orders" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                        <ShoppingBag className="h-5 w-5" /> Orders
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 justify-between">
                    <h1 className="text-xl font-semibold text-gray-800 hidden md:block">Broxbourne Food Centre</h1>
                    <div className="md:hidden">
                        <span className="text-xl font-bold">Admin Panel</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-sm font-medium text-blue-600 hover:underline">View Store</Link>
                        <div className="h-8 w-8 bg-black text-white rounded-full flex items-center justify-center font-bold">A</div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-6 md:p-8 flex-1 overflow-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
