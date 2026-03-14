'use client';

import { useState } from 'react';
import { Download, Upload, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';

type StatusResult = { success?: boolean; message?: string } | null;

export default function AdminExcelPage() {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<StatusResult>(null);

    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteStatus, setDeleteStatus] = useState<StatusResult>(null);

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
            e.target.value = '';
        }
    };

    const handleBulkDelete = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const confirmed = confirm(
            `⚠️ DIKKAT: Bu işlem Excel dosyasındaki tüm ürünleri kalıcı olarak silecektir. Devam etmek istiyor musunuz?`
        );
        if (!confirmed) {
            e.target.value = '';
            return;
        }

        setIsDeleting(true);
        setDeleteStatus(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/admin/excel/delete', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();
            if (res.ok) {
                setDeleteStatus({
                    success: true,
                    message: `${data.deletedCount} product(s) deleted successfully out of ${data.rowsInFile} rows in the file.`
                });
            } else {
                setDeleteStatus({
                    success: false,
                    message: data.error || 'Failed to process delete file.'
                });
            }
        } catch (error) {
            setDeleteStatus({
                success: false,
                message: 'Network error while deleting products.'
            });
        } finally {
            setIsDeleting(false);
            e.target.value = '';
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Excel Operations</h1>
                <p className="text-gray-500 text-sm mt-1">Export products to Excel, make bulk edits, import them back, or bulk delete by uploading an ID list.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Export */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                        <Download className="h-6 w-6" />
                    </div>
                    <h2 className="text-lg font-bold mb-2">Export Products</h2>
                    <p className="text-gray-600 text-sm mb-6">
                        Download the current database of products into an Excel file. You can safely edit prices, stock status, names, barcodes, and store orders using this file.
                    </p>
                    <button onClick={handleDownload} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors">
                        Download Excel (.xlsx)
                    </button>
                </div>

                {/* Import */}
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

                {/* Bulk Delete */}
                <div className="bg-white p-6 rounded-xl border border-red-200 shadow-sm relative overflow-hidden md:col-span-2">
                    <div className="h-12 w-12 bg-red-50 text-red-600 rounded-lg flex items-center justify-center mb-4">
                        <Trash2 className="h-6 w-6" />
                    </div>
                    <h2 className="text-lg font-bold mb-1 text-red-700">Bulk Delete Products</h2>
                    <p className="text-gray-600 text-sm mb-4">
                        Upload an Excel file containing an <strong>id</strong> column (or <strong>barcode</strong> column) of products to permanently delete. You can use the exported file and simply remove rows you want to keep, leaving only the rows you want to delete.
                    </p>

                    <div className="relative max-w-sm">
                        <input
                            type="file"
                            accept=".xlsx, .xls"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            onChange={handleBulkDelete}
                            disabled={isDeleting}
                        />
                        <button disabled={isDeleting} className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:bg-gray-300 flex justify-center items-center gap-2">
                            <Trash2 className="h-4 w-4" />
                            {isDeleting ? 'Deleting...' : 'Upload & Delete Products'}
                        </button>
                    </div>

                    {deleteStatus && (
                        <div className={`mt-4 p-3 rounded-lg text-sm flex items-start gap-2 max-w-sm ${deleteStatus.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                            {deleteStatus.success ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
                            <span>{deleteStatus.message}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-800">
                <h3 className="font-bold flex items-center gap-2 mb-2"><AlertCircle className="h-5 w-5" /> Important Notes</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Do not change the <strong>id</strong> column for existing products.</li>
                    <li>For <strong>stockOut</strong>, use <code>YES</code> or <code>NO</code>.</li>
                    <li><strong>Bulk Delete</strong> is permanent and cannot be undone. Double-check your file before uploading.</li>
                    <li><strong>categoryName</strong> and <strong>categoryId</strong> should perfectly match existing ones if you are linking products properly.</li>
                    <li>The system processes thousands of rows, but extremely large files (10MB+) might timeout depending on the server connection.</li>
                </ul>
            </div>
        </div>
    );
}
