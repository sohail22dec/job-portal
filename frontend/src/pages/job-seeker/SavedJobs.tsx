import { useNavigate, Link } from 'react-router';
import { Loader2, Bookmark, MapPin, IndianRupee, Clock, Building2, ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { savedJobQueries } from '../../api/queries/savedJobQueries';
import { useToggleSaveJob } from '../../hooks/mutations/useSavedJobMutations';
import { useToast } from '../../hooks/useToast';


const SavedJobs = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const { data: savedJobs = [], isLoading: loading } = useQuery(savedJobQueries.my());

    // Toggle save mutation
    const toggleSaveMutation = useToggleSaveJob();

    const handleUnsave = (jobId: string, jobTitle: string) => {
        toggleSaveMutation.mutate(jobId, {
            onSuccess: () => {
                showToast(`Removed "${jobTitle}"`, 'success');
            }
        });
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
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition cursor-pointer group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Go back
                    </button>
                    <h1 className="text-3xl font-semibold text-gray-900 mb-2">Saved Jobs</h1>
                    <p className="text-gray-600">
                        {savedJobs.length} {savedJobs.length === 1 ? 'job' : 'jobs'} saved
                    </p>
                </div>

                {/* Jobs Grid */}
                {savedJobs.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                        <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No saved jobs yet</h3>
                        <p className="text-gray-600 mb-6">
                            Browse jobs and click the bookmark icon to save them for later
                        </p>
                        <button
                            onClick={() => navigate('/jobs')}
                            className="px-6 py-2 bg-black text-white font-medium rounded hover:bg-gray-800 transition"
                        >
                            Browse Jobs
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {savedJobs.map((job: any) => (
                            <Link
                                key={job._id}
                                to={`/job/${job._id}`}
                                className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
                                        {job.title}
                                    </h3>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleUnsave(job._id, job.title);
                                        }}
                                        className="ml-2 p-1 text-green-600 hover:text-red-600 transition"
                                        title="Unsave job"
                                    >
                                        <Bookmark className="w-5 h-5 fill-current" />
                                    </button>
                                </div>

                                {/* Company Logo and Name */}
                                <div className="flex items-center gap-3 mb-4">
                                    {job.createdBy.profile?.company?.logo ? (
                                        <img
                                            src={job.createdBy.profile.company.logo}
                                            alt={job.createdBy.profile.company.name}
                                            className="w-10 h-10 rounded object-cover"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center">
                                            <Building2 className="w-5 h-5 text-gray-500" />
                                        </div>
                                    )}
                                    <p className="text-sm font-medium text-gray-700">
                                        {job.createdBy.profile?.company?.name || 'Company'}
                                    </p>
                                </div>


                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <IndianRupee className="w-4 h-4" />
                                        ₹{job.salary.toLocaleString()}/year
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <MapPin className="w-4 h-4" />
                                        {job.location}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <Clock className="w-4 h-4" />
                                        {job.jobType}
                                    </div>
                                </div>

                                <p className="text-sm text-gray-600 line-clamp-2">
                                    {job.description}
                                </p>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedJobs;
