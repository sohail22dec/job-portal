import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Briefcase, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { jobApi } from '../../api/jobApi';
import DeleteJobModal from '../../components/recruiter/DeleteJobModal';
import JobCard from '../../components/recruiter/JobCard';

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
    status: 'open' | 'closed';
    createdAt: string;
    applications: string[];
};

const RecruiterDashboard = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
    const { user } = useAuth();

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const data = await jobApi.getRecruiterJobs();
            if (data.success) {
                setJobs(data.jobs);
            }
        } catch (error) {
            console.error('Failed to fetch jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const isProfileComplete = user?.profile?.company?.description && user?.profile?.company?.website;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold text-gray-900">Recruiter Dashboard</h1>
                    <p className="text-gray-600 mt-1">Welcome back, {user?.fullname}</p>
                </div>

                {/* Profile Completion Banner */}
                {!isProfileComplete && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-semibold text-yellow-900 mb-1">Complete Your Company Profile</h3>
                            <p className="text-sm text-yellow-700">Add your company description and website to start posting jobs</p>
                        </div>
                        <button
                            onClick={() => navigate('/company-profile')}
                            className="px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded hover:bg-yellow-700 transition whitespace-nowrap"
                        >
                            Complete Profile
                        </button>
                    </div>
                )}

                {/* Actions Bar */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                    <div className="flex items-center justify-between gap-4">
                        {/* Search */}
                        <input
                            type="text"
                            placeholder="Search jobs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-black outline-none text-sm flex-1"
                        />

                        {/* Post Job Button */}
                        <button
                            onClick={() => navigate('/post-job')}
                            className="px-4 py-2 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 transition flex items-center gap-2 whitespace-nowrap"
                        >
                            <Plus className="w-4 h-4" />
                            Post New Job
                        </button>
                    </div>
                </div>

                {/* Jobs List */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                    </div>
                ) : filteredJobs.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                        <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {searchQuery ? 'No jobs found' : 'No jobs posted yet'}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {searchQuery ? 'Try a different search term' : 'Get started by posting your first job'}
                        </p>
                        {!searchQuery && (
                            <button
                                onClick={() => navigate('/post-job')}
                                className="px-4 py-2 bg-black text-white text-sm font-medium rounded hover:bg-gray-800"
                            >
                                Post a Job
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredJobs.map((job) => (
                            <JobCard
                                key={job._id}
                                job={job}
                                onEdit={(job) => navigate(`/edit-job/${job._id}`)}
                                onDelete={(job) => setJobToDelete(job)}
                            />
                        ))}
                    </div>
                )}

                {/* Delete Job Confirmation Modal */}
                {jobToDelete && (
                    <DeleteJobModal
                        jobId={jobToDelete._id}
                        jobTitle={jobToDelete.title}
                        onSuccess={() => {
                            setJobs(jobs.filter(job => job._id !== jobToDelete._id));
                            setJobToDelete(null);
                        }}
                        onCancel={() => setJobToDelete(null)}
                    />
                )}
            </div>
        </div>
    );
};

export default RecruiterDashboard;
