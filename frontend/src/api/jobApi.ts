import { API_BASE_URL } from '../utils/config';

const API_BASE = `${API_BASE_URL}/job`;

// Helper to handle API responses
const handleResponse = async (response: Response) => {
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'API request failed');
    }

    return data;
};

export const jobApi = {
    // Get all jobs posted by the recruiter
    getRecruiterJobs: async () => {
        const response = await fetch(`${API_BASE}/recruiter/jobs`, {
            credentials: 'include'
        });
        return handleResponse(response);
    },

    // Get all jobs (public) with pagination
    getAllJobs: async (keyword = '', page: number, limit: number) => {
        const params = new URLSearchParams();
        if (keyword) params.append('keyword', keyword);
        params.append('page', page.toString());
        params.append('limit', limit.toString());

        const response = await fetch(`${API_BASE}/all?${params.toString()}`, {
            credentials: 'include'
        });
        return handleResponse(response);
    },

    // Get single job by ID
    getJobById: async (jobId: string) => {
        const response = await fetch(`${API_BASE}/${jobId}`, {
            credentials: 'include'
        });
        return handleResponse(response);
    },

    // Post a new job
    postJob: async (jobData: {
        title: string;
        description: string;
        requirements: string[];
        salary: number;
        location: string;
        jobType: string;
        experience: number;
        position: number;
    }) => {
        const response = await fetch(`${API_BASE}/post`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(jobData)
        });
        return handleResponse(response);
    },

    // Update a job
    updateJob: async (jobId: string, jobData: any) => {
        const response = await fetch(`${API_BASE}/update/${jobId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(jobData)
        });
        return handleResponse(response);
    },

    // Delete a job
    deleteJob: async (jobId: string) => {
        const response = await fetch(`${API_BASE}/delete/${jobId}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        return handleResponse(response);
    }
};
