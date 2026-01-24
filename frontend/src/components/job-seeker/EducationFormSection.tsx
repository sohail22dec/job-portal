import type { UseFormRegister } from 'react-hook-form';
import { Trash2 } from 'lucide-react';
import type { ProfileFormData } from '../../schemas/profileSchemas';

interface EducationFormSectionProps {
    index: number;
    isEditing: boolean;
    register: UseFormRegister<ProfileFormData>;
    onRemove: () => void;
    canRemove: boolean; // Only allow removal if more than 1 education entry
}

export const EducationFormSection = ({
    index,
    isEditing,
    register,
    onRemove,
    canRemove
}: EducationFormSectionProps) => {
    return (
        <div className="p-4 border border-gray-200 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Institute <span className="text-red-500">*</span>
                    </label>
                    <input
                        {...register(`education.${index}.institute`)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none disabled:bg-gray-50"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Degree <span className="text-red-500">*</span>
                    </label>
                    <input
                        {...register(`education.${index}.degree`)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none disabled:bg-gray-50"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Field of Study
                    </label>
                    <input
                        {...register(`education.${index}.fieldOfStudy`)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none disabled:bg-gray-50"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Year <span className="text-red-500">*</span>
                    </label>
                    <input
                        {...register(`education.${index}.startYear`)}
                        type="month"
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none disabled:bg-gray-50"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Year
                    </label>
                    <input
                        {...register(`education.${index}.endYear`)}
                        type="month"
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none disabled:bg-gray-50"
                    />
                </div>
            </div>

            {isEditing && canRemove && (
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
