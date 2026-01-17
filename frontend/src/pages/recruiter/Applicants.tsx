import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Mail, Phone, FileText, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { applicationQueries } from '../../api/queries/applicationQueries';
import { jobQueries } from '../../api/queries/jobQueries';
import { useUpdateApplicationStatus } from '../../hooks/mutations/useApplicationMutations';


const Applicants = () => {
    const { jobId } = useParams<{ jobId: string }>();
    const navigate = useNavigate();
    const [filterStatus, setFilterStatus] = useState<string>('all');

    // Fetch job details
    const { data: jobData, isLoading: loadingJob } = useQuery(jobQueries.detail(jobId || ''));
    const job = jobData?.job;

    // Fetch applications for this job
    const { data: applicationsData, isLoading: loadingApps } = useQuery(applicationQueries.byJob(jobId || ''));
    const applications = applicationsData?.success ? applicationsData.applications : [];

    // Update application status mutation
    const updateStatusMutation = useUpdateApplicationStatus();

    const loading = loadingJob || loadingApps;

    const updateStatus = (applicationId: string, newStatus: string) => {
        updateStatusMutation.mutate({ applicationId, status: newStatus });
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
        : applications.filter((app: any) => app.status === filterStatus);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
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
                        {filteredApplications.map((app: any) => {
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
                                                    disabled={updateStatusMutation.isPending}
                                                    className="px-4 py-2 text-sm bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
                                                >
                                                    {updateStatusMutation.isPending ? 'Updating...' : 'Review'}
                                                </button>
                                            )}
                                            {app.status !== 'accepted' && (
                                                <button
                                                    onClick={() => updateStatus(app._id, 'accepted')}
                                                    disabled={updateStatusMutation.isPending}
                                                    className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                                                >
                                                    {updateStatusMutation.isPending ? 'Updating...' : 'Accept'}
                                                </button>
                                            )}
                                            {app.status !== 'rejected' && (
                                                <button
                                                    onClick={() => updateStatus(app._id, 'rejected')}
                                                    disabled={updateStatusMutation.isPending}
                                                    className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                                                >
                                                    {updateStatusMutation.isPending ? 'Updating...' : 'Reject'}
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
