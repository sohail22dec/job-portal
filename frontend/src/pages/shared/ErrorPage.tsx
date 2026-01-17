import { useRouteError, Link } from 'react-router';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';

const ErrorPage = () => {
    const error = useRouteError() as any;

    // Determine error details
    const statusCode = error?.status || 500;
    const statusText = error?.statusText || 'Error';
    const errorMessage = error?.data?.message || error?.message || 'Something unexpected happened';

    // Get user-friendly title based on status code
    const getErrorTitle = (code: number) => {
        switch (code) {
            case 404:
                return 'Page Not Found';
            case 403:
                return 'Access Denied';
            case 401:
                return 'Unauthorized';
            case 500:
                return 'Server Error';
            case 503:
                return 'Service Unavailable';
            default:
                return 'Oops! Something Went Wrong';
        }
    };

    // Get user-friendly description
    const getErrorDescription = (code: number) => {
        switch (code) {
            case 404:
                return "The page you're looking for doesn't exist or has been moved.";
            case 403:
                return "You don't have permission to access this resource.";
            case 401:
                return "You need to be logged in to access this page.";
            case 500:
                return "Our server encountered an error. Please try again later.";
            case 503:
                return "The service is temporarily unavailable. We're working on it!";
            default:
                return "We encountered an unexpected error. Please try again.";
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
            <div className="max-w-2xl w-full">
                {/* Error Card */}
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                    {/* Header with Status Code */}
                    <div className="bg-gradient-to-r from-red-500 to-red-600 px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                                    <AlertCircle className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <div className="text-white/80 text-sm font-medium">Error {statusCode}</div>
                                    <h1 className="text-2xl font-bold text-white">{getErrorTitle(statusCode)}</h1>
                                </div>
                            </div>
                            <div className="text-6xl font-bold text-white/20">
                                {statusCode}
                            </div>
                        </div>
                    </div>

                    {/* Error Details */}
                    <div className="p-8">
                        <div className="space-y-6">
                            {/* Description */}
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-2">What happened?</h2>
                                <p className="text-gray-600">
                                    {getErrorDescription(statusCode)}
                                </p>
                            </div>

                            {/* Technical Details */}
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <h3 className="text-sm font-semibold text-gray-700 mb-2">Technical Details</h3>
                                <div className="space-y-1 text-sm">
                                    <div className="flex items-start gap-2">
                                        <span className="text-gray-500 min-w-[80px]">Status:</span>
                                        <span className="text-gray-900 font-mono">{statusCode} - {statusText}</span>
                                    </div>
                                    {errorMessage && (
                                        <div className="flex items-start gap-2">
                                            <span className="text-gray-500 min-w-[80px]">Message:</span>
                                            <span className="text-gray-900">{errorMessage}</span>
                                        </div>
                                    )}
                                    {error?.data && (
                                        <div className="flex items-start gap-2">
                                            <span className="text-gray-500 min-w-[80px]">Path:</span>
                                            <span className="text-gray-900 font-mono">{window.location.pathname}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => window.history.back()}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                    Go Back
                                </button>
                                <Link
                                    to="/"
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-300 transition-all hover:-translate-y-0.5"
                                >
                                    <Home className="w-5 h-5" />
                                    Back to Home
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Help Text */}
                <div className="text-center mt-6">
                    <p className="text-sm text-gray-600">
                        Need help? <a href="mailto:support@jobportal.com" className="text-blue-600 hover:text-blue-700 font-medium">Contact Support</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
