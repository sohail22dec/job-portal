import { useState, useRef, useEffect } from 'react';
import { X, Sparkles, Loader2, CheckCircle, Briefcase, Award, Code, ChevronDown, Check } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { generateJobDescription } from '../../api/aiApi';
import { useToast } from '../../hooks/useToast';

interface AIJobGeneratorProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (jobTitle: string, description: string, requirements: string[]) => void;
    companyDescription?: string;
}

const experienceOptions = [
    { value: "0-2 years", label: "0-2 years (Junior)" },
    { value: "3-5 years", label: "3-5 years (Mid-level)" },
    { value: "5+ years", label: "5+ years (Senior)" },
    { value: "7+ years", label: "7+ years (Lead)" }
];

const AIJobGenerator = ({ isOpen, onClose, onGenerate, companyDescription }: AIJobGeneratorProps) => {
    const { showToast } = useToast();
    const [jobTitle, setJobTitle] = useState('');
    const [experienceLevel, setExperienceLevel] = useState('');
    const [skillsInput, setSkillsInput] = useState('');
    const [inputError, setInputError] = useState('');

    // Custom Dropdown State
    const [isExperienceOpen, setIsExperienceOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsExperienceOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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
        setIsExperienceOpen(false);
        reset(); // Reset mutation state
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                {/* Professional Header with Accent */}
                <div className="relative bg-white text-gray-900 px-6 py-5 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 rounded-lg border border-indigo-100">
                                <Sparkles className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold tracking-tight text-gray-900">AI Job Generator</h2>
                                <p className="text-gray-500 text-sm mt-0.5">Create professional job descriptions instantly</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600 rounded-lg transition-all duration-200"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-90px)]">
                    <div className="p-6">
                        {!generated ? (
                            <>
                                {/* Info Banner */}
                                <div className="mb-6 p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl flex gap-3">
                                    <span className="text-lg">🎯</span>
                                    <p className="text-gray-600 text-sm leading-relaxed pt-0.5">
                                        <span className="font-semibold text-indigo-900">Pro Tip:</span> Provide specific details for better results. Our AI will craft a compelling job description tailored to your needs.
                                    </p>
                                </div>

                                {/* Form */}
                                <div className="space-y-5">
                                    {/* Job Title */}
                                    <div className="relative">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                            <Briefcase className="w-4 h-4 text-indigo-500" />
                                            Job Title <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={jobTitle}
                                            onChange={(e) => setJobTitle(e.target.value)}
                                            placeholder="e.g., Senior React Developer"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all duration-200 hover:border-gray-300 bg-gray-50/50"
                                        />
                                    </div>

                                    {/* Experience Level - Custom Dropdown */}
                                    <div className="relative" ref={dropdownRef}>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                            <Award className="w-4 h-4 text-indigo-500" />
                                            Experience Required <span className="text-red-500">*</span>
                                        </label>

                                        <button
                                            type="button"
                                            onClick={() => setIsExperienceOpen(!isExperienceOpen)}
                                            className={`w-full px-4 py-3 border rounded-xl text-left flex items-center justify-between transition-all duration-200 bg-gray-50/50 ${isExperienceOpen
                                                ? 'border-indigo-500 ring-2 ring-indigo-100 bg-white'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <span className={experienceLevel ? 'text-gray-900' : 'text-gray-400'}>
                                                {experienceOptions.find(opt => opt.value === experienceLevel)?.label || "Select experience level"}
                                            </span>
                                            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isExperienceOpen ? 'rotate-180 text-indigo-500' : ''}`} />
                                        </button>

                                        {isExperienceOpen && (
                                            <div className="absolute z-10 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                                                <div className="py-1">
                                                    {experienceOptions.map((option) => (
                                                        <button
                                                            key={option.value}
                                                            type="button"
                                                            onClick={() => {
                                                                setExperienceLevel(option.value);
                                                                setIsExperienceOpen(false);
                                                            }}
                                                            className="w-full px-4 py-3 text-left hover:bg-indigo-50 flex items-center justify-between group transition-colors"
                                                        >
                                                            <span className={`text-sm ${experienceLevel === option.value ? 'font-semibold text-indigo-600' : 'text-gray-700'}`}>
                                                                {option.label}
                                                            </span>
                                                            {experienceLevel === option.value && (
                                                                <Check className="w-4 h-4 text-indigo-600" />
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Skills */}
                                    <div className="relative">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                            <Code className="w-4 h-4 text-indigo-500" />
                                            Key Skills <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={skillsInput}
                                            onChange={(e) => setSkillsInput(e.target.value)}
                                            placeholder="e.g., React, TypeScript, Node.js, MongoDB"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all duration-200 hover:border-gray-300 bg-gray-50/50"
                                        />
                                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                            💡 Separate multiple skills with commas
                                        </p>
                                    </div>
                                </div>

                                {/* Error */}
                                {inputError && (
                                    <div className="mt-5 p-4 bg-red-50 border border-red-100 rounded-lg animate-in slide-in-from-top duration-300 flex items-start gap-3">
                                        <span className="text-red-500 mt-0.5">⚠️</span>
                                        <p className="text-sm text-red-700 font-medium">{inputError}</p>
                                    </div>
                                )}

                                {/* Generate Button */}
                                <button
                                    onClick={handleGenerate}
                                    disabled={isPending}
                                    className="w-full mt-6 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300/50 flex items-center justify-center gap-2 group hover:scale-[1.01] active:scale-[0.99]"
                                >
                                    {isPending ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin text-indigo-200" />
                                            <span>Generating...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5 text-indigo-200 group-hover:text-white transition-colors" />
                                            <span>Generate with AI</span>
                                        </>
                                    )}
                                </button>
                            </>
                        ) : (
                            <>
                                {/* Success Header */}
                                <div className="flex items-center gap-3 mb-6 p-4 bg-green-50 border border-green-100 rounded-xl animate-in slide-in-from-top duration-500">
                                    <div className="p-2 bg-white rounded-lg border border-green-100">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <span className="font-semibold text-green-900">Success!</span>
                                        <p className="text-sm text-green-700">Your job description is ready to use</p>
                                    </div>
                                </div>

                                {/* Generated Description */}
                                <div className="mb-5 animate-in slide-in-from-bottom duration-500">
                                    <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <div className="w-1 h-5 bg-indigo-600 rounded-full"></div>
                                        Job Description
                                    </h3>
                                    <div className="p-5 bg-indigo-50/30 border border-indigo-100 rounded-xl text-sm text-gray-700 leading-relaxed hover:border-indigo-200 transition-colors duration-300">
                                        {generated.description}
                                    </div>
                                </div>

                                {/* Generated Requirements */}
                                <div className="mb-6 animate-in slide-in-from-bottom duration-500 delay-100">
                                    <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <div className="w-1 h-5 bg-indigo-600 rounded-full"></div>
                                        Requirements
                                    </h3>
                                    <div className="p-5 bg-indigo-50/30 border border-indigo-100 rounded-xl">
                                        <ul className="space-y-3 text-sm text-gray-700">
                                            {generated.requirements.map((req, index) => (
                                                <li key={index} className="flex gap-3 items-start group">
                                                    <span className="flex-shrink-0 w-6 h-6 bg-white border border-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold text-xs shadow-sm">
                                                        {index + 1}
                                                    </span>
                                                    <span className="flex-1 leading-relaxed">{req}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={handleUseContent}
                                        className="flex-1 py-3.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all duration-300 shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300/50 hover:scale-[1.01] active:scale-[0.99]"
                                    >
                                        ✓ Use This Content
                                    </button>
                                    <button
                                        onClick={() => reset()}
                                        className="px-6 py-3.5 bg-white text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-200 hover:border-gray-300 shadow-sm"
                                    >
                                        ↻ Regenerate
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIJobGenerator;
