import { Link } from 'react-router';
import { MapPin, IndianRupee, Building2, Users, Edit, Trash2, Clock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

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
    createdBy?: {
        profile?: {
            company?: {
                name?: string;
                logo?: string;
            };
        };
    };
};

type JobCardProps = {
    job: Job;
    onEdit: (job: Job) => void;
    onDelete: (job: Job) => void;
};

const JobCard = ({ job, onEdit, onDelete }: JobCardProps) => {
    const { user } = useAuth();

    return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition">
            <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                    {/* Job Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                            {/* Company Logo or Icon */}
                            {user?.profile?.company?.logo ? (
                                <img
                                    src={user.profile.company.logo}
                                    alt={user.profile.company.name || 'Company'}
                                    className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                                    <Building2 className="w-6 h-6 text-gray-400" />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${job.status === 'open'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {job.status === 'open' ? 'Open' : 'Closed'}
                                    </span>
                                </div>
                                {user?.profile?.company?.name && (
                                    <p className="text-sm text-gray-500 mt-0.5">{user.profile.company.name}</p>
                                )}
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <div className="flex items-center">
                                <IndianRupee className="w-4 h-4" />
                                <span>{job.salary.toLocaleString()}/year</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>{job.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{job.jobType}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                <span>{job.applications?.length || 0} applicants</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => onEdit(job)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded transition"
                            title="Edit job"
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onDelete(job)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                            title="Delete job"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500">
                        Posted {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex gap-3">
                        <Link
                            to={`/job/${job._id}/applicants`}
                            className="text-sm text-gray-600 font-medium flex items-center gap-1 hover:text-gray-900"
                        >
                            <Users className="w-4 h-4" />
                            View Applicants ({job.applications?.length || 0})
                        </Link>
                        <Link
                            to={`/job/${job._id}`}
                            className="text-sm text-gray-600 hover:text-gray-900"
                        >
                            View Details →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobCard;
