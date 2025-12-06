import React from 'react';
import InventoryItem from './InventoryItem';
import LoadingSpinner from '../ui/LoadingSpinner';
import { Inbox } from 'lucide-react';

const InventoryTable = ({ items, loading, onEdit, onDelete, onUpdateStock }) => {
    if (loading) {
        return <LoadingSpinner />;
    }

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 bg-white rounded-xl border border-slate-200 shadow-sm">
                <Inbox size={48} className="mb-4 opacity-50" />
                <p>Belum ada barang inventaris.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            <th className="p-4">Nama Barang & Kategori</th>
                            <th className="p-4">Stok</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {items.map((item) => (
                            <InventoryItem
                                key={item.id}
                                item={item}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onUpdateStock={onUpdateStock}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InventoryTable;
