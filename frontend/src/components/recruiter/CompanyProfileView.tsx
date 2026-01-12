import { Building2, Globe, FileText, User, Mail, Shield } from 'lucide-react';

type CompanyProfileViewProps = {
    userName?: string;
    userEmail?: string;
    userRole?: string;
    logoUrl?: string;
    companyName?: string;
    website?: string;
    description?: string;
};

const CompanyProfileView = ({
    userName,
    userEmail,
    userRole,
    logoUrl,
    companyName,
    website,
    description
}: CompanyProfileViewProps) => {
    return (
        <div className="space-y-6">
            {/* User Information Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Account Information</h3>

                <div className="space-y-4">
                    {/* Full Name */}
                    <div>
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <User className="w-4 h-4" />
                            Full Name
                        </div>
                        <p className="text-gray-900">{userName || 'Not set'}</p>
                    </div>

                    {/* Email */}
                    <div>
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Mail className="w-4 h-4" />
                            Email
                        </div>
                        <p className="text-gray-900">{userEmail || 'Not set'}</p>
                    </div>

                    {/* Role */}
                    <div>
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Shield className="w-4 h-4" />
                            Role
                        </div>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            {userRole === 'recruiter' ? 'Recruiter' : userRole === 'job_seeker' ? 'Job Seeker' : 'Not set'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Company Information Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Company Information</h3>

                {/* Company Logo */}
                <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Company Logo</h4>
                    {logoUrl ? (
                        <img
                            src={logoUrl}
                            alt="Company logo"
                            className="w-24 h-24 rounded-lg object-cover border border-gray-200"
                        />
                    ) : (
                        <div className="w-24 h-24 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                            <Building2 className="w-12 h-12 text-gray-400" />
                        </div>
                    )}
                </div>

                {/* Company Name */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Building2 className="w-4 h-4" />
                        Company Name
                    </div>
                    <p className="text-gray-900">{companyName || 'Not set'}</p>
                </div>

                {/* Website */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Globe className="w-4 h-4" />
                        Website
                    </div>
                    {website ? (
                        <a
                            href={website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 hover:underline"
                        >
                            {website}
                        </a>
                    ) : (
                        <p className="text-gray-500">Not set</p>
                    )}
                </div>

                {/* Description */}
                <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <FileText className="w-4 h-4" />
                        Company Description
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {description || 'No description provided'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CompanyProfileView;
