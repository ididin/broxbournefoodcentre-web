'use client';

import { useState } from 'react';
import { Download, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AdminExcelPage() {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<{ success?: boolean, message?: string } | null>(null);

    const handleDownload = () => {
        window.open('/api/admin/excel/export', '_blank');
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setUploadStatus(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/admin/excel/import', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();
            if (res.ok) {
                setUploadStatus({
                    success: true,
                    message: `Successfully processed! Updated: ${data.updatedCount}, Created: ${data.createdCount}`
                });
            } else {
                setUploadStatus({
                    success: false,
                    message: data.error || 'Failed to upload file'
                });
            }
        } catch (error) {
            setUploadStatus({
                success: false,
                message: 'Network error analyzing file.'
            });
        } finally {
            setIsUploading(false);
            e.target.value = ''; // Reset input
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Excel Operations</h1>
                <p className="text-gray-500 text-sm mt-1">Export products to Excel, make bulk edits, and import them back.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                        <Download className="h-6 w-6" />
                    </div>
                    <h2 className="text-lg font-bold mb-2">Export Products</h2>
                    <p className="text-gray-600 text-sm mb-6">
                        Download the current database of products into an Excel file. You can safely edit prices, stock status, names, and store orders using this file.
                    </p>
                    <button onClick={handleDownload} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors">
                        Download Excel (.xlsx)
                    </button>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
                    <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-4">
                        <Upload className="h-6 w-6" />
                    </div>
                    <h2 className="text-lg font-bold mb-2">Import & Update</h2>
                    <p className="text-gray-600 text-sm mb-6">
                        Upload your edited Excel file. Matching IDs will update existing products. Rows without an ID will be created as new products.
                    </p>

                    <div className="relative">
                        <input
                            type="file"
                            accept=".xlsx, .xls"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            onChange={handleUpload}
                            disabled={isUploading}
                        />
                        <button disabled={isUploading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:bg-gray-300 flex justify-center items-center">
                            {isUploading ? 'Processing...' : 'Upload Excel File'}
                        </button>
                    </div>

                    {uploadStatus && (
                        <div className={`mt-4 p-3 rounded-lg text-sm flex items-start gap-2 ${uploadStatus.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                            {uploadStatus.success ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
                            <span>{uploadStatus.message}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-800">
                <h3 className="font-bold flex items-center gap-2 mb-2"><AlertCircle className="h-5 w-5" /> Important Notes</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Do not change the <strong>id</strong> column for existing products.</li>
                    <li>For <strong>stockOut</strong>, use <code>YES</code> or <code>NO</code>.</li>
                    <li><strong>categoryName</strong> and <strong>categoryId</strong> should perfectly match existing ones if you are linking products properly.</li>
                    <li>The system processes thousands of rows, but extremely large files (10MB+) might timeout depending on the server connection.</li>
                </ul>
            </div>
        </div>
    );
}
