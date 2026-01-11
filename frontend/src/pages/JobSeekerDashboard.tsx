import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Briefcase, Clock, CheckCircle, XCircle, Eye, Loader2, FileText } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import applicationApi from '../api/applicationApi';

type Application = {
    _id: string;
    job: {
        _id: string;
        title: string;
        company?: string;
        location: string;
        salary: number;
        createdBy: {
            fullname: string;
            email: string;
        };
    };
    status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
    coverLetter?: string;
    createdAt: string;
    updatedAt: string;
};

const JobSeekerDashboard = () => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const data = await applicationApi.getMyApplications();
            if (data.success) {
                setApplications(data.applications);
            }
        } catch (error) {
            console.error('Failed to fetch applications:', error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate stats
    const totalApplications = applications.length;
    const pendingApps = applications.filter(app => app.status === 'pending').length;
    const reviewingApps = applications.filter(app => app.status === 'reviewing').length;
    const acceptedApps = applications.filter(app => app.status === 'accepted').length;

    const getStatusBadge = (status: string) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            reviewing: 'bg-blue-100 text-blue-700 border-blue-200',
            accepted: 'bg-green-100 text-green-700 border-green-200',
            rejected: 'bg-red-100 text-red-700 border-red-200'
        };

        const icons = {
            pending: <Clock className="w-4 h-4" />,
            reviewing: <Eye className="w-4 h-4" />,
            accepted: <CheckCircle className="w-4 h-4" />,
            rejected: <XCircle className="w-4 h-4" />
        };

        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${styles[status as keyof typeof styles]}`}>
                {icons[status as keyof typeof icons]}
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Job Seeker Dashboard</h1>
                    <p className="text-gray-600 mt-2">Welcome back, {user?.fullname}! Track your job applications</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Total Applications</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{totalApplications}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <FileText className="w-8 h-8 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Pending</p>
                                <p className="text-3xl font-bold text-yellow-600 mt-2">{pendingApps}</p>
                            </div>
                            <div className="p-3 bg-yellow-100 rounded-lg">
                                <Clock className="w-8 h-8 text-yellow-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Under Review</p>
                                <p className="text-3xl font-bold text-blue-600 mt-2">{reviewingApps}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Eye className="w-8 h-8 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Accepted</p>
                                <p className="text-3xl font-bold text-green-600 mt-2">{acceptedApps}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Applications List */}
                <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900">My Applications</h2>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        </div>
                    ) : applications.length === 0 ? (
                        <div className="p-12 text-center">
                            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications yet</h3>
                            <p className="text-gray-600 mb-6">Start browsing jobs and apply to your dream role!</p>
                            <Link
                                to="/jobs"
                                className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                            >
                                Browse Jobs
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {applications.map((application) => (
                                <div key={application._id} className="p-6 hover:bg-gray-50 transition">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <Link
                                                    to={`/job/${application.job._id}`}
                                                    className="text-xl font-bold text-gray-900 hover:text-blue-600 transition"
                                                >
                                                    {application.job.title}
                                                </Link>
                                                {getStatusBadge(application.status)}
                                            </div>
                                            <p className="text-gray-600 mb-2">
                                                Company: {application.job.createdBy.fullname}
                                            </p>
                                            <div className="flex gap-4 text-sm text-gray-600">
                                                <span>📍 {application.job.location}</span>
                                                <span>💰 ₹{application.job.salary.toLocaleString()}/year</span>
                                                <span>📅 Applied {new Date(application.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobSeekerDashboard;
