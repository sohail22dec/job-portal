import { useState, useEffect } from 'react';
import { Loader2, Search, X, Briefcase } from 'lucide-react';
import { jobApi } from '../../api/jobApi';
import JobCard from '../../components/JobCard';

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

const Jobs = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async (keyword = '') => {
        try {
            setLoading(true);
            const data = await jobApi.getAllJobs(keyword);
            if (data.success) {
                setJobs(data.jobs.filter((job: Job) => job.status === 'open'));
            }
        } catch (error) {
            console.error('Failed to fetch jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        fetchJobs(searchQuery);
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        fetchJobs('');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">Browse Jobs</h1>
                    <p className="text-sm text-gray-600 mt-1">{jobs.length} open positions</p>
                </div>

                {/* Search Bar */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by job title or location..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none text-sm"
                            />
                            {searchQuery && (
                                <button
                                    onClick={handleClearSearch}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <button
                            onClick={handleSearch}
                            className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition"
                        >
                            Search
                        </button>
                    </div>
                </div>

                {/* Jobs List */}
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                        <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                            {searchQuery ? 'No jobs found' : 'No open jobs available'}
                        </h3>
                        <p className="text-sm text-gray-500">
                            {searchQuery ? 'Try a different search term' : 'Check back later for new opportunities'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {jobs.map((job) => (
                            <JobCard
                                key={job._id}
                                job={job}
                                variant="seeker"
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Jobs;
