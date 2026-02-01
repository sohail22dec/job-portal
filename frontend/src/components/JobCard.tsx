import { Link, useNavigate } from 'react-router';
import { MapPin, IndianRupee, Building2, Users, Edit, Trash2, Clock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { formatSalary } from '../utils/format';

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

type JobCardProps = {
    job: Job;
    variant?: 'recruiter' | 'seeker';
    onEdit?: (job: Job) => void;
    onDelete?: (job: Job) => void;
};

const JobCard = ({ job, variant = 'seeker', onEdit, onDelete }: JobCardProps) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const isRecruiterView = variant === 'recruiter';

    const handleCardClick = () => {
        navigate(`/job/${job._id}`);
    };

    return (
        <div
            onClick={handleCardClick}
            className="block bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition cursor-pointer"
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    {/* Logo and Title */}
                    <div className="flex items-center gap-3 mb-3">
                        {/* Company Logo */}
                        {(isRecruiterView ? user?.profile?.company?.logo : job.createdBy?.profile?.company?.logo) ? (
                            <img
                                src={isRecruiterView ? user?.profile?.company?.logo : job.createdBy?.profile?.company?.logo}
                                alt={(isRecruiterView ? user?.profile?.company?.name : job.createdBy?.profile?.company?.name) || 'Company'}
                                loading="lazy"
                                className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                                <Building2 className="w-6 h-6 text-gray-400" />
                            </div>
                        )}
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                                {/* Status badge - recruiter only */}
                                {isRecruiterView && (
                                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${job.status === 'open'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {job.status === 'open' ? 'Open' : 'Closed'}
                                    </span>
                                )}
                            </div>
                            {/* Company Name */}
                            {(isRecruiterView ? user?.profile?.company?.name : job.createdBy?.profile?.company?.name) && (
                                <p className="text-sm text-gray-500 mt-0.5">
                                    {isRecruiterView ? user?.profile?.company?.name : job.createdBy?.profile?.company?.name}
                                </p>
                            )}
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{job.description}</p>
                </div>

                {/* Edit/Delete actions - recruiter only */}
                {isRecruiterView && (
                    <div className="flex gap-2">
                        <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit?.(job); }}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded transition cursor-pointer"
                            title="Edit job"
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                        <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete?.(job); }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
                            title="Delete job"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* Job details */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{job.location}</span>
                </div>
                <div className="flex items-center">
                    <IndianRupee className="w-3.5 h-3.5" />
                    <span>{formatSalary(job.salary)}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{job.jobType}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{job.experience} years exp</span>
                </div>
                {isRecruiterView && (
                    <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        <span>{job.applicationsCount || 0} applicants</span>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-500">
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                </span>
                <div className="flex gap-3">
                    {isRecruiterView && (
                        <Link
                            to={`/job/${job._id}/applicants`}
                            className="text-sm text-gray-600 font-medium flex items-center gap-1 hover:text-gray-900"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Users className="w-4 h-4" />
                            View Applicants ({job.applicationsCount || 0})
                        </Link>)}
                </div>
            </div>
        </div>
    );
};

export default JobCard;
