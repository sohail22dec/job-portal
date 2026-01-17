import { useState, useEffect, type KeyboardEvent } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { useCreateJob, useUpdateJob } from '../../hooks/mutations/useJobMutations';
import { jobQueries } from '../../api/queries/jobQueries';
import { jobSchema, type JobFormData } from '../../schemas/jobSchemas';
import LoadingSpinner from '../../components/LoadingSpinner';

const PostJob = () => {
    const { jobId } = useParams<{ jobId?: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const isEditMode = !!jobId;
    const { showToast } = useToast();

    const [requirements, setRequirements] = useState('');

    // Fetch job data for editing
    const { data: jobData, isLoading: loadingJob } = useQuery(jobQueries.detail(jobId || ''));
    const job = jobData?.job;

    // Mutations
    const createMutation = useCreateJob();
    const updateMutation = useUpdateJob();

    // Form setup
    const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm<JobFormData>({
        resolver: zodResolver(jobSchema),
        mode: 'onBlur',
        defaultValues: {
            status: 'open',
            position: 1,
            jobType: 'Full-time',
        },
    });

    // Check if company profile is complete
    useEffect(() => {
        if (user && user.role === 'recruiter') {
            const hasDescription = user.profile?.company?.description;
            const hasWebsite = user.profile?.company?.website;

            if (!hasDescription || !hasWebsite) {
                showToast('Please complete your company profile before posting a job', 'warning');
                navigate('/company-profile');
                return;
            }
        }
    }, [user, navigate, showToast]);

    // Populate form with job data when editing
    useEffect(() => {
        if (isEditMode && job) {
            setValue('title', job.title);
            setValue('description', job.description);
            setValue('salary', job.salary);
            setValue('location', job.location);
            setValue('jobType', job.jobType);
            setValue('experience', job.experience);
            setValue('position', job.position);
            setValue('status', job.status);

            const formattedRequirements = job.requirements.map((r: string) => `• ${r}`).join('\n');
            setRequirements(formattedRequirements);
        }
    }, [job, isEditMode, setValue]);

    const onSubmit = (data: JobFormData) => {
        // Parse requirements from textarea
        const parsedRequirements = requirements
            .split('\n')
            .map(r => r.trim().replace(/^[•\-]\s*/, ''))
            .filter(r => r.length > 0);

        const jobData = {
            ...data,
            requirements: parsedRequirements,
        };

        if (isEditMode && jobId) {
            updateMutation.mutate({ jobId, data: jobData });
        } else {
            createMutation.mutate(jobData);
        }
    };

    const handleRequirementsKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const textarea = e.currentTarget;
            const cursorPos = textarea.selectionStart;
            const textBefore = requirements.substring(0, cursorPos);
            const textAfter = requirements.substring(cursorPos);

            const newText = textBefore + '\n• ' + textAfter;
            setRequirements(newText);

            setTimeout(() => {
                textarea.selectionStart = textarea.selectionEnd = cursorPos + 3;
            }, 0);
        }
    };

    const handleRequirementsFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
        if (requirements === '') {
            setRequirements('• ');
            setTimeout(() => {
                e.target.selectionStart = e.target.selectionEnd = 2;
            }, 0);
        }
    };

    if (loadingJob && isEditMode) return <LoadingSpinner />

    const isPending = isSubmitting || createMutation.isPending || updateMutation.isPending;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-3xl mx-auto px-6">
                {/* Header */}
                <button
                    onClick={() => navigate('/recruiter-dashboard')}
                    className="flex items-center gap-2 text-gray-600 hover:text-black mb-6 text-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </button>

                <div className="mb-8">
                    <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                        {isEditMode ? 'Edit Job' : 'Post a New Job'}
                    </h1>
                    <p className="text-gray-600">
                        {isEditMode ? 'Update job details' : 'Fill in the details to attract top talent'}
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white border border-gray-200 rounded-lg p-8">
                    {isEditMode && (
                        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded text-blue-700 text-sm">
                            <strong>Note:</strong> Title, Salary, Location, Job Type, and Experience cannot be changed to protect applicants' interests.
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Job Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Job Title {isEditMode && <span className="text-xs text-gray-500">(Cannot be changed)</span>}
                            </label>
                            <input
                                {...register('title')}
                                type="text"
                                disabled={isPending || isEditMode}
                                className={`w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-black outline-none text-sm ${isEditMode ? 'bg-gray-100 cursor-not-allowed' : ''
                                    } ${errors.title ? 'border-red-500' : ''}`}
                                placeholder="e.g., Senior React Developer"
                            />
                            {errors.title && (
                                <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Job Description
                            </label>
                            <textarea
                                {...register('description')}
                                rows={5}
                                disabled={isPending}
                                className={`w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-black outline-none text-sm resize-none ${errors.description ? 'border-red-500' : ''
                                    }`}
                                placeholder="Describe the role, responsibilities, and what makes this position exciting..."
                            />
                            {errors.description && (
                                <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-500">Be detailed to attract the right candidates</p>
                        </div>

                        {/* Requirements */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Requirements
                            </label>
                            <textarea
                                value={requirements}
                                onChange={(e) => setRequirements(e.target.value)}
                                onKeyDown={handleRequirementsKeyDown}
                                onFocus={handleRequirementsFocus}
                                rows={4}
                                disabled={isPending}
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-black outline-none text-sm resize-y"
                                placeholder="Click to start, press Enter for new bullet point..."
                            />
                            <p className="mt-1 text-xs text-gray-500">Press Enter to add a new requirement with bullet point. Drag bottom-right corner to resize.</p>
                        </div>

                        {/* Salary & Location */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Annual Salary (₹) {isEditMode && <span className="text-xs text-gray-500">(Locked)</span>}
                                </label>
                                <input
                                    {...register('salary', { valueAsNumber: true })}
                                    type="number"
                                    disabled={isPending || isEditMode}
                                    className={`w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-black outline-none text-sm ${isEditMode ? 'bg-gray-100 cursor-not-allowed' : ''
                                        } ${errors.salary ? 'border-red-500' : ''}`}
                                    placeholder="1200000"
                                />
                                {errors.salary && (
                                    <p className="mt-1 text-xs text-red-600">{errors.salary.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Location {isEditMode && <span className="text-xs text-gray-500">(Locked)</span>}
                                </label>
                                <input
                                    {...register('location')}
                                    type="text"
                                    disabled={isPending || isEditMode}
                                    className={`w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-black outline-none text-sm ${isEditMode ? 'bg-gray-100 cursor-not-allowed' : ''
                                        } ${errors.location ? 'border-red-500' : ''}`}
                                    placeholder="Remote / Bangalore, India"
                                />
                                {errors.location && (
                                    <p className="mt-1 text-xs text-red-600">{errors.location.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Job Type & Experience */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Job Type {isEditMode && <span className="text-xs text-gray-500">(Locked)</span>}
                                </label>
                                <select
                                    {...register('jobType')}
                                    disabled={isPending || isEditMode}
                                    className={`w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-black outline-none text-sm ${isEditMode ? 'bg-gray-100 cursor-not-allowed' : ''
                                        } ${errors.jobType ? 'border-red-500' : ''}`}
                                >
                                    <option>Full-time</option>
                                    <option>Part-time</option>
                                    <option>Contract</option>
                                    <option>Internship</option>
                                </select>
                                {errors.jobType && (
                                    <p className="mt-1 text-xs text-red-600">{errors.jobType.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Experience (Years) {isEditMode && <span className="text-xs text-gray-500">(Locked)</span>}
                                </label>
                                <input
                                    {...register('experience', { valueAsNumber: true })}
                                    type="number"
                                    disabled={isPending || isEditMode}
                                    className={`w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-black outline-none text-sm ${isEditMode ? 'bg-gray-100 cursor-not-allowed' : ''
                                        } ${errors.experience ? 'border-red-500' : ''}`}
                                    placeholder="3"
                                />
                                {errors.experience && (
                                    <p className="mt-1 text-xs text-red-600">{errors.experience.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Number of Positions */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Number of Openings
                            </label>
                            <input
                                {...register('position', { valueAsNumber: true })}
                                type="number"
                                disabled={isPending}
                                min="1"
                                className={`w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-black outline-none text-sm ${errors.position ? 'border-red-500' : ''
                                    }`}
                                placeholder="1"
                            />
                            {errors.position && (
                                <p className="mt-1 text-xs text-red-600">{errors.position.message}</p>
                            )}
                        </div>

                        {/* Job Status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Job Status
                            </label>
                            <select
                                {...register('status')}
                                disabled={isPending}
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-black outline-none text-sm"
                            >
                                <option value="open">Open</option>
                                <option value="closed">Closed</option>
                            </select>
                            <p className="mt-1 text-xs text-gray-500">Set to Closed to stop accepting applications</p>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => navigate('/recruiter-dashboard')}
                                disabled={isPending}
                                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded hover:bg-gray-50 transition text-sm disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isPending}
                                className="flex-1 px-6 py-3 bg-black text-white font-medium rounded hover:bg-gray-800 transition flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        {isEditMode ? 'Updating...' : 'Posting...'}
                                    </>
                                ) : (
                                    <>{isEditMode ? 'Update Job' : 'Post Job'}</>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PostJob;
