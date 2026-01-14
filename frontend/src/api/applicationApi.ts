const API_BASE = 'http://localhost:8000/api/v1/application';

// Helper to handle API responses
const handleResponse = async (response: Response) => {
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'API request failed');
    }

    return data;
};

// Apply for a job
export const applyForJob = async (jobId: string, applicationData: { coverLetter?: string; resume?: string }) => {
    const response = await fetch(`${API_BASE}/apply/${jobId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(applicationData)
    });
    return handleResponse(response);
};

// Get my applications
export const getMyApplications = async () => {
    const response = await fetch(`${API_BASE}/my-applications`, {
        method: 'GET',
        credentials: 'include',
    });
    return handleResponse(response);
};

// Get application by ID
export const getApplicationById = async (id: string) => {
    const response = await fetch(`${API_BASE}/${id}`, {
        method: 'GET',
        credentials: 'include',
    });
    return handleResponse(response);
};

// Get job applicants (recruiter only)
export const getJobApplicants = async (jobId: string) => {
    const response = await fetch(`${API_BASE}/job/${jobId}/applicants`, {
        method: 'GET',
        credentials: 'include',
    });
    return handleResponse(response);
};

// Update application status (recruiter only)
export const updateApplicationStatus = async (id: string, status: string) => {
    const response = await fetch(`${API_BASE}/${id}/status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};

const applicationApi = {
    applyForJob,
    getMyApplications,
    getApplicationById,
    getJobApplicants,
    updateApplicationStatus
};

export default applicationApi;
