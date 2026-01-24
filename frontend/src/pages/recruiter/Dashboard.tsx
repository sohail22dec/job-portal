import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Briefcase, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../hooks/useAuth';
import { jobQueries } from '../../api/queries/jobQueries';
import DeleteJobModal from '../../components/recruiter/DeleteJobModal';
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
    applicationsCount: number;
};

const RecruiterDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
    const { user } = useAuth();

    const { data: jobs = [], isLoading: loading } = useQuery(jobQueries.recruiter());

    const isProfileComplete = user?.profile?.company?.description && user?.profile?.company?.website;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold text-gray-900">Recruiter Dashboard</h1>
                    <p className="text-gray-600 mt-1">Welcome back, {user?.fullname}</p>
                </div>
                {!isProfileComplete && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-semibold text-yellow-900 mb-1">Complete Your Company Profile</h3>
                            <p className="text-sm text-yellow-700">Add your company description and website to start posting jobs</p>
                        </div>
                        <button
                            onClick={() => navigate('/company-profile')}
                            className="px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded hover:bg-yellow-700 transition whitespace-nowrap"
                        >
                            Complete Profile
                        </button>
                    </div>
                )}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                        <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            No jobs posted yet
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Get started by posting your first job
                        </p>
                        <button
                            onClick={() => navigate('/post-job')}
                            className="px-4 py-2 bg-black text-white text-sm font-medium rounded hover:bg-gray-800"
                        >
                            Post a Job
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {jobs.map((job: any) => (
                            <JobCard
                                key={job._id}
                                job={job}
                                variant="recruiter"
                                onEdit={(job) => navigate(`/edit-job/${job._id}`)}
                                onDelete={(job) => setJobToDelete(job)}
                            />
                        ))}
                    </div>
                )}

                {jobToDelete && (
                    <DeleteJobModal
                        jobId={jobToDelete._id}
                        jobTitle={jobToDelete.title}
                        onSuccess={() => {
                            setJobToDelete(null);
                        }}
                        onCancel={() => setJobToDelete(null)}
                    />
                )}
            </div>
        </div>
    );
};

export default RecruiterDashboard;
