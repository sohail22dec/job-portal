import { API_BASE_URL } from '../utils/config';

const API_BASE = `${API_BASE_URL}/user`;

interface UpdateProfileData {
    fullname?: string;
    email?: string;
    phoneNumber?: string;
    bio?: string;
    skills?: string[];
    experience?: Array<{
        company: string;
        title: string;
        startDate: string;
        endDate?: string;
        currentlyWorking?: boolean;
        description?: string;
    }>;
    education?: Array<{
        institute: string;
        degree: string;
        fieldOfStudy?: string;
        startYear: string;
        endYear?: string;
    }>;
}

export const updateProfile = async (data: UpdateProfileData) => {
    const response = await fetch(`${API_BASE}/profile/update`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        try {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update profile');
        } catch (e) {
            throw new Error(`Failed to update profile: ${response.status} ${response.statusText}`);
        }
    }

    return response.json();
};
