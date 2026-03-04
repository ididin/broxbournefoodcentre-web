'use client';

import { useState, useEffect } from 'react';
import { UploadCloud, Trash2, Copy, Check } from 'lucide-react';
import Image from 'next/image';

export default function AdminMediaPage() {
    const [images, setImages] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        const res = await fetch('/api/admin/media');
        const data = await res.json();
        setImages(data);
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }

        await fetch('/api/admin/media', {
            method: 'POST',
            body: formData,
        });

        setIsUploading(false);
        e.target.value = '';
        fetchImages();
    };

    const handleDelete = async (url: string) => {
        if (!confirm('Delete this image?')) return;
        await fetch('/api/admin/media', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
        });
        fetchImages();
    };

    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url);
        setCopiedUrl(url);
        setTimeout(() => setCopiedUrl(null), 2000);
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
                    <p className="text-gray-500 text-sm mt-1">Upload and manage product images.</p>
                </div>

                <div className="relative">
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleUpload}
                        disabled={isUploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <button disabled={isUploading} className="flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-lg shadow-sm font-medium hover:bg-gray-900 disabled:bg-gray-400 transition-colors">
                        <UploadCloud className="h-5 w-5" /> {isUploading ? 'Uploading...' : 'Upload Images'}
                    </button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-[400px]">
                {images.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                        <UploadCloud className="h-12 w-12 mb-4 text-gray-300" />
                        <p>No images found. Upload some to get started!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {images.map((url) => (
                            <div key={url} className="group relative border rounded-lg overflow-hidden bg-gray-50 aspect-square flex flex-col">
                                <div className="flex-1 relative w-full">
                                    <Image src={url} alt="Uploaded media" fill className="object-cover" />
                                </div>
                                <div className="p-2 bg-white border-t flex justify-between items-center z-10">
                                    <button
                                        onClick={() => copyToClipboard(url)}
                                        className="text-gray-500 hover:text-black transition-colors"
                                        title="Copy URL"
                                    >
                                        {copiedUrl === url ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(url)}
                                        className="text-gray-500 hover:text-red-600 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
