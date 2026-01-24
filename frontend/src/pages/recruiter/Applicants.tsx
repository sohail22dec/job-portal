import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { applicationQueries } from '../../api/queries/applicationQueries';
import { jobQueries } from '../../api/queries/jobQueries';
import { useUpdateApplicationStatus } from '../../hooks/mutations/useApplicationMutations';
import { ApplicationCard } from '../../components/job-seeker/ApplicationCard';

const Applicants = () => {
    const { jobId } = useParams<{ jobId: string }>();
    const navigate = useNavigate();
    const [filterStatus, setFilterStatus] = useState<string>('all');

    // Fetch job details
    const { data: jobData, isLoading: loadingJob } = useQuery(jobQueries.detail(jobId || ''));
    const job = jobData?.job;

    // Fetch applications for this job
    const { data: applications = [], isLoading: loadingApps } = useQuery(applicationQueries.byJob(jobId || ''));

    // Update application status mutation
    const { mutate, isPending } = useUpdateApplicationStatus();

    const loading = loadingJob || loadingApps;

    const updateStatus = (applicationId: string, newStatus: string) => mutate({ applicationId, status: newStatus });

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
                        {filteredApplications.map((app: any) => (
                            <ApplicationCard
                                key={app._id}
                                application={app}
                                isPending={isPending}
                                updateStatus={updateStatus}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Applicants;
