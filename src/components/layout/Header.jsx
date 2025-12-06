import React from 'react';
import { LayoutGrid, Box, AlertTriangle, LogOut } from 'lucide-react';

import logo from '../../assets/pdam_logo.png';

const Header = ({ totalItems, lowStockCount, onLogout }) => {
    return (
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
                <img src={logo} alt="PDAM Manado" className="w-12 h-12 object-contain hover:scale-105 transition-transform" />
                <div>
                    <h1 className="text-xl font-bold text-slate-800">OfficeMonitor</h1>
                    <p className="text-sm text-slate-500">Sistem Manajemen Inventaris</p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full shadow-sm">
                    <Box size={18} className="text-primary" />
                    <span className="text-sm font-medium text-slate-600">Total: {totalItems}</span>
                </div>

                {lowStockCount > 0 && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-100 rounded-full shadow-sm">
                        <AlertTriangle size={18} className="text-red-500" />
                        <span className="text-sm font-medium text-red-600">Stok Menipis: {lowStockCount}</span>
                    </div>
                )}

                <button
                    onClick={onLogout}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-2"
                    title="Keluar"
                >
                    <LogOut size={20} />
                </button>
            </div>
        </header>
    );
};

export default Header;
