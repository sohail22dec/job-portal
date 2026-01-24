import type { UseFormRegister, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { Trash2 } from 'lucide-react';
import type { ProfileFormData } from '../../schemas/profileSchemas';

interface ExperienceFormSectionProps {
    index: number;
    isEditing: boolean;
    register: UseFormRegister<ProfileFormData>;
    watch: UseFormWatch<ProfileFormData>;
    setValue: UseFormSetValue<ProfileFormData>;
    onRemove: () => void;
}

export const ExperienceFormSection = ({
    index,
    isEditing,
    register,
    watch,
    setValue,
    onRemove
}: ExperienceFormSectionProps) => {
    return (
        <div className="p-4 border border-gray-200 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company <span className="text-red-500">*</span>
                    </label>
                    <input
                        {...register(`experience.${index}.company`)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none disabled:bg-gray-50"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Job Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        {...register(`experience.${index}.title`)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none disabled:bg-gray-50"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date <span className="text-red-500">*</span>
                    </label>
                    <input
                        {...register(`experience.${index}.startDate`)}
                        type="month"
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none disabled:bg-gray-50"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date
                    </label>
                    <input
                        {...register(`experience.${index}.endDate`)}
                        type="month"
                        disabled={!isEditing || watch(`experience.${index}.currentlyWorking`)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none disabled:bg-gray-50"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="flex items-center gap-2 text-sm">
                        <input
                            {...register(`experience.${index}.currentlyWorking`)}
                            type="checkbox"
                            disabled={!isEditing}
                            onChange={(e) => {
                                const isChecked = e.target.checked;
                                setValue(`experience.${index}.currentlyWorking`, isChecked);
                                if (isChecked) {
                                    setValue(`experience.${index}.endDate`, '');
                                }
                            }}
                            className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                        />
                        I currently work here
                    </label>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        {...register(`experience.${index}.description`)}
                        disabled={!isEditing}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none disabled:bg-gray-50 resize-none"
                        placeholder="Describe your role and achievements..."
                    />
                </div>
            </div>

            {isEditing && (
                <button
                    type="button"
                    onClick={onRemove}
                    className="mt-3 flex items-center gap-1 text-sm text-red-600 hover:text-red-700 transition"
                >
                    <Trash2 className="w-4 h-4" />
                    Remove
                </button>
            )}
        </div>
    );
};
