import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CoverLetterSectionProps {
    coverLetter: string;
}

export const CoverLetterSection = ({ coverLetter }: CoverLetterSectionProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const MAX_LENGTH = 200;
    const shouldTruncate = coverLetter.length > MAX_LENGTH;

    return (
        <div>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {!shouldTruncate || isExpanded
                    ? coverLetter
                    : `${coverLetter.substring(0, MAX_LENGTH)}...`}
            </p>
            {shouldTruncate && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                    {isExpanded ? (
                        <>
                            <ChevronUp className="w-4 h-4" />
                            Show Less
                        </>
                    ) : (
                        <>
                            <ChevronDown className="w-4 h-4" />
                            Read More
                        </>
                    )}
                </button>
            )}
        </div>
    );
};
