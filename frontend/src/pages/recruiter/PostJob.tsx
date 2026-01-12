import { useActionState, useState, useEffect, type KeyboardEvent } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { jobApi } from '../../api/jobApi';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';

type Job = {
    _id: string;
    title: string;
    description: string;
    requirements: string[];
    salary: number;
    location: string;
    jobType: string;
    experience: number;
    position: number;
    status: string;
};

type PostJobState = {
    error?: string;
    success?: boolean;
};

const PostJob = () => {
    const { jobId } = useParams<{ jobId?: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(!!jobId);
    const isEditMode = !!jobId;
    const { showToast } = useToast();

    const [requirements, setRequirements] = useState(
        job ? job.requirements.map(r => `• ${r}`).join('\n') : ''
    );

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
    }, [user, navigate]);

    useEffect(() => {
        if (jobId) {
            fetchJob();
        }
    }, [jobId]);

    const fetchJob = async () => {
        if (!jobId) return;
        try {
            const data = await jobApi.getJobById(jobId);
            if (data.success) {
                setJob(data.job);
                setRequirements(data.job.requirements.map((r: string) => `• ${r}`).join('\n'));
            }
        } catch (error) {
            console.error('Failed to fetch job:', error);
        } finally {
            setLoading(false);
        }
    };

    const jobAction = async (_prevState: PostJobState, formData: FormData): Promise<PostJobState> => {
        try {
            const jobData = {
                title: isEditMode && job ? job.title : formData.get('title') as string,
                description: formData.get('description') as string,
                requirements: requirements
                    .split('\n')
                    .map(r => r.trim().replace(/^[•\-]\s*/, ''))
                    .filter(r => r.length > 0),
                salary: isEditMode && job ? job.salary : Number(formData.get('salary')),
                location: isEditMode && job ? job.location : formData.get('location') as string,
                jobType: isEditMode && job ? job.jobType : formData.get('jobType') as string,
                experience: isEditMode && job && job ? job.experience : Number(formData.get('experience')),
                position: Number(formData.get('position')),
                status: formData.get('status') as string
            };

            const data = isEditMode && job
                ? await jobApi.updateJob(job._id, jobData)
                : await jobApi.postJob(jobData);

            if (data.success) {
                navigate('/recruiter-dashboard');
                return { success: true };
            }

            return { error: data.message || `Failed to ${isEditMode ? 'update' : 'post'} job` };
        } catch (err: any) {
            return { error: err.message || `Failed to ${isEditMode ? 'update' : 'post'} job. Please try again.` };
        }
    };

    const [state, action, isPending] = useActionState(jobAction, { success: false });

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

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

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
                    {state.error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                            {state.error}
                        </div>
                    )}

                    {isEditMode && (
                        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded text-blue-700 text-sm">
                            <strong>Note:</strong> Title, Salary, Location, Job Type, and Experience cannot be changed to protect applicants' interests.
                        </div>
                    )}

                    <form action={action} className="space-y-6">
                        {/* Job Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Job Title {isEditMode && <span className="text-xs text-gray-500">(Cannot be changed)</span>}
                            </label>
                            <input
                                type="text"
                                name="title"
                                required
                                disabled={isPending || isEditMode}
                                defaultValue={job?.title}
                                className={`w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-black outline-none text-sm ${isEditMode ? 'bg-gray-100 cursor-not-allowed' : ''
                                    }`}
                                placeholder="e.g., Senior React Developer"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Job Description
                            </label>
                            <textarea
                                name="description"
                                required
                                rows={5}
                                disabled={isPending}
                                defaultValue={job?.description}
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-black outline-none text-sm resize-none"
                                placeholder="Describe the role, responsibilities, and what makes this position exciting..."
                            />
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
                                    type="number"
                                    name="salary"
                                    required
                                    disabled={isPending || isEditMode}
                                    defaultValue={job?.salary}
                                    className={`w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-black outline-none text-sm ${isEditMode ? 'bg-gray-100 cursor-not-allowed' : ''
                                        }`}
                                    placeholder="1200000"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Location {isEditMode && <span className="text-xs text-gray-500">(Locked)</span>}
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    required
                                    disabled={isPending || isEditMode}
                                    defaultValue={job?.location}
                                    className={`w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-black outline-none text-sm ${isEditMode ? 'bg-gray-100 cursor-not-allowed' : ''
                                        }`}
                                    placeholder="Remote / Bangalore, India"
                                />
                            </div>
                        </div>

                        {/* Job Type & Experience */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Job Type {isEditMode && <span className="text-xs text-gray-500">(Locked)</span>}
                                </label>
                                <select
                                    name="jobType"
                                    disabled={isPending || isEditMode}
                                    defaultValue={job?.jobType || 'Full-time'}
                                    className={`w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-black outline-none text-sm ${isEditMode ? 'bg-gray-100 cursor-not-allowed' : ''
                                        }`}
                                >
                                    <option>Full-time</option>
                                    <option>Part-time</option>
                                    <option>Contract</option>
                                    <option>Internship</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Experience (Years) {isEditMode && <span className="text-xs text-gray-500">(Locked)</span>}
                                </label>
                                <input
                                    type="number"
                                    name="experience"
                                    required
                                    disabled={isPending || isEditMode}
                                    defaultValue={job?.experience}
                                    className={`w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-black outline-none text-sm ${isEditMode ? 'bg-gray-100 cursor-not-allowed' : ''
                                        }`}
                                    placeholder="3"
                                />
                            </div>
                        </div>

                        {/* Number of Positions */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Number of Openings
                            </label>
                            <input
                                type="number"
                                name="position"
                                required
                                disabled={isPending}
                                defaultValue={job?.position || 1}
                                min="1"
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-black outline-none text-sm"
                                placeholder="1"
                            />
                        </div>

                        {/* Job Status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Job Status
                            </label>
                            <select
                                name="status"
                                disabled={isPending}
                                defaultValue={job?.status || 'open'}
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
                                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded hover:bg-gray-50 transition text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isPending}
                                className="flex-1 px-6 py-3 bg-black text-white font-medium rounded hover:bg-gray-800 transition flex items-center justify-center gap-2 text-sm"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        {isEditMode ? 'Updating...' : 'Posting...'}
                                    </>
                                ) : (
                                    <>
                                        {/* <Briefcase className="w-4 h-4" /> */}
                                        {isEditMode ? 'Update Job' : 'Post Job'}
                                    </>
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
