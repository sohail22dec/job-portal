import { useState } from 'react';
import { X, Sparkles, Loader2, CheckCircle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { generateCoverLetter } from '../../api/aiApi';
import { useToast } from '../../hooks/useToast';

interface AICoverLetterGeneratorProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (coverLetter: string) => void;
    jobTitle: string;
    companyName: string;
    jobDescription?: string;
}

const AICoverLetterGenerator = ({
    isOpen,
    onClose,
    onGenerate,
    jobTitle,
    companyName,
    jobDescription
}: AICoverLetterGeneratorProps) => {
    const { showToast } = useToast();
    const [userSkills, setUserSkills] = useState('');
    const [userExperience, setUserExperience] = useState('');

    const { mutate: generate, data, isPending, reset } = useMutation({
        mutationFn: (data: { jobTitle: string; companyName: string; jobDescription?: string; userSkills?: string; userExperience?: string }) =>
            generateCoverLetter(data),
        onError: (error: any) => {
            showToast(error.message || 'Failed to generate cover letter', 'error');
        }
    });
    const generated = data?.data;

    const handleGenerate = () => {
        generate({
            jobTitle,
            companyName,
            jobDescription,
            userSkills: userSkills || undefined,
            userExperience: userExperience || undefined
        });
    };

    const handleUseContent = () => {
        if (generated) {
            onGenerate(generated.coverLetter);
            handleClose();
        }
    };

    const handleClose = () => {
        setUserSkills('');
        setUserExperience('');
        reset();
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
                        <h2 className="text-xl font-semibold">AI Cover Letter Generator</h2>
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
                                Generate a personalized cover letter for <strong>{jobTitle}</strong> at <strong>{companyName}</strong>.
                                Add optional details to make it even better!
                            </p>

                            {/* Form */}
                            <div className="space-y-4">
                                {/* User Skills */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Your Key Skills (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={userSkills}
                                        onChange={(e) => setUserSkills(e.target.value)}
                                        placeholder="e.g., React, Node.js, Team Leadership"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Separate skills with commas</p>
                                </div>

                                {/* User Experience */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Highlight Specific Experience (Optional)
                                    </label>
                                    <textarea
                                        value={userExperience}
                                        onChange={(e) => setUserExperience(e.target.value)}
                                        rows={3}
                                        placeholder="e.g., 5 years in full-stack development, led team of 10 developers"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none resize-none"
                                    />
                                </div>
                            </div>

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
                                        Generate Cover Letter
                                    </>
                                )}
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Success Header */}
                            <div className="flex items-center gap-2 mb-4 text-green-600">
                                <CheckCircle className="w-5 h-5" />
                                <span className="font-medium">Cover letter generated successfully!</span>
                            </div>

                            {/* Generated Cover Letter */}
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-900 mb-2">Your Cover Letter</h3>
                                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                                    {generated.coverLetter}
                                </div>
                                <p className="mt-2 text-xs text-gray-500">
                                    {generated.coverLetter.split(' ').length} words
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleUseContent}
                                    className="flex-1 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition"
                                >
                                    Use This Cover Letter
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

export default AICoverLetterGenerator;
