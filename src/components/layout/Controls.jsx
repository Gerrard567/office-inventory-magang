import React from 'react';
import { Search, Sparkles, Plus, Settings } from 'lucide-react';

const Controls = ({
    categories,
    currentCategory,
    setCategory,
    searchQuery,
    setSearchQuery,
    onOpenAiModal,
    onOpenAddModal,
    onOpenCategoryModal
}) => {
    return (
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            {/* Categories */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 max-w-full">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentCategory === cat
                                ? 'bg-primary text-white shadow-md shadow-blue-200'
                                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
                <button
                    onClick={onOpenCategoryModal}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Kelola Kategori"
                >
                    <Settings size={18} />
                </button>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Cari barang..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                </div>

                <button
                    onClick={onOpenAiModal}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors shadow-md shadow-purple-200 whitespace-nowrap"
                >
                    <Sparkles size={18} />
                    AI Input
                </button>

                <button
                    onClick={onOpenAddModal}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-md shadow-blue-200 whitespace-nowrap"
                >
                    <Plus size={18} />
                    Barang Baru
                </button>
            </div>
        </div>
    );
};

export default Controls;
