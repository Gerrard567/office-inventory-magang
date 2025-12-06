import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = () => {
    return (
        <div className="flex justify-center items-center p-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
    );
};

export default LoadingSpinner;
