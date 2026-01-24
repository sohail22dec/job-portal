import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2, FileText, Building2, Upload, File as FileIcon, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { useApplyToJob } from '../../hooks/mutations/useApplicationMutations';
import { jobQueries } from '../../api/queries/jobQueries';
import { applicationSchema, type ApplicationFormData } from '../../schemas/applicationSchemas';
import AICoverLetterGenerator from '../../components/job-seeker/AICoverLetterGenerator';

const ApplyJob = () => {
    const { jobId } = useParams<{ jobId: string }>();
    const navigate = useNavigate();
    const { user, loading } = useAuth();
    const { showToast } = useToast();
    const [showAIGenerator, setShowAIGenerator] = useState(false);

    // Fetch job details using TanStack Query
    const { data: jobData, isLoading } = useQuery(jobQueries.detail(jobId || ''));
    const job = jobData?.job;

    // Mutation hook
    const applyMutation = useApplyToJob();

    // Form setup
    const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<ApplicationFormData>({
        resolver: zodResolver(applicationSchema),
        mode: 'onBlur',
        defaultValues: {
            coverLetter: '',
        },
    });

    const resumeFiles = watch('resume');
    const resumeFile = resumeFiles && resumeFiles.length > 0 ? resumeFiles[0] : null;

    // Check authentication and role
    useEffect(() => {
        // Don't redirect while auth is still loading
        if (loading) return;

        if (!user) {
            navigate('/login');
            return;
        }
        if (user.role === 'recruiter') {
            showToast('Recruiters cannot apply for jobs', 'error');
            navigate(-1);
            return;
        }
    }, [user, loading, navigate, showToast]);

    const handleAIGenerate = (coverLetter: string) => {
        setValue('coverLetter', coverLetter);
        showToast('Cover letter generated successfully! Review and edit as needed.', 'success');
    };

    const onSubmit = (data: ApplicationFormData) => {
        if (!jobId) return;

        // data.resume is a FileList
        if (!data.resume || data.resume.length === 0) {
            showToast('Please upload a resume', 'error');
            return;
        }

        applyMutation.mutate({
            jobId,
            applicationData: {
                coverLetter: data.coverLetter,
                resume: data.resume[0],
            },
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    if (!job) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Error</h2>
                    <p className="text-gray-600 mb-6">Job not found</p>
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

    const isPending = isSubmitting || applyMutation.isPending;

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
                </div>

                {/* Application Form */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Cover Letter */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Cover Letter <span className="text-red-500">*</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setShowAIGenerator(true)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                                >
                                    <Sparkles className="w-3.5 h-3.5" />
                                    Generate with AI
                                </button>
                            </div>
                            <textarea
                                {...register('coverLetter')}
                                disabled={isPending}
                                rows={10}
                                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition disabled:bg-gray-50 disabled:text-gray-500 resize-none ${errors.coverLetter ? 'border-red-500' : ''
                                    }`}
                                placeholder="Tell us why you're a great fit for this role..."
                            />
                            {errors.coverLetter && (
                                <p className="mt-1 text-xs text-red-600">{errors.coverLetter.message}</p>
                            )}
                            <p className="mt-1 text-sm text-gray-500">
                                Minimum 50 characters required
                            </p>
                        </div>

                        {/* Resume Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Resume (PDF) <span className="text-red-500">*</span>
                            </label>

                            <div className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition ${errors.resume ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-black bg-gray-50'
                                }`}>
                                <input
                                    {...register('resume')}
                                    type="file"
                                    id="resume-upload"
                                    accept=".pdf"
                                    disabled={isPending}
                                    className="hidden"
                                />

                                {resumeFile ? (
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <FileIcon className="w-8 h-8 text-black" />
                                        <div className="text-left">
                                            <p className="font-medium">{resumeFile.name}</p>
                                            <p className="text-xs text-gray-500">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                        <label
                                            htmlFor="resume-upload"
                                            className="ml-4 text-sm font-semibold hover:underline cursor-pointer"
                                        >
                                            Change
                                        </label>
                                    </div>
                                ) : (
                                    <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center">
                                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                        <span className="text-sm font-medium text-gray-900">Click to upload resume</span>
                                        <span className="text-xs text-gray-500 mt-1">PDF only (Max 5MB)</span>
                                    </label>
                                )}
                            </div>

                            {errors.resume && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.resume.message as string}
                                </p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate(`/job/${jobId}`)}
                                disabled={isPending}
                                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isPending}
                                className="flex-1 px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isPending ? (
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

                {/* AI Cover Letter Generator Modal */}
                <AICoverLetterGenerator
                    isOpen={showAIGenerator}
                    onClose={() => setShowAIGenerator(false)}
                    onGenerate={handleAIGenerate}
                    jobTitle={job.title}
                    companyName={job.createdBy.profile?.company?.name || 'Company'}
                    jobDescription={job.description}
                />
            </div>
        </div>
    );
};

export default ApplyJob;
