const API_BASE = 'http://localhost:8000/api/v1/ai';

interface GenerateJobDescriptionRequest {
    jobTitle: string;
    experienceLevel: string;
    skills: string[];
    companyDescription?: string;
}

interface GenerateJobDescriptionResponse {
    success: boolean;
    data: {
        jobTitle: string;
        description: string;
        requirements: string[];
    };
}

interface GenerateCoverLetterRequest {
    jobTitle: string;
    companyName: string;
    jobDescription?: string;
    userSkills?: string;
    userExperience?: string;
}

interface GenerateCoverLetterResponse {
    success: boolean;
    data: {
        coverLetter: string;
    };
}

export const generateJobDescription = async (
    data: GenerateJobDescriptionRequest
): Promise<GenerateJobDescriptionResponse> => {
    const response = await fetch(`${API_BASE}/generate-job-description`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate job description');
    }

    return response.json();
};

export const generateCoverLetter = async (
    data: GenerateCoverLetterRequest
): Promise<GenerateCoverLetterResponse> => {
    const response = await fetch(`${API_BASE}/generate-cover-letter`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate cover letter');
    }

    return response.json();
};
