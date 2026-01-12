import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, MapPin, IndianRupee, Clock, Calendar, Building2, Loader2 } from 'lucide-react';
import { jobApi } from '../../api/jobApi';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import ApplyModal from '../../components/common/ApplyModal';

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
    createdBy: {
        _id: string;
        fullname: string;
        email: string;
        profile: {
            company: {
                name: string;
                description: string;
                website: string;
                logo: string;
            };
        };
    };
};

const JobDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const { showToast } = useToast();

    useEffect(() => {
        const fetchJob = async () => {
            if (!id) return;

            try {
                setLoading(true);
                const data = await jobApi.getJobById(id);
                if (data.success) {
                    setJob(data.job);
                } else {
                    setError('Job not found');
                }
            } catch (err: any) {
                setError(err.message || 'Failed to load job details');
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [id]);

    const handleApplyClick = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (user.role === 'recruiter') {
            showToast('Recruiters cannot apply for jobs', 'error');
            return;
        }
        setShowApplyModal(true);
    };

    const handleApplicationSuccess = () => {
        setSuccessMessage('Application submitted successfully!');
        setTimeout(() => setSuccessMessage(''), 5000);
        if (id) {
            jobApi.getJobById(id).then(data => {
                if (data.success) setJob(data.job);
            });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Job Not Found</h2>
                    <p className="text-gray-600 mb-6">{error || 'The job you\'re looking for doesn\'t exist.'}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 bg-black text-white text-sm rounded hover:bg-gray-800"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-black mb-6 text-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>

                {/* Success Message */}
                {successMessage && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
                        {successMessage}
                    </div>
                )}

                {/* Job Header */}
                <div className="bg-white border border-gray-200 rounded-lg p-8 mb-6">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex gap-4 flex-1">
                            {/* Company Logo or Icon */}
                            {job.createdBy.profile?.company?.logo ? (
                                <img
                                    src={job.createdBy.profile.company.logo}
                                    alt={job.createdBy.profile.company.name || 'Company'}
                                    className="w-16 h-16 rounded-xl object-cover border border-gray-200 flex-shrink-0"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center border border-gray-200 flex-shrink-0">
                                    <Building2 className="w-8 h-8 text-gray-400" />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <h1 className="text-3xl font-semibold text-gray-900 mb-2">{job.title}</h1>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Building2 className="w-4 h-4" />
                                    <span>{job.createdBy.profile?.company?.name || 'Company'}</span>
                                </div>
                            </div>
                        </div>
                        <span className={`px-3 py-1 text-xs font-medium rounded ${job.status === 'open'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                            }`}>
                            {job.status === 'open' ? 'Open' : 'Closed'}
                        </span>
                    </div>

                    {/* Quick Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-gray-100">
                        <div>
                            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                                <IndianRupee className="w-4 h-4" />
                                Salary
                            </div>
                            <div className="font-medium text-gray-900">₹{job.salary.toLocaleString()}/year</div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                                <MapPin className="w-4 h-4" />
                                Location
                            </div>
                            <div className="font-medium text-gray-900">{job.location}</div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                                <Clock className="w-4 h-4" />
                                Type
                            </div>
                            <div className="font-medium text-gray-900">{job.jobType}</div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                                <Calendar className="w-4 h-4" />
                                Experience
                            </div>
                            <div className="font-medium text-gray-900">{job.experience} years</div>
                        </div>
                    </div>
                </div>

                {/* Apply Button */}
                {job.status === 'open' && user?.role !== 'recruiter' && (
                    <div className="mb-6">
                        <button
                            onClick={handleApplyClick}
                            className="w-full py-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition"
                        >
                            Apply for this Position
                        </button>
                    </div>
                )}

                {/* Job Description */}
                <div className="bg-white border border-gray-200 rounded-lg p-8 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Description</h2>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{job.description}</p>
                </div>

                {/* Requirements */}
                {job.requirements && job.requirements.length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-lg p-8 mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h2>
                        <ul className="space-y-2">
                            {job.requirements.map((req, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <div className="mt-2 w-1 h-1 rounded-full bg-gray-400 flex-shrink-0" />
                                    <span className="text-gray-700">{req}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Additional Info */}
                <div className="bg-white border border-gray-200 rounded-lg p-8 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="text-sm text-gray-500 mb-1">Positions Available</div>
                            <div className="font-medium text-gray-900">{job.position}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500 mb-1">Applicants</div>
                            <div className="font-medium text-gray-900">{job.applications?.length || 0}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500 mb-1">Posted On</div>
                            <div className="font-medium text-gray-900">
                                {new Date(job.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500 mb-1">Posted By</div>
                            <div className="font-medium text-gray-900">{job.createdBy.fullname}</div>
                        </div>
                    </div>
                </div>

                {/* Company Info */}
                {job.createdBy.profile?.company && (
                    <div className="bg-white border border-gray-200 rounded-lg p-8">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">About the Company</h2>
                        <h3 className="font-medium text-gray-900 mb-2">
                            {job.createdBy.profile.company.name}
                        </h3>
                        {job.createdBy.profile.company.description && (
                            <p className="text-gray-700 mb-4">{job.createdBy.profile.company.description}</p>
                        )}
                        {job.createdBy.profile.company.website && (
                            <a
                                href={job.createdBy.profile.company.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700 text-sm"
                            >
                                Visit Website →
                            </a>
                        )}
                    </div>
                )}

                {/* Apply Modal */}
                {showApplyModal && job && (
                    <ApplyModal
                        jobId={job._id}
                        jobTitle={job.title}
                        onClose={() => setShowApplyModal(false)}
                        onSuccess={handleApplicationSuccess}
                    />
                )}
            </div>
        </div>
    );
};

export default JobDetails;
