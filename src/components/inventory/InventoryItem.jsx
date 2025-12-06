import React from 'react';
import { Pencil, Trash2, Plus, Minus, Package, FileText, Coffee, Monitor, Briefcase, Archive } from 'lucide-react';

const getCategoryIcon = (category) => {
    switch (category) {
        case 'ATK': return <FileText size={20} className="text-slate-500" />;
        case 'Pantry': return <Coffee size={20} className="text-orange-500" />;
        case 'Elektronik': return <Monitor size={20} className="text-blue-500" />;
        case 'Aset': return <Briefcase size={20} className="text-purple-500" />;
        default: return <Package size={20} className="text-slate-500" />;
    }
};

const getCategoryColor = (category) => {
    switch (category) {
        case 'ATK': return 'bg-slate-100 text-slate-600';
        case 'Pantry': return 'bg-orange-50 text-orange-600';
        case 'Elektronik': return 'bg-blue-50 text-blue-600';
        case 'Aset': return 'bg-purple-50 text-purple-600';
        default: return 'bg-slate-100 text-slate-600';
    }
};

const InventoryItem = ({ item, onEdit, onDelete, onUpdateStock }) => {
    const isLowStock = item.quantity <= item.minStock;

    return (
        <tr className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
            <td className="p-4">
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${getCategoryColor(item.category)} bg-opacity-50`}>
                        {getCategoryIcon(item.category)}
                    </div>
                    <div>
                        <h3 className="font-medium text-slate-900">{item.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${getCategoryColor(item.category)}`}>
                                {item.category}
                            </span>
                            <span className="text-xs text-slate-400">Min: {item.minStock} {item.unit}</span>
                        </div>
                    </div>
                </div>
            </td>

            <td className="p-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => onUpdateStock(item.id, -1)}
                        className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-primary hover:text-primary transition-colors"
                        disabled={item.quantity <= 0}
                    >
                        <Minus size={14} />
                    </button>

                    <div className="text-center min-w-[3rem]">
                        <div className="font-bold text-slate-900">{item.quantity}</div>
                        <div className="text-[10px] uppercase text-slate-400 font-medium">{item.unit}</div>
                    </div>

                    <button
                        onClick={() => onUpdateStock(item.id, 1)}
                        className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-primary hover:text-primary transition-colors"
                    >
                        <Plus size={14} />
                    </button>
                </div>
            </td>

            <td className="p-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${isLowStock
                        ? 'bg-red-50 text-red-600 border-red-100'
                        : 'bg-green-50 text-green-600 border-green-100'
                    }`}>
                    {isLowStock ? '⚠ Stok Menipis' : '✓ Aman'}
                </span>
            </td>

            <td className="p-4">
                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(item)}
                        className="p-2 text-slate-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors"
                    >
                        <Pencil size={16} />
                    </button>
                    <button
                        onClick={() => onDelete(item.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default InventoryItem;
