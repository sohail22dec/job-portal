import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Mail, Phone, FileText, CheckCircle, XCircle, Eye, Loader2 } from 'lucide-react';
import applicationApi from '../api/applicationApi';
import { jobApi } from '../api/jobApi';

type Application = {
    _id: string;
    applicant: {
        _id: string;
        fullname: string;
        email: string;
        phoneNumber?: string;
    };
    status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
    coverLetter?: string;
    resume?: string;
    createdAt: string;
};

type Job = {
    _id: string;
    title: string;
    company?: string;
};

const Applicants = () => {
    const { jobId } = useParams<{ jobId: string }>();
    const navigate = useNavigate();
    const [applications, setApplications] = useState<Application[]>([]);
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    useEffect(() => {
        if (jobId) {
            fetchJobAndApplicants();
        }
    }, [jobId]);

    const fetchJobAndApplicants = async () => {
        if (!jobId) return;

        try {
            setLoading(true);

            // Fetch job details
            const jobData = await jobApi.getJobById(jobId);
            if (jobData.success) {
                setJob(jobData.job);
            }

            // Fetch applicants
            const appData = await applicationApi.getJobApplicants(jobId);
            if (appData.success) {
                setApplications(appData.applications);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (applicationId: string, newStatus: string) => {
        try {
            setUpdatingId(applicationId);
            const data = await applicationApi.updateApplicationStatus(applicationId, newStatus);
            if (data.success) {
                // Update local state
                setApplications(prev =>
                    prev.map(app =>
                        app._id === applicationId
                            ? { ...app, status: newStatus as Application['status'] }
                            : app
                    )
                );
            }
        } catch (err: any) {
            alert(err.message || 'Failed to update status');
        } finally {
            setUpdatingId(null);
        }
    };

    const getStatusColor = (status: string) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            reviewing: 'bg-blue-100 text-blue-700 border-blue-200',
            accepted: 'bg-green-100 text-green-700 border-green-200',
            rejected: 'bg-red-100 text-red-700 border-red-200'
        };
        return colors[status as keyof typeof colors] || '';
    };

    const getStatusIcon = (status: string) => {
        const icons = {
            pending: <Eye className="w-4 h-4" />,
            reviewing: <Eye className="w-4 h-4" />,
            accepted: <CheckCircle className="w-4 h-4" />,
            rejected: <XCircle className="w-4 h-4" />
        };
        return icons[status as keyof typeof icons];
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => navigate('/recruiter-dashboard')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/recruiter-dashboard')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Dashboard
                </button>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Applicants</h1>
                    <p className="text-gray-600 mt-2">{job?.title}</p>
                </div>

                {/* Applicants List */}
                {applications.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-100">
                        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications yet</h3>
                        <p className="text-gray-600">Check back later for new applicants</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {applications.map((app) => (
                            <div key={app._id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition">
                                {/* Header */}
                                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">{app.applicant.fullname}</h3>
                                            <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                                                <a href={`mailto:${app.applicant.email}`} className="flex items-center gap-1 hover:text-blue-600">
                                                    <Mail className="w-4 h-4" />
                                                    {app.applicant.email}
                                                </a>
                                                {app.applicant.phoneNumber && (
                                                    <div className="flex items-center gap-1">
                                                        <Phone className="w-4 h-4" />
                                                        {app.applicant.phoneNumber}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <span className={`px-4 py-2 rounded-full text-sm font-semibold border flex items-center gap-2 ${getStatusColor(app.status)}`}>
                                            {getStatusIcon(app.status)}
                                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    {/* Cover Letter */}
                                    {app.coverLetter && (
                                        <div className="mb-6">
                                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                                <FileText className="w-5 h-5 text-blue-600" />
                                                Cover Letter
                                            </h4>
                                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                                    {app.coverLetter}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Resume */}
                                    {app.resume && (
                                        <div className="mb-6">
                                            <h4 className="font-semibold text-gray-900 mb-3">Resume</h4>
                                            <a
                                                href={app.resume}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition font-medium"
                                            >
                                                <FileText className="w-4 h-4" />
                                                View Resume →
                                            </a>
                                        </div>
                                    )}

                                    <div className="text-sm text-gray-500 mb-6">
                                        Applied on {new Date(app.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 pt-6 border-t border-gray-200">
                                        {app.status !== 'reviewing' && (
                                            <button
                                                onClick={() => updateStatus(app._id, 'reviewing')}
                                                disabled={updatingId === app._id}
                                                className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                {updatingId === app._id ? (
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                ) : (
                                                    <Eye className="w-5 h-5" />
                                                )}
                                                Mark as Reviewing
                                            </button>
                                        )}
                                        {app.status !== 'accepted' && (
                                            <button
                                                onClick={() => updateStatus(app._id, 'accepted')}
                                                disabled={updatingId === app._id}
                                                className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                {updatingId === app._id ? (
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                ) : (
                                                    <CheckCircle className="w-5 h-5" />
                                                )}
                                                Accept
                                            </button>
                                        )}
                                        {app.status !== 'rejected' && (
                                            <button
                                                onClick={() => updateStatus(app._id, 'rejected')}
                                                disabled={updatingId === app._id}
                                                className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                {updatingId === app._id ? (
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                ) : (
                                                    <XCircle className="w-5 h-5" />
                                                )}
                                                Reject
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Applicants;
