import { API_BASE_URL } from '../utils/config';

const API_BASE = `${API_BASE_URL}/saved-jobs`;

// Helper to handle API responses
const handleResponse = async (response: Response) => {
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'API request failed');
    }

    return data;
};

// Toggle save/unsave job
export const toggleSaveJob = async (jobId: string) => {
    const response = await fetch(`${API_BASE}/toggle/${jobId}`, {
        method: 'POST',
        credentials: 'include'
    });
    return handleResponse(response);
};

// Get all saved jobs
export const getSavedJobs = async () => {
    const response = await fetch(`${API_BASE}`, {
        credentials: 'include'
    });
    return handleResponse(response);
};

// Check if specific job is saved
export const checkIfSaved = async (jobId: string) => {
    const response = await fetch(`${API_BASE}/check/${jobId}`, {
        credentials: 'include'
    });
    return handleResponse(response);
};

const savedJobsApi = {
    toggleSaveJob,
    getSavedJobs,
    checkIfSaved
};

export default savedJobsApi;
