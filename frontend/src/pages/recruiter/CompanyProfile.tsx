import { useActionState, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Edit } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import CompanyProfileView from '../../components/recruiter/CompanyProfileView';
import CompanyProfileForm from '../../components/recruiter/CompanyProfileForm';

type ProfileState = {
    error?: string;
    success?: boolean;
};

const CompanyProfile = () => {
    const navigate = useNavigate();
    const { user, refetchUser } = useAuth();
    const [isEditMode, setIsEditMode] = useState(false);
    const [logoPreview, setLogoPreview] = useState<string | null>(
        user?.profile?.company?.logo || null
    );
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const hasCompanyData = user?.profile?.company?.description || user?.profile?.company?.website;
    const { showToast } = useToast();

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

    const updateProfileAction = async (_prevState: ProfileState, formData: FormData): Promise<ProfileState> => {
        try {
            const description = formData.get('description') as string;
            const website = formData.get('website') as string;

            if (!description || description.trim().length < 10) {
                return { error: 'Description must be at least 10 characters' };
            }

            if (!website || !website.startsWith('http')) {
                return { error: 'Please enter a valid website URL (starting with http:// or https://)' };
            }

            // Create form data for file upload
            const uploadData = new FormData();
            uploadData.append('description', description);
            uploadData.append('website', website);
            if (logoFile) {
                uploadData.append('logo', logoFile);
            }

            const response = await fetch('http://localhost:8000/api/v1/user/update-company-profile', {
                method: 'PUT',
                credentials: 'include',
                body: uploadData,
            });

            const result = await response.json();

            if (!response.ok) {
                return { error: result.message || 'Failed to update profile' };
            }

            // Refetch user data to update context
            await refetchUser();

            // Exit edit mode
            setIsEditMode(false);
            setLogoFile(null);
            showToast('Profile updated successfully!', 'success');

            return { success: true };
        } catch (err: any) {
            return { error: err.message || 'Failed to update profile. Please try again.' };
        }
    };

    const [state, action, isPending] = useActionState(updateProfileAction, { success: false });

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
                        error={state.error}
                        isPending={isPending}
                        hasCompanyData={hasCompanyData}
                        onLogoChange={handleLogoChange}
                        onRemoveLogo={removeLogo}
                        onCancel={handleCancel}
                        formAction={action}
                    />
                )}
            </div>
        </div>
    );
};

export default CompanyProfile;
