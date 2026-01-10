import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Briefcase, Plus, MapPin, IndianRupee, Users, Edit, Trash2, Loader2, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { jobApi } from '../api/jobApi';
import PostJobModal from '../components/recruiter/PostJobModal';
import DeleteJobModal from '../components/recruiter/DeleteJobModal';
import DashboardStats from '../components/recruiter/DashboardStats';

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
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [showJobModal, setShowJobModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
    const { user } = useAuth();

    // Fetch recruiter's jobs
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

    // Calculate stats
    const totalJobs = jobs.length;
    const activeJobs = jobs.filter(job => job.status === 'open').length;
    const totalApplicants = jobs.reduce((sum, job) => sum + (job.applications?.length || 0), 0);

    // Filter jobs by search query
    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Recruiter Dashboard</h1>
                    <p className="text-gray-600 mt-2">Welcome back, {user?.fullname}! Manage your job postings</p>
                </div>

                <DashboardStats
                    totalJobs={totalJobs}
                    totalApplicants={totalApplicants}
                    activeJobs={activeJobs}
                />

                {/* Actions Bar */}
                <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden mb-6">
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Briefcase className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search your jobs by title..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    </button>
                                )}
                            </div>

                            {/* Post Job Button */}
                            <button
                                onClick={() => {
                                    setSelectedJob(null);
                                    setShowJobModal(true);
                                }}
                                className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-300 transition-all hover:-translate-y-0.5 hover:scale-105 md:w-auto w-full"
                            >
                                <Plus className="w-5 h-5" />
                                Post New Job
                            </button>
                        </div>

                        {/* Results Count */}
                        {searchQuery && (
                            <div className="mt-4 text-sm text-gray-600">
                                Found <span className="font-semibold text-gray-900">{filteredJobs.length}</span> job{filteredJobs.length !== 1 ? 's' : ''} matching "{searchQuery}"
                            </div>
                        )}
                    </div>
                </div>

                {/* Jobs List */}
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                ) : filteredJobs.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-100">
                        <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
                        <p className="text-gray-600 mb-6">
                            {searchQuery ? 'Try a different search term' : 'Start by posting your first job'}
                        </p>
                        {!searchQuery && (
                            <button
                                onClick={() => {
                                    setSelectedJob(null);
                                    setShowJobModal(true);
                                }}
                                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                            >
                                Post Your First Job
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {filteredJobs.map((job) => (
                            <div key={job._id} className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${job.status === 'open'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                                }`}>
                                                {job.status === 'open' ? '🟢 Open' : '🔴 Closed'}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 line-clamp-2 mb-4">{job.description}</p>

                                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <IndianRupee className="w-4 h-4" />
                                                <span>₹{job.salary.toLocaleString()}/year</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                <span>{job.location}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Briefcase className="w-4 h-4" />
                                                <span>{job.jobType}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Users className="w-4 h-4" />
                                                <span>{job.applications?.length || 0} applicants</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 ml-4">
                                        <button
                                            onClick={() => {
                                                setSelectedJob(job);
                                                setShowJobModal(true);
                                            }}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                            title="Edit job"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => setJobToDelete(job)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                            title="Delete job"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <span className="text-sm text-gray-500">
                                        Posted {new Date(job.createdAt).toLocaleDateString()}
                                    </span>
                                    <Link
                                        to={`/job/${job._id}`}
                                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                                    >
                                        View Details →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Job Modal (Create/Edit) */}
                {showJobModal && (
                    <PostJobModal
                        job={selectedJob || undefined}
                        onClose={() => {
                            setShowJobModal(false);
                            setSelectedJob(null);
                        }}
                        onJobPosted={() => {
                            fetchJobs();
                            setShowJobModal(false);
                            setSelectedJob(null);
                        }}
                    />
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
