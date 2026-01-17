import { useState } from 'react';
import { Link } from 'react-router';
import { Briefcase, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../hooks/useAuth';
import { applicationQueries } from '../../api/queries/applicationQueries';

// Type is inferred from useMyApplications hook

type FilterTab = 'all' | 'pending' | 'reviewing' | 'accepted' | 'rejected';

const JobSeekerDashboard = () => {
    const [activeTab, setActiveTab] = useState<FilterTab>('all');
    const { user } = useAuth();

    const { data: applications = [], isLoading: loading } = useQuery(applicationQueries.my());

    // Filter applications based on active tab
    const filteredApplications = activeTab === 'all'
        ? applications
        : applications.filter((app: any) => app.status === activeTab);

    // Calculate stats for tabs
    const stats = {
        all: applications.length,
        pending: applications.filter((app: any) => app.status === 'pending').length,
        reviewing: applications.filter((app: any) => app.status === 'reviewing').length,
        accepted: applications.filter((app: any) => app.status === 'accepted').length,
        rejected: applications.filter((app: any) => app.status === 'rejected').length,
    };

    const tabs: { key: FilterTab; label: string }[] = [
        { key: 'all', label: 'All' },
        { key: 'pending', label: 'Pending' },
        { key: 'reviewing', label: 'Reviewing' },
        { key: 'accepted', label: 'Accepted' },
        { key: 'rejected', label: 'Rejected' },
    ];

    const getStatusBadge = (status: string) => {
        const styles = {
            pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
            reviewing: 'bg-blue-50 text-blue-700 border-blue-200',
            accepted: 'bg-green-50 text-green-700 border-green-200',
            rejected: 'bg-red-50 text-red-700 border-red-200'
        };

        return (
            <span className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-medium ${styles[status as keyof typeof styles]}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">My Applications</h1>
                    <p className="text-sm text-gray-600 mt-1">Welcome back, {user?.fullname}</p>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 mb-6">
                    <div className="flex">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`px-6 py-3 text-sm font-medium transition relative ${activeTab === tab.key
                                    ? 'text-gray-900 border-b-2 border-gray-900'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                {tab.label}
                                {stats[tab.key] > 0 && (
                                    <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                                        {stats[tab.key]}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                    </div>
                ) : filteredApplications.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                        <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No applications found</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            {activeTab === 'all'
                                ? 'Start browsing jobs and apply to your dream role'
                                : `You don't have any ${activeTab} applications`}
                        </p>
                        {activeTab === 'all' && (
                            <Link
                                to="/jobs"
                                className="inline-block px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition"
                            >
                                Browse Jobs
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
                        {filteredApplications.map((application: any) => (
                            <div key={application._id} className="p-5 hover:bg-gray-50 transition">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Link
                                                to={`/job/${application.job._id}`}
                                                className="text-base font-semibold text-gray-900 hover:text-gray-700 transition"
                                            >
                                                {application.job.title}
                                            </Link>
                                            {getStatusBadge(application.status)}
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">
                                            {application.job.createdBy.fullname}
                                        </p>
                                        <div className="flex gap-4 text-xs text-gray-500">
                                            <span>{application.job.location}</span>
                                            <span>₹{application.job.salary.toLocaleString()}/year</span>
                                            <span>Applied {new Date(application.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobSeekerDashboard;
