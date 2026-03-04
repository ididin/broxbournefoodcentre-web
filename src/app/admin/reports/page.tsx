'use client';

import { useState } from 'react';
import { FileBarChart, Filter } from 'lucide-react';

export default function AdminReportsPage() {
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState<any>(null);
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        product: '',
        brand: '',
        category: '',
    });

    const generateReport = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/admin/reports', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(filters)
            });
            const data = await res.json();
            setReportData(data);
        } catch (error) {
            console.error('Failed to load report');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
                <p className="text-gray-500 text-sm mt-1">Generate dynamic sales reports across specific dates, products, brands, or categories.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Filter className="h-5 w-5" /> Report Filters</h2>

                <form onSubmit={generateReport} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium mb-1">Start Date</label>
                        <input type="date" className="w-full px-3 py-2 border rounded-lg text-sm" value={filters.startDate} onChange={e => setFilters({ ...filters, startDate: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">End Date</label>
                        <input type="date" className="w-full px-3 py-2 border rounded-lg text-sm" value={filters.endDate} onChange={e => setFilters({ ...filters, endDate: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Product Name</label>
                        <input type="text" placeholder="Search product..." className="w-full px-3 py-2 border rounded-lg text-sm" value={filters.product} onChange={e => setFilters({ ...filters, product: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Brand Name</label>
                        <input type="text" placeholder="e.g. Nestle" className="w-full px-3 py-2 border rounded-lg text-sm" value={filters.brand} onChange={e => setFilters({ ...filters, brand: e.target.value })} />
                    </div>
                    <div>
                        <button type="submit" disabled={loading} className="w-full bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-900 disabled:bg-gray-400">
                            {loading ? 'Generating...' : 'Generate Report'}
                        </button>
                    </div>
                </form>
            </div>

            {reportData && reportData.summary && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-xl flex items-center justify-between">
                            <div>
                                <p className="text-sm text-emerald-800 font-medium">Filtered Revenue</p>
                                <p className="text-3xl font-black text-emerald-900">£{reportData.summary.totalRevenue.toFixed(2)}</p>
                            </div>
                            <FileBarChart className="h-10 w-10 text-emerald-200" />
                        </div>
                        <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl flex items-center justify-between">
                            <div>
                                <p className="text-sm text-blue-800 font-medium">Items Sold</p>
                                <p className="text-3xl font-black text-blue-900">{reportData.summary.totalItemsSold}</p>
                            </div>
                            <FileBarChart className="h-10 w-10 text-blue-200" />
                        </div>
                        <div className="bg-purple-50 border border-purple-100 p-6 rounded-xl flex items-center justify-between">
                            <div>
                                <p className="text-sm text-purple-800 font-medium">Orders Involved</p>
                                <p className="text-3xl font-black text-purple-900">{reportData.summary.totalOrders}</p>
                            </div>
                            <FileBarChart className="h-10 w-10 text-purple-200" />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="font-bold text-gray-800">Top Selling Products in this Filter</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
                                    <tr>
                                        <th className="px-6 py-3 font-semibold">Product Name</th>
                                        <th className="px-6 py-3 font-semibold text-right">Quantity Sold</th>
                                        <th className="px-6 py-3 font-semibold text-right">Revenue Generated</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {reportData.topProducts.map((p: any, idx: number) => (
                                        <tr key={idx} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">{p.name}</td>
                                            <td className="px-6 py-4 text-right font-bold text-gray-600">{p.quantity}</td>
                                            <td className="px-6 py-4 text-right font-bold text-emerald-600">£{p.revenue.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                    {reportData.topProducts.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-8 text-center text-gray-500">No products match this filter criteria.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
