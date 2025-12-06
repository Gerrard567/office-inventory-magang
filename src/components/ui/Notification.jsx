import React, { useEffect, useState } from 'react';
import { Check, X, Info, AlertTriangle } from 'lucide-react';

const Notification = ({ message, type = 'success', onClose, duration = 3000 }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for exit animation
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    if (!isVisible) return null;

    const styles = {
        success: {
            bg: 'bg-green-50',
            border: 'border-green-200',
            text: 'text-green-800',
            icon: <Check className="w-5 h-5 text-green-600" />,
            bar: 'bg-green-500'
        },
        error: {
            bg: 'bg-red-50',
            border: 'border-red-200',
            text: 'text-red-800',
            icon: <X className="w-5 h-5 text-red-600" />,
            bar: 'bg-red-600'
        },
        info: {
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            text: 'text-blue-800',
            icon: <Info className="w-5 h-5 text-blue-600" />,
            bar: 'bg-blue-500'
        },
        warning: {
            bg: 'bg-yellow-50',
            border: 'border-yellow-200',
            text: 'text-yellow-800',
            icon: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
            bar: 'bg-yellow-500'
        }
    };

    const currentStyle = styles[type] || styles.info;

    return (
        <div className={`fixed top-6 right-6 z-[100] flex flex-col min-w-[320px] max-w-sm rounded-xl overflow-hidden shadow-2xl border ${currentStyle.bg} ${currentStyle.border} animate-in slide-in-from-right duration-300`}>
            {/* Progress Bar */}
            <div className={`h-1.5 w-full ${currentStyle.bar} animate-pulse`} />

            <div className="p-4 flex items-start gap-4">
                <div className={`p-2 rounded-full bg-white shadow-sm ring-1 ring-inset ${currentStyle.border}`}>
                    {currentStyle.icon}
                </div>
                <div className="flex-1 pt-0.5">
                    <h3 className={`font-bold text-sm ${currentStyle.text} uppercase tracking-wide mb-1`}>
                        {type === 'success' ? 'Berhasil' : type === 'error' ? 'Gagal' : 'Info'}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed font-medium">
                        {message}
                    </p>
                </div>
                <button
                    onClick={() => setIsVisible(false)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};

export default Notification;
