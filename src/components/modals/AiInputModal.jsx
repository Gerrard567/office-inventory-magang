import React, { useState } from 'react';
import { X, Sparkles, ArrowRight, Check, Loader2 } from 'lucide-react';
import { parseInventoryInput } from '../../services/gemini';

const AiInputModal = ({ isOpen, onClose, onAddItems }) => {
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleProcess = async () => {
        if (!input.trim()) return;

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const data = await parseInventoryInput(input);
            setResult(data);
        } catch (err) {
            setError('Gagal memproses input. Format tidak dikenali.');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        if (result) {
            onAddItems(result);
            handleClose();
        }
    };

    const handleClose = () => {
        setInput('');
        setResult(null);
        setError(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="bg-gradient-to-r from-primary to-red-800 p-6 text-white flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles size={24} className="text-yellow-300" />
                            <h2 className="text-xl font-bold">AI Input Assistant</h2>
                        </div>
                        <p className="text-red-100 text-sm">
                            Deskripsikan barang yang ingin ditambahkan, AI akan mengisi detailnya otomatis.
                        </p>
                    </div>
                    <button onClick={handleClose} className="text-red-200 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Deskripsi Barang
                        </label>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Contoh: Saya baru tambahkan 50 box pulpen standard untuk stok ATK, minimal stok harus ada 5 box."
                            className="w-full h-32 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all resize-none"
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}

                    {result && (
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 animate-in slide-in-from-top-2">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Preview Hasil</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-slate-400 block text-xs">Nama</span>
                                    <span className="font-medium text-slate-800">{result.name}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 block text-xs">Kategori</span>
                                    <span className="font-medium text-slate-800">{result.category}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 block text-xs">Jumlah</span>
                                    <span className="font-medium text-slate-800">{result.quantity} {result.unit}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 block text-xs">Min. Stok</span>
                                    <span className="font-medium text-slate-800">{result.minStock}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                        {!result ? (
                            <button
                                onClick={handleProcess}
                                disabled={loading || !input.trim()}
                                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-medium transition-all shadow-lg shadow-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                                Proses dengan AI
                            </button>
                        ) : (
                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={() => setResult(null)}
                                    className="flex-1 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors"
                                >
                                    Ulangi
                                </button>
                                <button
                                    onClick={handleAdd}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-green-200"
                                >
                                    <Check size={18} />
                                    Tambahkan
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AiInputModal;
