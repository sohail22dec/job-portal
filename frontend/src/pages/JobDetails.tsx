import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, MapPin, IndianRupee, Briefcase, Users, Building2, Loader2, CheckCircle } from 'lucide-react';
import { jobApi } from '../api/jobApi';
import { useAuth } from '../hooks/useAuth';
import ApplyModal from '../components/common/ApplyModal';

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
            alert('Recruiters cannot apply for jobs');
            return;
        }
        setShowApplyModal(true);
    };

    const handleApplicationSuccess = () => {
        setSuccessMessage('Application submitted successfully!');
        setTimeout(() => setSuccessMessage(''), 5000);
        // Refresh job to update applicant count
        if (id) {
            jobApi.getJobById(id).then(data => {
                if (data.success) setJob(data.job);
            });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h2>
                    <p className="text-gray-600 mb-6">{error || 'The job you\'re looking for doesn\'t exist.'}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </button>

                {/* Job Header */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">{job.title}</h1>
                                <div className="flex items-center gap-2 text-blue-100">
                                    <Building2 className="w-5 h-5" />
                                    <span className="text-lg">{job.createdBy.profile?.company?.name || 'Company'}</span>
                                </div>
                            </div>
                            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${job.status === 'open'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                                }`}>
                                {job.status === 'open' ? '🟢 Open' : '🔴 Closed'}
                            </span>
                        </div>
                    </div>

                    {/* Quick Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-8 py-6 bg-gray-50 border-t border-gray-200">
                        <div className="flex items-center gap-2">
                            <IndianRupee className="w-5 h-5 text-gray-600" />
                            <div>
                                <p className="text-xs text-gray-500">Salary</p>
                                <p className="font-semibold text-gray-900">₹{job.salary.toLocaleString()}/year</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-gray-600" />
                            <div>
                                <p className="text-xs text-gray-500">Location</p>
                                <p className="font-semibold text-gray-900">{job.location}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-gray-600" />
                            <div>
                                <p className="text-xs text-gray-500">Job Type</p>
                                <p className="font-semibold text-gray-900">{job.jobType}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-gray-600" />
                            <div>
                                <p className="text-xs text-gray-500">Applicants</p>
                                <p className="font-semibold text-gray-900">{job.applications?.length || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Apply Button */}
                {job.status === 'open' && user?.role !== 'recruiter' && (
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6">
                        <button
                            onClick={handleApplyClick}
                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg rounded-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                        >
                            Apply for this Position
                        </button>
                    </div>
                )}

                {/* Success Message */}
                {successMessage && (
                    <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 z-50">
                        <CheckCircle className="w-6 h-6" />
                        <span className="font-semibold">{successMessage}</span>
                    </div>
                )}

                {/* Job Details */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Job Description</h2>
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">{job.description}</p>
                </div>

                {/* Requirements */}
                {job.requirements && job.requirements.length > 0 && (
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Requirements</h2>
                        <ul className="space-y-2">
                            {job.requirements.map((req, index) => (
                                <li key={index} className="flex items-start gap-2">
                                    <div className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0" />
                                    <span className="text-gray-700">{req}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Additional Info */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Additional Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Experience Required</p>
                            <p className="text-gray-900 font-medium">{job.experience} years</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Positions Available</p>
                            <p className="text-gray-900 font-medium">{job.position}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Posted On</p>
                            <p className="text-gray-900 font-medium">
                                {new Date(job.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Posted By</p>
                            <p className="text-gray-900 font-medium">{job.createdBy.fullname}</p>
                        </div>
                    </div>
                </div>

                {/* Company Info */}
                {job.createdBy.profile?.company && (
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 mt-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">About the Company</h2>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
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
                                className="text-blue-600 hover:text-blue-700 font-medium"
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
