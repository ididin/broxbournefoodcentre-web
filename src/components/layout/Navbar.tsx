'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ShoppingCart, User, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
    const totalItems = useCartStore((state) => state.getTotalItems());
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { data: session } = useSession();

    return (
        <>
            <div className="bg-emerald-600 text-white text-xs sm:text-sm font-semibold py-2.5 px-4 text-center tracking-wide">
                📍 Delivery to: EN10, EN11, EN8 & EN9 | 🚀 Delivered within 24 hours | 💷 Free Delivery £50+ (Under £50: £6.99 fee)
            </div>
            <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20 items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/" className="flex items-center gap-3">
                                <img src="/logo.png" alt="Broxbournefoodcentre logo" className="h-14 md:h-16 w-auto object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            <Link href="/" className="text-slate-600 hover:text-emerald-600 font-semibold transition-colors">
                                Home Page
                            </Link>
                            <Link href="/shop" className="text-slate-600 hover:text-emerald-600 font-semibold transition-colors">
                                Shop
                            </Link>
                            <Link href="/services" className="text-slate-600 hover:text-emerald-600 font-semibold transition-colors">
                                Services
                            </Link>
                            <Link href="/contact" className="text-slate-600 hover:text-emerald-600 font-semibold transition-colors">
                                Contact
                            </Link>

                            <button onClick={() => useCartStore.getState().openCart()} className="text-slate-600 hover:text-emerald-600 relative transition-colors group">
                                <ShoppingCart className="h-6 w-6 group-hover:scale-110 transition-transform" />
                                {totalItems > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
                                        {totalItems}
                                    </span>
                                )}
                            </button>

                            {session ? (
                                <div className="flex items-center space-x-4">
                                    <Link href={session.user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'} className="text-slate-600 hover:text-emerald-600 transition-colors flex items-center gap-1">
                                        <LayoutDashboard className="h-5 w-5" />
                                    </Link>
                                    <button onClick={() => signOut()} className="text-slate-600 hover:text-red-600 transition-colors">
                                        <LogOut className="h-5 w-5 hover:scale-110 transition-transform" />
                                    </button>
                                </div>
                            ) : (
                                <Link href="/login" className="text-slate-600 hover:text-emerald-600 transition-colors">
                                    <User className="h-6 w-6 hover:scale-110 transition-transform" />
                                </Link>
                            )}
                        </div>

                        {/* Mobile Actions & Toggle */}
                        <div className="flex md:hidden items-center space-x-4">
                            <button onClick={() => useCartStore.getState().openCart()} className="text-slate-600 relative transition-colors">
                                <ShoppingCart className="h-6 w-6" />
                                {totalItems > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
                                        {totalItems}
                                    </span>
                                )}
                            </button>

                            {session ? (
                                <button onClick={() => signOut()} className="text-slate-600 transition-colors">
                                    <LogOut className="h-6 w-6" />
                                </button>
                            ) : (
                                <Link href="/login" className="text-slate-600 transition-colors">
                                    <User className="h-6 w-6" />
                                </Link>
                            )}

                            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600 p-1">
                                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white border-b border-gray-100 px-4 py-4 space-y-4 shadow-lg absolute w-full">
                        <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block text-slate-600 font-semibold">Home Page</Link>
                        <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="block text-slate-600 font-semibold">Shop</Link>
                        <Link href="/services" onClick={() => setIsMobileMenuOpen(false)} className="block text-slate-600 font-semibold">Services</Link>
                        <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="block text-slate-600 font-semibold">Contact</Link>
                        {session && (
                            <Link href={session.user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'} onClick={() => setIsMobileMenuOpen(false)} className="block text-emerald-600 font-semibold border-t pt-2">
                                Dashboard ({session.user.name})
                            </Link>
                        )}
                    </div>
                )}
            </nav>
        </>
    );
}
