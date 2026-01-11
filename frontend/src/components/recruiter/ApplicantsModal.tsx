import { useState, useEffect } from 'react';
import { X, Loader2, Mail, Phone, FileText, CheckCircle, XCircle, Eye } from 'lucide-react';
import applicationApi from '../../api/applicationApi';

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

type ApplicantsModalProps = {
    jobId: string;
    jobTitle: string;
    onClose: () => void;
};

const ApplicantsModal = ({ jobId, jobTitle, onClose }: ApplicantsModalProps) => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    useEffect(() => {
        fetchApplicants();
    }, []);

    const fetchApplicants = async () => {
        try {
            setLoading(true);
            const data = await applicationApi.getJobApplicants(jobId);
            if (data.success) {
                setApplications(data.applications);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to load applicants');
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

    return (
        <div className="fixed inset-0 bg-white/30 flex items-center justify-center z-50 p-4 backdrop-blur-md">
            <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">{jobTitle}</h2>
                        <p className="text-blue-100 mt-1">
                            {applications.length} {applications.length === 1 ? 'Applicant' : 'Applicants'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-white/20 rounded-lg p-2 transition"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <p className="text-red-600">{error}</p>
                        </div>
                    ) : applications.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications yet</h3>
                            <p className="text-gray-600">Check back later for new applicants</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {applications.map((app) => (
                                <div key={app._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-900">{app.applicant.fullname}</h3>
                                            <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <Mail className="w-4 h-4" />
                                                    <a href={`mailto:${app.applicant.email}`} className="hover:text-blue-600">
                                                        {app.applicant.email}
                                                    </a>
                                                </div>
                                                {app.applicant.phoneNumber && (
                                                    <div className="flex items-center gap-1">
                                                        <Phone className="w-4 h-4" />
                                                        <span>{app.applicant.phoneNumber}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(app.status)}`}>
                                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                        </span>
                                    </div>

                                    {/* Cover Letter */}
                                    {app.coverLetter && (
                                        <div className="mb-4">
                                            <h4 className="font-semibold text-gray-900 mb-2">Cover Letter</h4>
                                            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                                                {app.coverLetter}
                                            </p>
                                        </div>
                                    )}

                                    {/* Resume */}
                                    {app.resume && (
                                        <div className="mb-4">
                                            <h4 className="font-semibold text-gray-900 mb-2">Resume</h4>
                                            <a
                                                href={app.resume}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-700 underline flex items-center gap-2"
                                            >
                                                <FileText className="w-4 h-4" />
                                                View Resume
                                            </a>
                                        </div>
                                    )}

                                    <div className="text-sm text-gray-500 mb-4">
                                        Applied {new Date(app.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 pt-4 border-t border-gray-200">
                                        {app.status !== 'reviewing' && (
                                            <button
                                                onClick={() => updateStatus(app._id, 'reviewing')}
                                                disabled={updatingId === app._id}
                                                className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                {updatingId === app._id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Eye className="w-4 h-4" />
                                                )}
                                                Mark as Reviewing
                                            </button>
                                        )}
                                        {app.status !== 'accepted' && (
                                            <button
                                                onClick={() => updateStatus(app._id, 'accepted')}
                                                disabled={updatingId === app._id}
                                                className="flex-1 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                {updatingId === app._id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <CheckCircle className="w-4 h-4" />
                                                )}
                                                Accept
                                            </button>
                                        )}
                                        {app.status !== 'rejected' && (
                                            <button
                                                onClick={() => updateStatus(app._id, 'rejected')}
                                                disabled={updatingId === app._id}
                                                className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                {updatingId === app._id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <XCircle className="w-4 h-4" />
                                                )}
                                                Reject
                                            </button>
                                        )}
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

export default ApplicantsModal;
