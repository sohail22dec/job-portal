import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Edit } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { useUpdateCompanyProfile } from '../../hooks/mutations/useCompanyMutations';
import CompanyProfileView from '../../components/recruiter/CompanyProfileView';
import CompanyProfileForm from '../../components/recruiter/CompanyProfileForm';


const CompanyProfile = () => {
    const navigate = useNavigate();
    const { user, refetchUser } = useAuth();
    const { showToast } = useToast();
    const [isEditMode, setIsEditMode] = useState(false);
    const [logoPreview, setLogoPreview] = useState<string | null>(
        user?.profile?.company?.logo || null
    );
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const hasCompanyData = user?.profile?.company?.description || user?.profile?.company?.website;

    // TanStack Query mutation
    const updateProfileMutation = useUpdateCompanyProfile();

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                showToast('Please select an image file', 'error');
                return;
            }
            // Validate file size (500KB)
            if (file.size > 500 * 1024) {
                showToast('Image must be less than 500KB', 'error');
                return;
            }
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const removeLogo = () => {
        setLogoFile(null);
        setLogoPreview(user?.profile?.company?.logo || null);
    };

    const handleCancel = () => {
        setIsEditMode(false);
        setLogoFile(null);
        setLogoPreview(user?.profile?.company?.logo || null);
    };

    const handleSubmit = (data: { description: string; website: string }) => {
        const formData = new FormData();
        formData.append('description', data.description);
        formData.append('website', data.website);
        if (logoFile) {
            formData.append('logo', logoFile);
        }

        updateProfileMutation.mutate(formData, {
            onSuccess: () => {
                refetchUser();
                setIsEditMode(false);
                setLogoFile(null);
            },
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto px-6">
                {/* Header */}
                <button
                    onClick={() => navigate('/recruiter-dashboard')}
                    className="flex items-center gap-2 text-gray-600 hover:text-black mb-6 text-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </button>

                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-semibold text-gray-900 mb-2">Recruiter Profile</h1>
                            <p className="text-gray-600">
                                {isEditMode ? 'Update your company information' : 'View and manage your company information'}
                            </p>
                        </div>
                        {!isEditMode && hasCompanyData && (
                            <button
                                onClick={() => setIsEditMode(true)}
                                className="px-4 py-2 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 transition flex items-center gap-2"
                            >
                                <Edit className="w-4 h-4" />
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>

                {/* View or Edit Mode */}
                {!isEditMode && hasCompanyData ? (
                    <CompanyProfileView
                        userName={user?.fullname}
                        userEmail={user?.email}
                        userRole={user?.role}
                        logoUrl={logoPreview || undefined}
                        companyName={user?.profile?.company?.name}
                        website={user?.profile?.company?.website}
                        description={user?.profile?.company?.description}
                    />
                ) : (
                    <CompanyProfileForm
                        user={user}
                        logoPreview={logoPreview}
                        isPending={updateProfileMutation.isPending}
                        hasCompanyData={hasCompanyData}
                        onLogoChange={handleLogoChange}
                        onRemoveLogo={removeLogo}
                        onCancel={handleCancel}
                        onSubmit={handleSubmit}
                    />
                )}
            </div>
        </div>
    );
};

export default CompanyProfile;
