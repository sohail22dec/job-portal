import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import { useToast } from '../hooks/useToast';

const Toast = () => {
    const { toasts, removeToast } = useToast();

    if (toasts.length === 0) return null;

    // Only show the most recent toast
    const currentToast = toasts[toasts.length - 1];

    const getIcon = (type: string) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-6 h-6" />;
            case 'error':
                return <XCircle className="w-6 h-6" />;
            case 'warning':
                return <AlertTriangle className="w-6 h-6" />;
            default:
                return <Info className="w-6 h-6" />;
        }
    };

    const getStyles = (type: string) => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-300 text-green-900';
            case 'error':
                return 'bg-red-50 border-red-300 text-red-900';
            case 'warning':
                return 'bg-yellow-50 border-yellow-300 text-yellow-900';
            default:
                return 'bg-blue-50 border-blue-300 text-blue-900';
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/20 z-40 animate-fade-in" />

            {/* Centered Alert Box */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div
                    className={`pointer-events-auto w-full max-w-md rounded-xl border-2 shadow-2xl p-6 animate-scale-in ${getStyles(currentToast.type)}`}
                >
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                            {getIcon(currentToast.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-base font-semibold leading-relaxed">
                                {currentToast.message}
                            </p>
                        </div>
                        <button
                            onClick={() => removeToast(currentToast.id)}
                            className="flex-shrink-0 hover:opacity-70 transition-opacity"
                            aria-label="Close"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Toast;
