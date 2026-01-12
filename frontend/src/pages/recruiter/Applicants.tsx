import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Mail, Phone, FileText, Loader2 } from 'lucide-react';
import applicationApi from '../../api/applicationApi';
import { jobApi } from '../../api/jobApi';
import { useToast } from '../../hooks/useToast';

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
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const { showToast } = useToast();

    useEffect(() => {
        if (jobId) {
            fetchJobAndApplicants();
        }
    }, [jobId]);

    const fetchJobAndApplicants = async () => {
        if (!jobId) return;

        try {
            setLoading(true);

            const jobData = await jobApi.getJobById(jobId);
            if (jobData.success) {
                setJob(jobData.job);
            }

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
                setApplications(prev =>
                    prev.map(app =>
                        app._id === applicationId
                            ? { ...app, status: newStatus as Application['status'] }
                            : app
                    )
                );
            }
        } catch (err: any) {
            showToast(err.message || 'Failed to update status', 'error');
        } finally {
            setUpdatingId(null);
        }
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            pending: { text: 'Pending', class: 'bg-gray-100 text-gray-800' },
            reviewing: { text: 'Reviewing', class: 'bg-blue-100 text-blue-800' },
            accepted: { text: 'Accepted', class: 'bg-green-100 text-green-800' },
            rejected: { text: 'Rejected', class: 'bg-red-100 text-red-800' }
        };
        return badges[status as keyof typeof badges] || badges.pending;
    };

    const filteredApplications = filterStatus === 'all'
        ? applications
        : applications.filter(app => app.status === filterStatus);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => navigate('/recruiter-dashboard')}
                        className="px-4 py-2 bg-black text-white text-sm rounded hover:bg-gray-800"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/recruiter-dashboard')}
                        className="flex items-center gap-2 text-gray-600 hover:text-black mb-6 text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>

                    <h1 className="text-3xl font-semibold text-gray-900 mb-2">{job?.title}</h1>
                    <p className="text-gray-500">{applications.length} {applications.length === 1 ? 'application' : 'applications'}</p>
                </div>



                {/* Filters */}
                <div className="flex gap-2 mb-6 border-b border-gray-200">
                    {['all', 'pending', 'reviewing', 'accepted', 'rejected'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition ${filterStatus === status
                                ? 'border-black text-black'
                                : 'border-transparent text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Applicants List */}
                {filteredApplications.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                        <p className="text-gray-500">No applications found</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredApplications.map((app) => {
                            const badge = getStatusBadge(app.status);
                            return (
                                <div key={app._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                    {/* Header */}
                                    <div className="px-6 py-4 border-b border-gray-100">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">{app.applicant.fullname}</h3>
                                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                                    <a href={`mailto:${app.applicant.email}`} className="flex items-center gap-1 hover:text-black">
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
                                            <span className={`px-3 py-1 text-xs font-medium rounded ${badge.class}`}>
                                                {badge.text}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="px-6 py-4">
                                        {/* Cover Letter */}
                                        {app.coverLetter && (
                                            <div className="mb-4">
                                                <h4 className="text-sm font-medium text-gray-900 mb-2">Cover Letter</h4>
                                                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                                    {app.coverLetter}
                                                </p>
                                            </div>
                                        )}

                                        {/* Resume */}
                                        {app.resume && (
                                            <div className="mb-4">
                                                <a
                                                    href={app.resume}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                                                >
                                                    <FileText className="w-4 h-4" />
                                                    View Resume
                                                </a>
                                            </div>
                                        )}

                                        <div className="text-xs text-gray-500 mb-4">
                                            Applied {new Date(app.createdAt).toLocaleDateString()}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            {app.status !== 'reviewing' && (
                                                <button
                                                    onClick={() => updateStatus(app._id, 'reviewing')}
                                                    disabled={updatingId === app._id}
                                                    className="px-4 py-2 text-sm bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
                                                >
                                                    {updatingId === app._id ? 'Updating...' : 'Review'}
                                                </button>
                                            )}
                                            {app.status !== 'accepted' && (
                                                <button
                                                    onClick={() => updateStatus(app._id, 'accepted')}
                                                    disabled={updatingId === app._id}
                                                    className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                                                >
                                                    {updatingId === app._id ? 'Updating...' : 'Accept'}
                                                </button>
                                            )}
                                            {app.status !== 'rejected' && (
                                                <button
                                                    onClick={() => updateStatus(app._id, 'rejected')}
                                                    disabled={updatingId === app._id}
                                                    className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                                                >
                                                    {updatingId === app._id ? 'Updating...' : 'Reject'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Applicants;
