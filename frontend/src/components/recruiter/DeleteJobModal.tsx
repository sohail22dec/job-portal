import { AlertTriangle, X, Loader2 } from 'lucide-react';
import { useDeleteJob } from '../../hooks/mutations/useJobMutations';

type DeleteJobModalProps = {
    jobId: string;
    jobTitle: string;
    onSuccess: () => void;
    onCancel: () => void;
};

const DeleteJobModal = ({ jobId, jobTitle, onSuccess, onCancel }: DeleteJobModalProps) => {
    const { mutate, error, isPending } = useDeleteJob();

    const handleDelete = () => {
        mutate(jobId, {
            onSuccess: () => {
                onSuccess();
            }
        });
    };

    return (
        <div className="fixed inset-0 bg-white/30 flex items-center justify-center z-50 p-4 backdrop-blur-md">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
                {/* Header */}
                <div className="bg-gradient-to-r from-red-600 to-rose-600 px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                            <AlertTriangle className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Delete Job</h2>
                    </div>
                    <button
                        onClick={onCancel}
                        disabled={isPending}
                        className="p-2 hover:bg-white/20 rounded-lg transition text-white disabled:opacity-50"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                            <p className="text-red-700 text-sm font-medium">
                                {error?.message || 'Failed to delete job. Please try again.'}
                            </p>
                        </div>
                    )}

                    <p className="text-gray-700 mb-2">
                        Are you sure you want to delete this job?
                    </p>
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-4">
                        <p className="font-semibold text-red-900 mb-1">{jobTitle}</p>
                        <p className="text-sm text-red-700">
                            This action cannot be undone. All applicant data for this job will be permanently deleted.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 px-6 pb-6">
                    <button
                        onClick={onCancel}
                        disabled={isPending}
                        className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isPending}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-red-300 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            'Delete Job'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteJobModal;
