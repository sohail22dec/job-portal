import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Briefcase, GraduationCap, Award, Plus, Loader2, Edit2, Save, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useUpdateProfile } from '../../hooks/mutations/useUserMutations';
import { profileSchema, type ProfileFormData } from '../../schemas/profileSchemas';
import { ExperienceFormSection } from './ExperienceFormSection';
import { EducationFormSection } from './EducationFormSection';

const ProfilePage = () => {
    const { user, loading } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [newSkill, setNewSkill] = useState('');

    const updateMutation = useUpdateProfile();

    const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            fullname: '',
            email: '',
            phoneNumber: '',
            bio: '',
            skills: [],
            experience: [],
            education: [{ institute: '', degree: '', fieldOfStudy: '', startYear: '', endYear: '' }]
        }
    });

    const { fields: experienceFields, append: appendExperience, remove: removeExperience } = useFieldArray({
        control,
        name: 'experience'
    });

    const { fields: educationFields, remove: removeEducation } = useFieldArray({
        control,
        name: 'education'
    });

    const skills = watch('skills');

    // Populate form with user data
    useEffect(() => {
        if (user) {
            setValue('fullname', user.fullname || '');
            setValue('email', user.email || '');
            setValue('phoneNumber', (user.phoneNumber as string) || '');
            setValue('bio', user.profile?.bio || '');
            setValue('skills', user.profile?.skills || []);
            setValue('experience', user.profile?.experience || []);
            // Ensure at least one education entry
            const education = user.profile?.education || [];
            setValue('education', education.length > 0 ? education : [{ institute: '', degree: '', fieldOfStudy: '', startYear: '', endYear: '' }]);
        }
    }, [user, setValue]);

    const onSubmit = (data: ProfileFormData) => {
        updateMutation.mutate(data, {
            onSuccess: () => {
                setIsEditing(false);
            }
        });
    };

    const addSkill = () => {
        if (newSkill.trim() && !skills?.includes(newSkill.trim())) {
            setValue('skills', [...(skills || []), newSkill.trim()]);
            setNewSkill('');
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setValue('skills', (skills || []).filter(skill => skill !== skillToRemove));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">My Profile</h1>
                            <p className="text-gray-600 text-sm mt-1">Manage your professional information</p>
                        </div>
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition"
                            >
                                <Edit2 className="w-4 h-4" />
                                Edit Profile
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsEditing(false)}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition"
                            >
                                <X className="w-4 h-4" />
                                Cancel
                            </button>
                        )}
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <User className="w-5 h-5 text-gray-600" />
                            <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    {...register('fullname')}
                                    disabled={!isEditing}
                                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition disabled:bg-gray-50 ${errors.fullname ? 'border-red-500' : ''}`}
                                />
                                {errors.fullname && (
                                    <p className="text-xs text-red-600 mt-1">{errors.fullname.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    {...register('email')}
                                    type="email"
                                    disabled={!isEditing}
                                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition disabled:bg-gray-50 ${errors.email ? 'border-red-500' : ''}`}
                                />
                                {errors.email && (
                                    <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone Number
                                </label>
                                <input
                                    {...register('phoneNumber')}
                                    type="tel"
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition disabled:bg-gray-50"
                                    placeholder="e.g., +1234567890"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Professional Bio
                                </label>
                                <textarea
                                    {...register('bio')}
                                    disabled={!isEditing}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition disabled:bg-gray-50 resize-none"
                                    placeholder="Tell us about yourself, your expertise, and career goals..."
                                />
                                {errors.bio && (
                                    <p className="text-xs text-red-600 mt-1">{errors.bio.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Award className="w-5 h-5 text-gray-600" />
                            <h2 className="text-lg font-semibold text-gray-900">Skills</h2>
                        </div>

                        {isEditing && (
                            <div className="flex gap-2 mb-4">
                                <input
                                    type="text"
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                    placeholder="Add a skill (e.g., React, Node.js)"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={addSkill}
                                    className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition"
                                >
                                    Add
                                </button>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                            {skills && skills.length > 0 ? (
                                skills.map((skill, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full"
                                    >
                                        <span>{skill}</span>
                                        {isEditing && (
                                            <button
                                                type="button"
                                                onClick={() => removeSkill(skill)}
                                                className="hover:text-red-600 transition"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">No skills added yet</p>
                            )}
                        </div>
                    </div>

                    {/* Work Experience */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-gray-600" />
                                <h2 className="text-lg font-semibold text-gray-900">Work Experience</h2>
                            </div>
                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={() => appendExperience({ company: '', title: '', startDate: '', endDate: '', currentlyWorking: false, description: '' })}
                                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Experience
                                </button>
                            )}
                        </div>

                        <div className="space-y-4">
                            {experienceFields.map((field, index) => (
                                <ExperienceFormSection
                                    key={field.id}
                                    index={index}
                                    isEditing={isEditing}
                                    register={register}
                                    watch={watch}
                                    setValue={setValue}
                                    onRemove={() => removeExperience(index)}
                                />
                            ))}

                            {experienceFields.length === 0 && (
                                <p className="text-sm text-gray-500">No work experience added yet</p>
                            )}
                        </div>
                    </div>

                    {/* Education */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <GraduationCap className="w-5 h-5 text-gray-600" />
                            <h2 className="text-lg font-semibold text-gray-900">Education</h2>
                            <span className="text-xs text-gray-500">(Required: Provide at least one)</span>
                        </div>

                        <div className="space-y-4">
                            {educationFields.map((field, index) => (
                                <EducationFormSection
                                    key={field.id}
                                    index={index}
                                    isEditing={isEditing}
                                    register={register}
                                    onRemove={() => removeEducation(index)}
                                    canRemove={educationFields.length > 1}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Save Button */}
                    {isEditing && (
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={updateMutation.isPending}
                                className="px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition disabled:opacity-50 flex items-center gap-2"
                            >
                                {updateMutation.isPending ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;
