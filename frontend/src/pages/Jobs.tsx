import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Briefcase, MapPin, IndianRupee, Clock, Loader2, Search, X } from 'lucide-react';
import { jobApi } from '../api/jobApi';

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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Browse Jobs</h1>
                    <p className="text-gray-600 mt-2">Find your next opportunity from {jobs.length} open positions</p>
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-6">
                    <div className="flex gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by job title or location..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                            {searchQuery && (
                                <button
                                    onClick={handleClearSearch}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                        <button
                            onClick={handleSearch}
                            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                        >
                            <Search className="w-5 h-5" />
                            Search
                        </button>
                    </div>
                </div>

                {/* Jobs Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-100">
                        <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {searchQuery ? 'No jobs found' : 'No open jobs available'}
                        </h3>
                        <p className="text-gray-600">
                            {searchQuery ? 'Try a different search term' : 'Check back later for new opportunities'}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {jobs.map((job) => (
                            <div key={job._id} className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <Link
                                            to={`/job/${job._id}`}
                                            className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition"
                                        >
                                            {job.title}
                                        </Link>
                                        <p className="text-gray-600 mt-2 line-clamp-2">{job.description}</p>
                                    </div>
                                    <span className="ml-4 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                        Open
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        <span>{job.location}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <IndianRupee className="w-4 h-4" />
                                        <span>₹{job.salary.toLocaleString()}/year</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Briefcase className="w-4 h-4" />
                                        <span>{job.jobType}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        <span>{job.experience} years exp</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <span className="text-sm text-gray-500">
                                        Posted {new Date(job.createdAt).toLocaleDateString()}
                                    </span>
                                    <Link
                                        to={`/job/${job._id}`}
                                        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Jobs;
