import { useState } from 'react';
import { X, Sparkles, Loader2, CheckCircle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { generateJobDescription } from '../../api/aiApi';
import { useToast } from '../../hooks/useToast';

interface AIJobGeneratorProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (jobTitle: string, description: string, requirements: string[]) => void;
    companyDescription?: string;
}

const AIJobGenerator = ({ isOpen, onClose, onGenerate, companyDescription }: AIJobGeneratorProps) => {
    const { showToast } = useToast();
    const [jobTitle, setJobTitle] = useState('');
    const [experienceLevel, setExperienceLevel] = useState('');
    const [skillsInput, setSkillsInput] = useState('');
    const [inputError, setInputError] = useState('');

    const { mutate: generateDescription, data, isPending, reset } = useMutation({
        mutationFn: (data: { jobTitle: string; experienceLevel: string; skills: string[]; companyDescription?: string }) =>
            generateJobDescription(data),
        onError: (error: any) => {
            showToast(error.message || 'Failed to generate job description', 'error');
        }
    });
    const generated = data?.data;

    const handleGenerate = () => {
        if (!jobTitle || !experienceLevel || !skillsInput) {
            setInputError('Please fill in all fields');
            return;
        }

        setInputError('');
        const skills = skillsInput.split(',').map(s => s.trim()).filter(s => s.length > 0);

        generateDescription({
            jobTitle,
            experienceLevel,
            skills,
            companyDescription: companyDescription || undefined
        });
    };

    const handleUseContent = () => {
        if (generated) {
            onGenerate(generated.jobTitle, generated.description, generated.requirements);
            handleClose();
        }
    };

    const handleClose = () => {
        setJobTitle('');
        setExperienceLevel('');
        setSkillsInput('');
        setInputError('');
        reset(); // Reset mutation state
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 bg-gray-900 text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        <h2 className="text-xl font-semibold">AI Job Description Generator</h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-1 hover:bg-white/20 rounded-full transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {!generated ? (
                        <>
                            <p className="text-gray-600 text-sm mb-6">
                                Provide some basic information and let AI generate a professional job description for you.
                            </p>

                            {/* Form */}
                            <div className="space-y-4">
                                {/* Job Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Job Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={jobTitle}
                                        onChange={(e) => setJobTitle(e.target.value)}
                                        placeholder="e.g., Senior React Developer"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                    />
                                </div>

                                {/* Experience Level */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Experience Required <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={experienceLevel}
                                        onChange={(e) => setExperienceLevel(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                    >
                                        <option value="">Select experience level</option>
                                        <option value="0-2 years">0-2 years (Junior)</option>
                                        <option value="3-5 years">3-5 years (Mid-level)</option>
                                        <option value="5+ years">5+ years (Senior)</option>
                                        <option value="7+ years">7+ years (Lead)</option>
                                    </select>
                                </div>

                                {/* Skills */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Key Skills <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={skillsInput}
                                        onChange={(e) => setSkillsInput(e.target.value)}
                                        placeholder="e.g., React, TypeScript, Node.js, MongoDB"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Separate multiple skills with commas</p>
                                </div>
                            </div>

                            {/* Error */}
                            {inputError && (
                                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                                    {inputError}
                                </div>
                            )}

                            {/* Generate Button */}
                            <button
                                onClick={handleGenerate}
                                disabled={isPending}
                                className="w-full mt-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        Generate with AI
                                    </>
                                )}
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Success Header */}
                            <div className="flex items-center gap-2 mb-4 text-green-600">
                                <CheckCircle className="w-5 h-5" />
                                <span className="font-medium">Content generated successfully!</span>
                            </div>

                            {/* Generated Description */}
                            <div className="mb-4">
                                <h3 className="text-sm font-semibold text-gray-900 mb-2">Job Description</h3>
                                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 leading-relaxed">
                                    {generated.description}
                                </div>
                            </div>

                            {/* Generated Requirements */}
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-900 mb-2">Requirements</h3>
                                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                                    <ul className="space-y-2 text-sm text-gray-700">
                                        {generated.requirements.map((req, index) => (
                                            <li key={index} className="flex gap-2">
                                                <span className="text-purple-600">•</span>
                                                <span>{req}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleUseContent}
                                    className="flex-1 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition"
                                >
                                    Use This Content
                                </button>
                                <button
                                    onClick={() => reset()}
                                    className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
                                >
                                    Regenerate
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AIJobGenerator;
