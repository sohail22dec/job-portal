const API_BASE = 'http://localhost:8000/api/v1/application';

const handleResponse = async (response: Response) => {
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'API request failed');
    }

    return data;
};

export const applyForJob = async (jobId: string, applicationData: { coverLetter: string; resume: File }) => {
    const formData = new FormData();
    formData.append('coverLetter', applicationData.coverLetter);
    formData.append('file', applicationData.resume);

    const response = await fetch(`${API_BASE}/apply/${jobId}`, {
        method: 'POST',
        credentials: 'include',
        body: formData
    });
    return handleResponse(response);
};

export const getMyApplications = async () => {
    const response = await fetch(`${API_BASE}/my-applications`, {
        credentials: 'include'
    });
    return handleResponse(response);
};

export const getJobApplicants = async (jobId: string) => {
    const response = await fetch(`${API_BASE}/job/${jobId}/applicants`, {
        credentials: 'include'
    });
    return handleResponse(response);
};

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

export const checkApplicationStatus = async (jobId: string) => {
    const response = await fetch(`${API_BASE}/status/${jobId}`, {
        credentials: 'include'
    });
    return handleResponse(response);
};

const applicationApi = {
    applyForJob,
    getMyApplications,
    getJobApplicants,
    updateApplicationStatus,
    checkApplicationStatus
};

export default applicationApi;
