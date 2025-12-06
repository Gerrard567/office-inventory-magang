import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, isLoading }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
                {/* Header Warning */}
                <div className="bg-red-50 p-6 flex flex-col items-center justify-center text-center border-b border-red-100">
                    <div className="bg-red-100 p-3 rounded-full mb-4">
                        <AlertTriangle size={32} className="text-red-600" />
                    </div>
                    <h3 className="text-xl font-bold text-red-900">{title}</h3>
                </div>

                {/* Content */}
                <div className="p-6 text-center">
                    <p className="text-slate-600 mb-6 font-medium">
                        {message}
                    </p>

                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors"
                            disabled={isLoading}
                        >
                            Batal
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Menghapus...' : 'Ya, Hapus'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
