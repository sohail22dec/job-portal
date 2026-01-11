import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        // Redirect based on user role
        if (user.role === 'recruiter') {
            navigate('/recruiter-dashboard');
        } else if (user.role === 'job_seeker') {
            navigate('/job-seeker-dashboard');
        }
    }, [user, navigate]);

    // Show loading while redirecting
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading your dashboard...</p>
            </div>
        </div>
    );
};

export default Dashboard;
