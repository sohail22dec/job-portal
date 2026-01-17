import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, MapPin, IndianRupee, Clock, Calendar, Building2, Loader2, Bookmark, Copy, CheckCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { jobQueries } from '../../api/queries/jobQueries';
import { applicationQueries } from '../../api/queries/applicationQueries';
import { savedJobQueries } from '../../api/queries/savedJobQueries';
import { useToggleSaveJob } from '../../hooks/mutations/useSavedJobMutations';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';


const JobDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { showToast } = useToast();

    // Fetch job details
    const { data: jobData, isLoading: loadingJob, error: jobError } = useQuery(jobQueries.detail(id || ''));
    const job = jobData?.job;

    // Check application status (only for job seekers)
    const isJobSeeker = user?.role === 'job_seeker';
    const { data: applicationStatus } = useQuery({
        ...applicationQueries.status(id || ''),
        enabled: isJobSeeker && !!id,
    });
    const hasApplied = applicationStatus?.hasApplied || false;

    // Check if job is saved (only for job seekers)
    const { data: savedStatus } = useQuery({
        ...savedJobQueries.isSaved(id || ''),
        enabled: isJobSeeker && !!id,
    });
    const isSaved = savedStatus?.isSaved || false;

    // Toggle save mutation
    const toggleSaveMutation = useToggleSaveJob();

    const handleApplyClick = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (user.role === 'recruiter') {
            showToast('Recruiters cannot apply for jobs', 'error');
            return;
        }
        navigate(`/job/${id}/apply`);
    };


    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            showToast('Job link copied to clipboard!', 'success');
        } catch (err) {
            showToast('Failed to copy link', 'error');
        }
    };

    const handleToggleSave = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (user.role === 'recruiter') {
            showToast('Recruiters cannot save jobs', 'error');
            return;
        }

        if (id) {
            toggleSaveMutation.mutate(id);
        }
    };

    if (loadingJob) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    if (jobError || !job) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Job Not Found</h2>
                    <p className="text-gray-600 mb-6">{jobError instanceof Error ? jobError.message : 'The job you\'re looking for doesn\'t exist.'}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 bg-black text-white text-sm rounded hover:bg-gray-800"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate("/dashboard")}
                    className="flex items-center gap-2 text-gray-600 hover:text-black mb-6 text-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>

                {/* Job Header */}
                <div className="bg-white border border-gray-200 rounded-lg p-8 mb-6">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex gap-4 flex-1">
                            {/* Company Logo or Icon */}
                            {job.createdBy.profile?.company?.logo ? (
                                <img
                                    src={job.createdBy.profile.company.logo}
                                    alt={job.createdBy.profile.company.name || 'Company'}
                                    className="w-16 h-16 rounded-xl object-cover border border-gray-200 flex-shrink-0"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center border border-gray-200 flex-shrink-0">
                                    <Building2 className="w-8 h-8 text-gray-400" />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <h1 className="text-3xl font-semibold text-gray-900 mb-2">{job.title}</h1>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Building2 className="w-4 h-4" />
                                    <span>{job.createdBy.profile?.company?.name || 'Company'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-gray-100">
                        <div>
                            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                                <IndianRupee className="w-4 h-4" />
                                Salary
                            </div>
                            <div className="font-medium text-gray-900">₹{job.salary.toLocaleString()}/year</div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                                <MapPin className="w-4 h-4" />
                                Location
                            </div>
                            <div className="font-medium text-gray-900">{job.location}</div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                                <Clock className="w-4 h-4" />
                                Type
                            </div>
                            <div className="font-medium text-gray-900">{job.jobType}</div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                                <Calendar className="w-4 h-4" />
                                Experience
                            </div>
                            <div className="font-medium text-gray-900">{job.experience} years</div>
                        </div>
                    </div>

                    {/* Action Buttons - Job Seekers Only */}
                    {user?.role !== 'recruiter' && (
                        <div className="flex gap-3 pt-6 border-gray-100">
                            {/* Apply Button - Primary */}
                            <button
                                onClick={handleApplyClick}
                                disabled={hasApplied}
                                className={`flex-1 py-3 font-semibold rounded-lg transition flex items-center justify-center gap-2 ${hasApplied
                                    ? 'bg-green-50 text-green-700 border-2 border-green-200 cursor-not-allowed'
                                    : 'bg-gray-900 text-white hover:bg-gray-800 cursor-pointer'
                                    }`}
                            >
                                {hasApplied ? (
                                    <>
                                        <CheckCircle className="w-5 h-5" />
                                        Already Applied
                                    </>
                                ) : (
                                    'Apply for this Position'
                                )}
                            </button>

                            {/* Save Button - Secondary */}
                            <button
                                onClick={handleToggleSave}
                                disabled={toggleSaveMutation.isPending}
                                className={`px-6 py-3 border font-medium rounded-lg transition flex items-center gap-2 cursor-pointer ${isSaved
                                    ? 'border-green-500 text-green-700 bg-green-50 hover:bg-green-100'
                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                    } ${toggleSaveMutation.isPending ? 'opacity-50 cursor-wait' : ''}`}
                                title={isSaved ? "Unsave job" : "Save for later"}
                            >
                                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                                {isSaved ? 'Saved' : 'Save'}
                            </button>

                            {/* Copy Button - Icon Only */}
                            <button
                                onClick={handleCopy}
                                className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition cursor-pointer"
                                title="Copy job link"
                            >
                                <Copy className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>




                {/* Job Details - All in One Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-8 mb-6">
                    {/* Job Description */}
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Description</h2>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">{job.description}</p>
                    </div>

                    {/* Requirements */}
                    {job.requirements && job.requirements.length > 0 && (
                        <div className="mb-8 pb-8 border-b border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h2>
                            <ul className="space-y-2">
                                {job.requirements.map((req: string, index: number) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <div className="mt-2 w-1 h-1 rounded-full bg-gray-400 flex-shrink-0" />
                                        <span className="text-gray-700">{req}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Additional Information */}
                    <div className="mb-8 pb-8 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <div className="text-sm text-gray-500 mb-1">Positions Available</div>
                                <div className="font-medium text-gray-900">{job.position}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500 mb-1">Applicants</div>
                                <div className="font-medium text-gray-900">{job.applications?.length || 0}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500 mb-1">Posted On</div>
                                <div className="font-medium text-gray-900">
                                    {new Date(job.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500 mb-1">Posted By</div>
                                <div className="font-medium text-gray-900">{job.createdBy.fullname}</div>
                            </div>
                        </div>
                    </div>

                    {/* Company Info */}
                    {job.createdBy.profile?.company && (
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">About the Company</h2>
                            <h3 className="font-medium text-gray-900 mb-2">
                                {job.createdBy.profile.company.name}
                            </h3>
                            {job.createdBy.profile.company.description && (
                                <p className="text-gray-700 mb-4">{job.createdBy.profile.company.description}</p>
                            )}
                            {job.createdBy.profile.company.website && (
                                <a
                                    href={job.createdBy.profile.company.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-700 text-sm"
                                >
                                    Visit Website →
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobDetails;
