import { useActionState, useState, type KeyboardEvent } from 'react';
import { X, Loader2, Briefcase, FileText, ListChecks, IndianRupee, MapPin, Clock, Users2, Building2, ToggleRight } from 'lucide-react';
import { jobApi } from '../../api/jobApi';

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

type PostJobModalProps = {
    job?: Job;  // Optional - if provided, we're in edit mode
    onClose: () => void;
    onJobPosted: () => void;
};

type PostJobState = {
    error?: string;
    success?: boolean;
};

const PostJobModal = ({ job, onClose, onJobPosted }: PostJobModalProps) => {
    const isEditMode = !!job;

    // Initialize requirements with existing data or empty
    const [requirements, setRequirements] = useState(
        job ? job.requirements.map(r => `• ${r}`).join('\n') : ''
    );

    const jobAction = async (_prevState: PostJobState, formData: FormData): Promise<PostJobState> => {
        try {
            const jobData = {
                title: isEditMode ? job.title : formData.get('title') as string,
                description: formData.get('description') as string,
                requirements: requirements
                    .split('\n')
                    .map(r => r.trim().replace(/^[•\-]\s*/, ''))
                    .filter(r => r.length > 0),
                salary: isEditMode ? job.salary : Number(formData.get('salary')),
                location: isEditMode ? job.location : formData.get('location') as string,
                jobType: isEditMode ? job.jobType : formData.get('jobType') as string,
                experience: isEditMode ? job.experience : Number(formData.get('experience')),
                position: Number(formData.get('position')),
                status: formData.get('status') as string
            };

            const data = isEditMode
                ? await jobApi.updateJob(job._id, jobData)
                : await jobApi.postJob(jobData);

            if (data.success) {
                onJobPosted();
                return { success: true };
            }

            return { error: data.message || `Failed to ${isEditMode ? 'update' : 'post'} job` };
        } catch (err: any) {
            return { error: err.message || `Failed to ${isEditMode ? 'update' : 'post'} job. Please try again.` };
        }
    };

    const [state, action, isPending] = useActionState(jobAction, { success: false });

    // Handle Enter key in requirements field
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
            // Set cursor position after the bullet
            setTimeout(() => {
                e.target.selectionStart = e.target.selectionEnd = 2;
            }, 0);
        }
    };

    const handleRequirementsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setRequirements(e.target.value);
    };

    return (
        <div className="fixed inset-0 bg-white/30 flex items-center justify-center z-50 p-4 backdrop-blur-md">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                            <Briefcase className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">
                                {isEditMode ? 'Edit Job' : 'Post a New Job'}
                            </h2>
                            <p className="text-blue-100 text-sm">
                                {isEditMode ? 'Update job details' : 'Fill in the details to attract top talent'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-lg transition text-white"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-180px)]">
                    <form action={action} className="p-8">
                        {state.error && (
                            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                                <p className="text-red-700 text-sm font-medium">{state.error}</p>
                            </div>
                        )}

                        {isEditMode && (
                            <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                                <p className="text-blue-700 text-sm">
                                    <strong>Note:</strong> Title, Salary, Location, Job Type, and Experience cannot be changed to protect applicants' interests.
                                </p>
                            </div>
                        )}

                        <div className="space-y-6">
                            {/* Job Title */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <Briefcase className="w-4 h-4 text-blue-600" />
                                    Job Title {isEditMode && <span className="text-xs text-gray-500">(Cannot be changed)</span>}
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    disabled={isPending || isEditMode}
                                    defaultValue={job?.title}
                                    className={`w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${isEditMode ? 'bg-gray-100 cursor-not-allowed' : ''
                                        } disabled:bg-gray-50 disabled:text-gray-500`}
                                    placeholder="e.g., Senior React Developer"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <FileText className="w-4 h-4 text-blue-600" />
                                    Job Description
                                </label>
                                <textarea
                                    name="description"
                                    required
                                    rows={5}
                                    disabled={isPending}
                                    defaultValue={job?.description}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500 resize-none"
                                    placeholder="Describe the role, responsibilities, and what makes this position exciting..."
                                />
                                <p className="mt-1 text-xs text-gray-500">Be detailed to attract the right candidates</p>
                            </div>

                            {/* Requirements */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <ListChecks className="w-4 h-4 text-blue-600" />
                                    Requirements
                                </label>
                                <input type="hidden" name="requirements" value={requirements} />
                                <textarea
                                    value={requirements}
                                    onChange={handleRequirementsChange}
                                    onKeyDown={handleRequirementsKeyDown}
                                    onFocus={handleRequirementsFocus}
                                    rows={4}
                                    disabled={isPending}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500 resize-none"
                                    placeholder="Click to start, press Enter for new bullet point..."
                                />
                                <p className="mt-1 text-xs text-gray-500">Press Enter to add a new requirement with bullet point</p>
                            </div>

                            {/* Salary & Location Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                        <IndianRupee className="w-4 h-4 text-blue-600" />
                                        Annual Salary (₹) {isEditMode && <span className="text-xs text-gray-500">(Locked)</span>}
                                    </label>
                                    <input
                                        type="number"
                                        name="salary"
                                        required
                                        disabled={isPending || isEditMode}
                                        defaultValue={job?.salary}
                                        className={`w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${isEditMode ? 'bg-gray-100 cursor-not-allowed' : ''
                                            } disabled:bg-gray-50 disabled:text-gray-500`}
                                        placeholder="1200000"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                        <MapPin className="w-4 h-4 text-blue-600" />
                                        Location {isEditMode && <span className="text-xs text-gray-500">(Locked)</span>}
                                    </label>
                                    <input
                                        type="text"
                                        name="location"
                                        required
                                        disabled={isPending || isEditMode}
                                        defaultValue={job?.location}
                                        className={`w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${isEditMode ? 'bg-gray-100 cursor-not-allowed' : ''
                                            } disabled:bg-gray-50 disabled:text-gray-500`}
                                        placeholder="Remote / Bangalore, India"
                                    />
                                </div>
                            </div>

                            {/* Job Type & Experience Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                        <Building2 className="w-4 h-4 text-blue-600" />
                                        Job Type {isEditMode && <span className="text-xs text-gray-500">(Locked)</span>}
                                    </label>
                                    <select
                                        name="jobType"
                                        disabled={isPending || isEditMode}
                                        defaultValue={job?.jobType || 'Full-time'}
                                        className={`w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${isEditMode ? 'bg-gray-100 cursor-not-allowed' : ''
                                            } disabled:bg-gray-50 disabled:text-gray-500 bg-white`}
                                    >
                                        <option>Full-time</option>
                                        <option>Part-time</option>
                                        <option>Contract</option>
                                        <option>Internship</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                        <Clock className="w-4 h-4 text-blue-600" />
                                        Experience (Years) {isEditMode && <span className="text-xs text-gray-500">(Locked)</span>}
                                    </label>
                                    <input
                                        type="number"
                                        name="experience"
                                        required
                                        disabled={isPending || isEditMode}
                                        defaultValue={job?.experience}
                                        className={`w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${isEditMode ? 'bg-gray-100 cursor-not-allowed' : ''
                                            } disabled:bg-gray-50 disabled:text-gray-500`}
                                        placeholder="3"
                                    />
                                </div>
                            </div>

                            {/* Number of Positions */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <Users2 className="w-4 h-4 text-blue-600" />
                                    Number of Openings
                                </label>
                                <input
                                    type="number"
                                    name="position"
                                    required
                                    disabled={isPending}
                                    defaultValue={job?.position || 1}
                                    min="1"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
                                    placeholder="1"
                                />
                            </div>

                            {/* Job Status */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <ToggleRight className="w-4 h-4 text-blue-600" />
                                    Job Status
                                </label>
                                <select
                                    name="status"
                                    disabled={isPending}
                                    defaultValue={job?.status || 'open'}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500 bg-white"
                                >
                                    <option value="open">Open</option>
                                    <option value="closed">Closed</option>
                                </select>
                                <p className="mt-1 text-xs text-gray-500">Set to Closed to stop accepting applications</p>
                            </div>
                        </div>

                        {/* Footer Buttons */}
                        <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isPending}
                                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isPending}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-300 transition-all disabled:opacity-50 flex items-center justify-center gap-2 hover:-translate-y-0.5"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        {isEditMode ? 'Updating...' : 'Posting...'}
                                    </>
                                ) : (
                                    <>
                                        <Briefcase className="w-5 h-5" />
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

export default PostJobModal;
