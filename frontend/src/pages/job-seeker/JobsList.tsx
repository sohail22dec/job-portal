import { useState, useMemo } from 'react';
import { Loader2, Search, X, Briefcase } from 'lucide-react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { jobQueries } from '../../api/queries/jobQueries';
import JobCard from '../../components/JobCard';
import JobFilters from '../../components/job-seeker/JobFilters';

const Jobs = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeSearch, setActiveSearch] = useState('');
    const [filters, setFilters] = useState({
        location: 'All',
        experienceLevel: 'All',
        jobType: 'All'
    });

    const {
        data,
        isLoading: loading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteQuery(jobQueries.infiniteList(activeSearch));

    // Flatten all pages into a single jobs array
    const allJobs = useMemo(() => {
        return data?.pages.flatMap(page => page.jobs) || [];
    }, [data]);


    // Apply filters to jobs
    const filteredJobs = useMemo(() => {
        return allJobs.filter((job: any) => {
            // Location filter
            if (filters.location !== 'All') {
                if (!job.location.toLowerCase().includes(filters.location.toLowerCase())) {
                    return false;
                }
            }

            // Experience filter
            if (filters.experienceLevel !== 'All') {
                if (filters.experienceLevel === '0-2 years' && job.experience > 2) return false;
                if (filters.experienceLevel === '3-5 years' && (job.experience < 3 || job.experience > 5)) return false;
                if (filters.experienceLevel === '5+ years' && job.experience < 5) return false;
            }

            // Job type filter
            if (filters.jobType !== 'All') {
                if (job.jobType !== filters.jobType) return false;
            }

            return true;
        });
    }, [allJobs, filters]);

    const handleSearch = () => {
        setActiveSearch(searchQuery);
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setActiveSearch('');
    };

    const handleFilterChange = (filterName: string, value: string) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
    };

    const clearAllFilters = () => {
        setFilters({
            location: 'All',
            experienceLevel: 'All',
            jobType: 'All'
        });
    };

    const hasActiveFilters = filters.location !== 'All' ||
        filters.experienceLevel !== 'All' ||
        filters.jobType !== 'All';

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">Browse Jobs</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        {filteredJobs.length} {filteredJobs.length === 1 ? 'position' : 'positions'}
                        {hasActiveFilters && ' (filtered)'}
                    </p>
                </div>

                {/* Search Bar */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by job title or description..."
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

                {/* Filters */}
                <JobFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearAll={clearAllFilters}
                />

                {/* Jobs List */}
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                    </div>
                ) : filteredJobs.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                        <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                            {hasActiveFilters || activeSearch ? 'No jobs match your criteria' : 'No open jobs available'}
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                            {hasActiveFilters || activeSearch ? 'Try adjusting your filters or search' : 'Check back later for new opportunities'}
                        </p>
                        {hasActiveFilters && (
                            <button
                                onClick={clearAllFilters}
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Clear all filters
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="space-y-3">
                            {filteredJobs.map((job: any) => (
                                <JobCard
                                    key={job._id}
                                    job={job}
                                    variant="seeker"
                                />
                            ))}
                        </div>

                        {/* Load More Button */}
                        {hasNextPage && (
                            <div className="mt-6 text-center">
                                <button
                                    onClick={() => fetchNextPage()}
                                    disabled={isFetchingNextPage}
                                    className="px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                                >
                                    {isFetchingNextPage ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Loading more jobs...
                                        </>
                                    ) : (
                                        <>Load More Jobs</>
                                    )}
                                </button>
                            </div>
                        )}

                        {!hasNextPage && allJobs.length > 0 && (
                            <p className="text-center text-sm text-gray-500 mt-6">
                                You've reached the end of the list
                            </p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Jobs;

