'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Package, ShoppingBag, LayoutDashboard, Settings, Layers, Image, Tag, Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();

    const navLinks = [
        { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
        { href: '/admin/products', icon: Package, label: 'Products' },
        { href: '/admin/categories', icon: Package, label: 'Categories' },
        { href: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
        { href: '/admin/users', icon: Settings, label: 'Users' },
        { href: '/admin/messages', icon: Settings, label: 'Messages' },
        { href: '/admin/media', icon: Settings, label: 'Media' },
        { href: '/admin/reports', icon: Settings, label: 'Reports' },
        { href: '/admin/excel', icon: Settings, label: 'Excel İşlemleri' },
        { href: '/admin/slider', icon: Layers, label: 'Slider Yönetimi' },
        { href: '/admin/banner', icon: Image, label: 'Promo Banner' },
        { href: '/admin/promotions', icon: Tag, label: 'Promotions' },
    ];

    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 shrink-0">
                    <span className="text-xl font-bold">Admin Panel</span>
                    <button onClick={closeSidebar} className="md:hidden text-gray-500 hover:text-black">
                        <X className="h-6 w-6" />
                    </button>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/admin');
                        return (
                            <Link 
                                key={link.href}
                                href={link.href} 
                                onClick={closeSidebar}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                            >
                                <Icon className="h-5 w-5" /> {link.label}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 md:px-6 justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="md:hidden text-gray-700 hover:text-black focus:outline-none"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                        <h1 className="text-xl font-semibold text-gray-800 hidden md:block">Broxbourne Food Centre</h1>
                        <span className="text-xl font-bold md:hidden ml-1">Admin</span>
                    </div>
                    
                    <div className="flex items-center gap-3 md:gap-4">
                        <Link href="/" className="text-sm font-medium text-blue-600 hover:underline hidden sm:block">View Store</Link>
                        <Link href="/" className="text-sm font-medium text-blue-600 hover:underline sm:hidden">Store</Link>
                        <div className="h-8 w-8 bg-black text-white rounded-full flex items-center justify-center font-bold shrink-0">A</div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-4 md:p-6 flex-1 overflow-x-hidden overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
