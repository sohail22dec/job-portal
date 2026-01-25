import { Link } from 'react-router';
import { MapPin, IndianRupee, Clock, Briefcase, ArrowRight, Building2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { jobQueries } from '../../api/queries/jobQueries';

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
    applicationsCount: number;
    createdBy?: {
        profile?: {
            company?: {
                name?: string;
                logo?: string;
            };
        };
    };
};

const FeaturedJobsSection = () => {
    // Fetch jobs using TanStack Query
    const { data: jobs = [], isLoading, isError } = useQuery(jobQueries.list());

    // Get the first 6 jobs for featured section
    const featuredJobs = jobs.slice(0, 6);

    // Helper to format time ago
    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) return 'Today';
        if (diffInDays === 1) return '1 day ago';
        if (diffInDays < 7) return `${diffInDays} days ago`;
        if (diffInDays < 14) return '1 week ago';
        if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
        return date.toLocaleDateString();
    };

    if (isLoading) {
        return (
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                            Featured <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Opportunities</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Check out the latest job openings from top companies hiring right now.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-gray-100 rounded-2xl p-6 animate-pulse h-64"></div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (isError) {
        return (
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                        Featured <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Opportunities</span>
                    </h2>
                    <p className="text-gray-600">Unable to load jobs at this time. Please try again later.</p>
                </div>
            </section>
        );
    }

    if (featuredJobs.length === 0) {
        return (
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                        Featured <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Opportunities</span>
                    </h2>
                    <p className="text-xl text-gray-600 mb-8">No jobs available at the moment. Check back soon!</p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                        Featured <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Opportunities</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Check out the latest job openings from top companies hiring right now.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {featuredJobs.map((job: Job) => (
                        <Link
                            key={job._id}
                            to={`/job/${job._id}`}
                            className="group bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                            <div className="flex items-start justify-between mb-4">
                                {/* Company Logo */}
                                {job.createdBy?.profile?.company?.logo ? (
                                    <img
                                        src={job.createdBy.profile.company.logo}
                                        alt={job.createdBy.profile.company.name || 'Company'}
                                        className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                                        <Building2 className="w-6 h-6 text-white" />
                                    </div>
                                )}
                                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                                    {job.jobType}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                                {job.title}
                            </h3>
                            {job.createdBy?.profile?.company?.name && (
                                <p className="text-gray-600 font-medium mb-4">{job.createdBy.profile.company.name}</p>
                            )}

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-gray-500 text-sm">
                                    <MapPin className="w-4 h-4 flex-shrink-0" />
                                    <span className="line-clamp-1">{job.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-500 text-sm">
                                    <IndianRupee className="w-4 h-4 flex-shrink-0" />
                                    <span>₹{job.salary.toLocaleString()}/year</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-500 text-sm">
                                    <Clock className="w-4 h-4 flex-shrink-0" />
                                    <span>Posted {getTimeAgo(job.createdAt)}</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                                <span className="text-blue-600 font-medium text-sm group-hover:text-blue-700">View Details</span>
                                <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="text-center">
                    <Link
                        to="/jobs"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-blue-300 transition-all duration-300 hover:-translate-y-1">
                        <Briefcase className="w-5 h-5" />
                        View All Jobs
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FeaturedJobsSection;
