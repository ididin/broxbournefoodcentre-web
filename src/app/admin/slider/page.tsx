'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical, ChevronUp, ChevronDown, Pencil, X, Check } from 'lucide-react';

type Slide = {
    id: string;
    image: string;
    title: string;
    subtitle: string;
    btnText: string;
    href: string;
    order: number;
    active: boolean;
};

const emptyForm = { image: '', title: '', subtitle: '', btnText: 'Shop Now', href: '/shop' };

export default function AdminSliderPage() {
    const [slides, setSlides] = useState<Slide[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);

    const fetchSlides = async () => {
        const res = await fetch('/api/admin/slides');
        const data = await res.json();
        setSlides(data);
        setLoading(false);
    };

    useEffect(() => { fetchSlides(); }, []);

    const handleSave = async () => {
        if (!form.image || !form.title) { alert('Image URL and Title are required.'); return; }
        setSaving(true);
        if (editId) {
            const slide = slides.find(s => s.id === editId)!;
            await fetch('/api/admin/slides', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...slide, ...form })
            });
        } else {
            await fetch('/api/admin/slides', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
        }
        setSaving(false);
        setShowForm(false);
        setEditId(null);
        setForm(emptyForm);
        fetchSlides();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this slide?')) return;
        await fetch('/api/admin/slides', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        fetchSlides();
    };

    const handleMove = async (index: number, direction: 'up' | 'down') => {
        const newSlides = [...slides];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        if (swapIndex < 0 || swapIndex >= newSlides.length) return;
        [newSlides[index], newSlides[swapIndex]] = [newSlides[swapIndex], newSlides[index]];
        setSlides(newSlides);
        await Promise.all(newSlides.map((s, i) =>
            fetch('/api/admin/slides', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...s, order: i })
            })
        ));
    };

    const handleEdit = (slide: Slide) => {
        setForm({ image: slide.image, title: slide.title, subtitle: slide.subtitle, btnText: slide.btnText, href: slide.href });
        setEditId(slide.id);
        setShowForm(true);
    };

    const handleToggleActive = async (slide: Slide) => {
        await fetch('/api/admin/slides', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...slide, active: !slide.active })
        });
        fetchSlides();
    };

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Slider Management</h1>
                    <p className="text-gray-500 text-sm mt-1">Add, edit, reorder or remove homepage slides.</p>
                </div>
                <button
                    onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); }}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition-colors"
                >
                    <Plus className="h-4 w-4" /> Add Slide
                </button>
            </div>

            {/* Add / Edit Form */}
            {showForm && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
                    <h2 className="font-bold text-lg">{editId ? 'Edit Slide' : 'New Slide'}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="text-sm font-semibold text-slate-700 block mb-1">Image URL *</label>
                            <input className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" placeholder="https://..." value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
                            {form.image && (
                                <div className="mt-2 relative h-28 rounded-lg overflow-hidden border border-gray-200">
                                    <img src={form.image} alt="preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-700 block mb-1">Title *</label>
                            <input className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" placeholder="Slide heading" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-700 block mb-1">Subtitle</label>
                            <input className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" placeholder="Optional subtitle text" value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })} />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-700 block mb-1">Button Text</label>
                            <input className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" value={form.btnText} onChange={e => setForm({ ...form, btnText: e.target.value })} />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-700 block mb-1">Button Link</label>
                            <input className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" placeholder="/shop" value={form.href} onChange={e => setForm({ ...form, href: e.target.value })} />
                        </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50">
                            <Check className="h-4 w-4" /> {saving ? 'Saving...' : 'Save Slide'}
                        </button>
                        <button onClick={() => { setShowForm(false); setEditId(null); }} className="flex items-center gap-2 border px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-gray-50 transition-colors">
                            <X className="h-4 w-4" /> Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Slide List */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-10 text-center text-gray-400">Loading slides...</div>
                ) : slides.length === 0 ? (
                    <div className="p-10 text-center text-gray-400">No slides yet. Add your first one!</div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b text-gray-600">
                            <tr>
                                <th className="px-4 py-3 text-left font-semibold w-10">Order</th>
                                <th className="px-4 py-3 text-left font-semibold">Preview</th>
                                <th className="px-4 py-3 text-left font-semibold">Title / Subtitle</th>
                                <th className="px-4 py-3 text-left font-semibold">Button</th>
                                <th className="px-4 py-3 text-left font-semibold">Active</th>
                                <th className="px-4 py-3 text-right font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {slides.map((slide, i) => (
                                <tr key={slide.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="flex flex-col gap-0.5">
                                            <button onClick={() => handleMove(i, 'up')} disabled={i === 0} className="p-0.5 text-gray-400 hover:text-black disabled:opacity-20">
                                                <ChevronUp className="h-4 w-4" />
                                            </button>
                                            <button onClick={() => handleMove(i, 'down')} disabled={i === slides.length - 1} className="p-0.5 text-gray-400 hover:text-black disabled:opacity-20">
                                                <ChevronDown className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="w-24 h-14 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                                            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="font-semibold text-slate-800 text-sm">{slide.title}</div>
                                        <div className="text-slate-400 text-xs mt-0.5">{slide.subtitle}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="font-medium text-slate-700">{slide.btnText}</span>
                                        <div className="text-xs text-slate-400">{slide.href}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => handleToggleActive(slide)}
                                            className={`px-3 py-1 rounded-full text-xs font-bold ${slide.active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}
                                        >
                                            {slide.active ? 'Active' : 'Hidden'}
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex gap-2 justify-end">
                                            <button onClick={() => handleEdit(slide)} className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button onClick={() => handleDelete(slide.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
