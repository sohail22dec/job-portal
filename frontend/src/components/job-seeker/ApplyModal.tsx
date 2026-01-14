import { useState } from 'react';
import { X, Loader2, FileText } from 'lucide-react';
import applicationApi from '../../api/applicationApi';

type ApplyModalProps = {
    jobId: string;
    jobTitle: string;
    onClose: () => void;
    onSuccess: () => void;
};

const ApplyModal = ({ jobId, jobTitle, onClose, onSuccess }: ApplyModalProps) => {
    const [coverLetter, setCoverLetter] = useState('');
    const [resume, setResume] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!coverLetter.trim()) {
            setError('Please write a cover letter');
            return;
        }

        try {
            setIsSubmitting(true);
            const data = await applicationApi.applyForJob(jobId, {
                coverLetter,
                resume
            });

            if (data.success) {
                onSuccess();
                onClose();
            } else {
                setError(data.message || 'Failed to submit application');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to submit application. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-white/30 flex items-center justify-center z-50 p-4 backdrop-blur-md">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <FileText className="w-6 h-6 text-white" />
                        <h2 className="text-2xl font-bold text-white">Apply for Job</h2>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="text-white hover:bg-white/20 rounded-lg p-2 transition disabled:opacity-50"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto max-h-[calc(90vh-180px)]">
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{jobTitle}</h3>
                        <p className="text-gray-600">Submit your application for this position</p>
                    </div>

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
                                rows={8}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition disabled:bg-gray-50 disabled:text-gray-500 resize-none"
                                placeholder="Tell us why you're a great fit for this role..."
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                {coverLetter.length} / 500 characters
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
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
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

export default ApplyModal;
