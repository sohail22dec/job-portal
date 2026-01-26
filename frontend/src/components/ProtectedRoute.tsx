import { Navigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

type ProtectedRouteProps = {
    children: React.ReactNode;
    requiredRole?: 'job_seeker' | 'recruiter';
};

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
    const { user, loading } = useAuth();

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Check role if specified
    if (requiredRole && user.role !== requiredRole) {
        // Redirect to appropriate dashboard based on actual role
        const dashboardPath = user.role === 'recruiter' ? '/recruiter-dashboard' : '/job-seeker-dashboard';
        return <Navigate to={dashboardPath} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
