import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Upload, X, Loader2 } from 'lucide-react';
import { companyProfileSchema, type CompanyProfileFormData } from '../../schemas/companyProfileSchema';

type User = {
    profile?: {
        company?: {
            name?: string;
            website?: string;
            description?: string;
            logo?: string;
        };
    };
};

type CompanyProfileFormProps = {
    user: User | null;
    logoPreview: string | null;
    isPending: boolean;
    hasCompanyData: boolean;
    onLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveLogo: () => void;
    onCancel: () => void;
    onSubmit: (data: CompanyProfileFormData) => void;
};

const CompanyProfileForm = ({
    user,
    logoPreview,
    isPending,
    hasCompanyData,
    onLogoChange,
    onRemoveLogo,
    onCancel,
    onSubmit
}: CompanyProfileFormProps) => {
    const { register, handleSubmit, formState: { errors } } = useForm<CompanyProfileFormData>({
        resolver: zodResolver(companyProfileSchema),
        defaultValues: {
            website: user?.profile?.company?.website || '',
            description: user?.profile?.company?.description || '',
        },
    });

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-8">
            {/* React Hook Form errors */}
            {(errors.website || errors.description) && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                    {errors.website?.message || errors.description?.message}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Company Logo */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Logo
                    </label>
                    <div className="flex items-start gap-4">
                        {/* Logo Preview */}
                        {logoPreview ? (
                            <div className="relative">
                                <img
                                    src={logoPreview}
                                    alt="Logo preview"
                                    className="w-24 h-24 rounded-lg object-cover border border-gray-200"
                                />
                                <button
                                    type="button"
                                    onClick={onRemoveLogo}
                                    className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="w-24 h-24 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200 border-dashed">
                                <Building2 className="w-8 h-8 text-gray-400" />
                            </div>
                        )}

                        {/* Upload Button */}
                        <div className="flex-1">
                            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded hover:bg-gray-200 transition">
                                <Upload className="w-4 h-4" />
                                {logoPreview ? 'Change Logo' : 'Upload Logo'}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={onLogoChange}
                                    className="hidden"
                                />
                            </label>
                            <p className="text-xs text-gray-500 mt-2">
                                PNG, JPG or WEBP (max. 500KB)
                            </p>
                        </div>
                    </div>
                </div>

                {/* Company Name (Read-only) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name
                    </label>
                    <input
                        type="text"
                        value={user?.profile?.company?.name || ''}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-50 text-gray-500 cursor-not-allowed text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">Set during registration, cannot be changed</p>
                </div>

                {/* Website */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Website
                    </label>
                    <input
                        type="url"
                        {...register('website')}
                        disabled={isPending}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-black outline-none text-sm"
                        placeholder="https://www.example.com"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Description
                    </label>
                    <textarea
                        {...register('description')}
                        rows={6}
                        disabled={isPending}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-black outline-none text-sm resize-none"
                        placeholder="Tell job seekers about your company, culture, and what makes it a great place to work..."
                    />
                    <p className="text-xs text-gray-500 mt-1">Minimum 10 characters</p>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-6 border-t border-gray-200">
                    {hasCompanyData && (
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isPending}
                            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded hover:bg-gray-50 transition text-sm"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={isPending}
                        className="flex-1 px-6 py-3 bg-black text-white font-medium rounded hover:bg-gray-800 transition flex items-center justify-center gap-2 text-sm"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            'Save Changes'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CompanyProfileForm;
