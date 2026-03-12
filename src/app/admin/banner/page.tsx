'use client';

import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';

type Banner = {
    id: string;
    heading: string;
    subtext: string;
    btnText: string;
    btnHref: string;
    image: string;
};

export default function AdminBannerPage() {
    const [form, setForm] = useState<Partial<Banner>>({
        heading: '',
        subtext: '',
        btnText: '',
        btnHref: '/shop',
        image: '/delivery-banner.png',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        fetch('/api/admin/banner')
            .then(r => r.json())
            .then(data => { setForm(data); setLoading(false); });
    }, []);

    const handleSave = async () => {
        setSaving(true);
        await fetch('/api/admin/banner', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="max-w-2xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Promo Banner</h1>
                <p className="text-gray-500 text-sm mt-1">Edit the homepage "Fast Delivery" promotional section.</p>
            </div>

            {loading ? (
                <div className="p-10 text-center text-gray-400">Loading...</div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
                    <div>
                        <label className="text-sm font-semibold text-slate-700 block mb-1">Heading</label>
                        <input
                            className="w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                            value={form.heading}
                            onChange={e => setForm({ ...form, heading: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-slate-700 block mb-1">Sub-text</label>
                        <textarea
                            rows={3}
                            className="w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 resize-none"
                            value={form.subtext}
                            onChange={e => setForm({ ...form, subtext: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-semibold text-slate-700 block mb-1">Button Text</label>
                            <input
                                className="w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                                value={form.btnText}
                                onChange={e => setForm({ ...form, btnText: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-700 block mb-1">Button Link</label>
                            <input
                                className="w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                                value={form.btnHref}
                                onChange={e => setForm({ ...form, btnHref: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-slate-700 block mb-1">Image URL or Path</label>
                        <input
                            className="w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                            placeholder="/delivery-banner.png or https://..."
                            value={form.image}
                            onChange={e => setForm({ ...form, image: e.target.value })}
                        />
                        {form.image && (
                            <div className="mt-3 relative h-36 rounded-xl overflow-hidden border border-gray-200">
                                <img src={form.image} alt="preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all ${saved ? 'bg-green-500' : 'bg-emerald-600 hover:bg-emerald-700'} disabled:opacity-50`}
                    >
                        <Check className="h-4 w-4" />
                        {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Banner'}
                    </button>
                </div>
            )}
        </div>
    );
}
