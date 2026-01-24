import { Filter, MapPin, Clock, CalendarDays, X } from 'lucide-react';

// Filter options
const LOCATIONS = ['All', 'Remote', 'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Chennai'];
const EXPERIENCE_LEVELS = ['All', '0-2 years', '3-5 years', '5+ years'];
const JOB_TYPES = ['All', 'Full-time', 'Part-time', 'Contract', 'Internship'];

interface JobFiltersProps {
    filters: {
        location: string;
        experienceLevel: string;
        jobType: string;
    };
    onFilterChange: (filterName: string, value: string) => void;
    onClearAll: () => void;
}

const JobFilters = ({ filters, onFilterChange, onClearAll }: JobFiltersProps) => {
    const hasActiveFilters = filters.location !== 'All' ||
        filters.experienceLevel !== 'All' ||
        filters.jobType !== 'All';

    return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
            {/* Filter Header */}
            <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-700" />
                    <h3 className="text-sm font-semibold text-gray-900">Filter Jobs</h3>
                    {hasActiveFilters && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                            {Object.values(filters).filter(v => v !== 'All').length} active
                        </span>
                    )}
                </div>
                {hasActiveFilters && (
                    <button
                        onClick={onClearAll}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition"
                    >
                        <X className="w-3 h-3" />
                        Clear all
                    </button>
                )}
            </div>

            {/* Filter Options */}
            <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Location Filter */}
                    <div className="group">
                        <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-2">
                            <MapPin className="w-3.5 h-3.5 text-gray-500" />
                            Location
                        </label>
                        <div className="relative">
                            <select
                                value={filters.location}
                                onChange={(e) => onFilterChange('location', e.target.value)}
                                className="w-full pl-3 pr-8 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition appearance-none cursor-pointer hover:border-gray-400"
                            >
                                {LOCATIONS.map(loc => (
                                    <option key={loc} value={loc}>
                                        {loc === 'All' ? 'All Locations' : loc}
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                        {filters.location !== 'All' && (
                            <div className="mt-1.5 flex items-center gap-1">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded">
                                    {filters.location}
                                    <button
                                        onClick={() => onFilterChange('location', 'All')}
                                        className="hover:bg-blue-100 rounded-full p-0.5"
                                    >
                                        <X className="w-2.5 h-2.5" />
                                    </button>
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Experience Filter */}
                    <div className="group">
                        <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-2">
                            <CalendarDays className="w-3.5 h-3.5 text-gray-500" />
                            Experience
                        </label>
                        <div className="relative">
                            <select
                                value={filters.experienceLevel}
                                onChange={(e) => onFilterChange('experienceLevel', e.target.value)}
                                className="w-full pl-3 pr-8 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition appearance-none cursor-pointer hover:border-gray-400"
                            >
                                {EXPERIENCE_LEVELS.map(exp => (
                                    <option key={exp} value={exp}>
                                        {exp === 'All' ? 'All Levels' : exp}
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                        {filters.experienceLevel !== 'All' && (
                            <div className="mt-1.5 flex items-center gap-1">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded">
                                    {filters.experienceLevel}
                                    <button
                                        onClick={() => onFilterChange('experienceLevel', 'All')}
                                        className="hover:bg-blue-100 rounded-full p-0.5"
                                    >
                                        <X className="w-2.5 h-2.5" />
                                    </button>
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Job Type Filter */}
                    <div className="group">
                        <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-2">
                            <Clock className="w-3.5 h-3.5 text-gray-500" />
                            Job Type
                        </label>
                        <div className="relative">
                            <select
                                value={filters.jobType}
                                onChange={(e) => onFilterChange('jobType', e.target.value)}
                                className="w-full pl-3 pr-8 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition appearance-none cursor-pointer hover:border-gray-400"
                            >
                                {JOB_TYPES.map(type => (
                                    <option key={type} value={type}>
                                        {type === 'All' ? 'All Types' : type}
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                        {filters.jobType !== 'All' && (
                            <div className="mt-1.5 flex items-center gap-1">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded">
                                    {filters.jobType}
                                    <button
                                        onClick={() => onFilterChange('jobType', 'All')}
                                        className="hover:bg-blue-100 rounded-full p-0.5"
                                    >
                                        <X className="w-2.5 h-2.5" />
                                    </button>
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobFilters;
