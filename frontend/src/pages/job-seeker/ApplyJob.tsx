import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Loader2, FileText, Building2 } from 'lucide-react';
import applicationApi from '../../api/applicationApi';
import { jobApi } from '../../api/jobApi';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';

type Job = {
    _id: string;
    title: string;
    createdBy: {
        profile?: {
            company?: {
                name?: string;
                logo?: string;
            };
        };
    };
};

const ApplyJob = () => {
    const { jobId } = useParams<{ jobId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { showToast } = useToast();

    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [coverLetter, setCoverLetter] = useState('');
    const [resume, setResume] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Check authentication and role
        if (!user) {
            navigate('/login');
            return;
        }
        if (user.role === 'recruiter') {
            showToast('Recruiters cannot apply for jobs', 'error');
            navigate(-1);
            return;
        }

        // Fetch job details
        const fetchJob = async () => {
            if (!jobId) return;

            try {
                setLoading(true);
                const data = await jobApi.getJobById(jobId);
                if (data.success) {
                    setJob(data.job);
                } else {
                    setError('Job not found');
                }
            } catch (err: any) {
                setError(err.message || 'Failed to load job details');
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [jobId, user, navigate, showToast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!coverLetter.trim()) {
            setError('Please write a cover letter');
            return;
        }

        try {
            setIsSubmitting(true);
            const data = await applicationApi.applyForJob(jobId!, {
                coverLetter,
                resume
            });

            if (data.success) {
                showToast('Application submitted successfully!', 'success');
                navigate(`/job/${jobId}`);
            } else {
                setError(data.message || 'Failed to submit application');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to submit application. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    if (error && !job) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Error</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
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
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-3xl mx-auto px-4">
                {/* Back Button */}
                <button
                    onClick={() => navigate(`/job/${jobId}`)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition cursor-pointer group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Job Details
                </button>

                {/* Header Card */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                    <div className="flex items-center gap-4 mb-4">
                        <FileText className="w-8 h-8 text-gray-600" />
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">Apply for Job</h1>
                            <p className="text-gray-600 text-sm">Submit your application</p>
                        </div>
                    </div>

                    {/* Job Info */}
                    {job && (
                        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                            {job.createdBy.profile?.company?.logo ? (
                                <img
                                    src={job.createdBy.profile.company.logo}
                                    alt={job.createdBy.profile.company.name || 'Company'}
                                    className="w-10 h-10 rounded object-cover border border-gray-200"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center border border-gray-200">
                                    <Building2 className="w-5 h-5 text-gray-400" />
                                </div>
                            )}
                            <div>
                                <h2 className="font-semibold text-gray-900">{job.title}</h2>
                                <p className="text-sm text-gray-600">
                                    {job.createdBy.profile?.company?.name || 'Company'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Application Form */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Cover Letter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cover Letter <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={coverLetter}
                                onChange={(e) => setCoverLetter(e.target.value)}
                                disabled={isSubmitting}
                                rows={10}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition disabled:bg-gray-50 disabled:text-gray-500 resize-none"
                                placeholder="Tell us why you're a great fit for this role..."
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                {coverLetter.length} characters
                            </p>
                        </div>

                        {/* Resume Link */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Resume Link (Optional)
                            </label>
                            <input
                                type="url"
                                value={resume}
                                onChange={(e) => setResume(e.target.value)}
                                disabled={isSubmitting}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition disabled:bg-gray-50 disabled:text-gray-500"
                                placeholder="https://drive.google.com/your-resume.pdf"
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                Link to your resume (Google Drive, Dropbox, etc.)
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate(`/job/${jobId}`)}
                                disabled={isSubmitting}
                                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit Application'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ApplyJob;
