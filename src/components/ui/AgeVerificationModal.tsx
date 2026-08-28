'use client';

import { useAgeStore } from '@/store/useAgeStore';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export default function AgeVerificationModal() {
    const { isModalOpen, verifyAge, declineAge } = useAgeStore();

    if (!isModalOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl relative overflow-hidden">
                {/* Decorative background shape */}
                <div className="absolute top-0 left-0 w-full h-32 bg-red-50 -z-10 rounded-t-3xl border-b border-red-100"></div>
                
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center shadow-inner border-4 border-white">
                        <span className="text-3xl font-black">18+</span>
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-black text-gray-900 mb-3">Age Verification Required</h2>
                    <p className="text-gray-500 font-medium leading-relaxed">
                        You are about to access products that are restricted by age. Under UK law, you must be <strong>18 years or older</strong> to purchase alcoholic beverages and tobacco products.
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={verifyAge}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                    >
                        <ShieldCheck className="w-5 h-5" />
                        Yes, I am 18 or older
                    </button>
                    <button
                        onClick={declineAge}
                        className="w-full bg-white border-2 border-gray-200 hover:border-red-200 hover:bg-red-50 text-gray-700 hover:text-red-700 font-bold py-4 px-6 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <AlertTriangle className="w-5 h-5" />
                        No, I am under 18
                    </button>
                </div>

                <p className="text-center text-xs text-gray-400 mt-6 font-medium">
                    By clicking "Yes", you confirm that you meet the legal age requirements to view and purchase these products.
                </p>
            </div>
        </div>
    );
}

