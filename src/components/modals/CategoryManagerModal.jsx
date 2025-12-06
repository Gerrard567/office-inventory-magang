import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

const CategoryManagerModal = ({ isOpen, onClose, categories = [], onAddCategory, onDeleteCategory }) => {
    const [newCategory, setNewCategory] = useState('');

    if (!isOpen) return null;

    const handleAdd = (e) => {
        e.preventDefault();
        if (newCategory.trim()) {
            onAddCategory(newCategory.trim());
            setNewCategory('');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 bg-gradient-to-r from-primary to-red-800 text-white">
                    <h2 className="text-xl font-bold">Kelola Kategori</h2>
                    <button onClick={onClose} className="text-red-100 hover:text-white transition-colors bg-white/10 p-1 rounded-full hover:bg-white/20">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <form onSubmit={handleAdd} className="flex gap-2 mb-6">
                        <input
                            type="text"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder="Nama kategori baru..."
                            className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                        <button
                            type="submit"
                            disabled={!newCategory.trim()}
                            className="px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Plus size={20} />
                        </button>
                    </form>

                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {categories.map((cat) => (
                            <div key={cat} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <span className="font-medium text-slate-700">{cat}</span>
                                <button
                                    onClick={() => onDeleteCategory(cat)}
                                    className="text-slate-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                        {categories.length === 0 && (
                            <p className="text-center text-slate-400 text-sm">Belum ada kategori khusus.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryManagerModal;
