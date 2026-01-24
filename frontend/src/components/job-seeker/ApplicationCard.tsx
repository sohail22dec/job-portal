import { Mail, Phone, FileText } from 'lucide-react';
import { CoverLetterSection } from './CoverLetterSection';

interface Applicant {
    fullname: string;
    email: string;
    phoneNumber?: string;
}

interface Application {
    _id: string;
    applicant: Applicant;
    status: string;
    coverLetter?: string;
    resume?: string;
    createdAt: string;
}

interface ApplicationCardProps {
    application: Application;
    isPending: boolean;
    updateStatus: (applicationId: string, newStatus: string) => void;
}

const getStatusBadge = (status: string) => {
    const badges = {
        pending: { text: 'Pending', class: 'bg-gray-100 text-gray-800' },
        reviewing: { text: 'Reviewing', class: 'bg-blue-100 text-blue-800' },
        accepted: { text: 'Accepted', class: 'bg-green-100 text-green-800' },
        rejected: { text: 'Rejected', class: 'bg-red-100 text-red-800' }
    };
    return badges[status as keyof typeof badges] || badges.pending;
};

export const ApplicationCard = ({ application, isPending, updateStatus }: ApplicationCardProps) => {
    const badge = getStatusBadge(application.status);
    return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{application.applicant.fullname}</h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            <a href={`mailto:${application.applicant.email}`} className="flex items-center gap-1 hover:text-black">
                                <Mail className="w-4 h-4" />
                                {application.applicant.email}
                            </a>
                            {application.applicant.phoneNumber && (
                                <div className="flex items-center gap-1">
                                    <Phone className="w-4 h-4" />
                                    {application.applicant.phoneNumber}
                                </div>
                            )}
                        </div>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded ${badge.class}`}>
                        {badge.text}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="px-6 py-4">
                {/* Cover Letter */}
                {application.coverLetter && (
                    <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Cover Letter</h4>
                        <CoverLetterSection coverLetter={application.coverLetter} />
                    </div>
                )}

                {/* Resume */}
                {application.resume && (
                    <div className="mb-4">
                        <a
                            href={application.resume}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 hover:border-gray-300 transition-all shadow-sm group"
                        >
                            <FileText className="w-4 h-4 text-gray-500 group-hover:text-blue-600 transition-colors" />
                            View Resume
                        </a>
                    </div>
                )}

                <div className="text-xs text-gray-500 mb-4">
                    Applied {new Date(application.createdAt).toLocaleDateString()}
                </div>

                {/* Actions - Status Dropdown */}
                <div>
                    <select
                        id={`status-${application._id}`}
                        value={application.status}
                        onChange={(e) => updateStatus(application._id, e.target.value)}
                        disabled={isPending}
                        className={`px-4 py-2 text-sm font-medium rounded border-0 outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors
                            ${application.status === 'pending' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : ''}
                            ${application.status === 'reviewing' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' : ''}
                            ${application.status === 'accepted' ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''}
                            ${application.status === 'rejected' ? 'bg-red-100 text-red-800 hover:bg-red-200' : ''}
                        `}
                    >
                        <option value="pending">📋 Pending</option>
                        <option value="reviewing">👀 Reviewing</option>
                        <option value="accepted">✅ Accepted</option>
                        <option value="rejected">❌ Rejected</option>
                    </select>
                </div>
            </div>
        </div>
    );
};
