import { useMutation } from '@tanstack/react-query';
import { useToast } from '../useToast';

export const useUpdateCompanyProfile = () => {
    const { showToast } = useToast();

    return useMutation({
        mutationFn: async (data: FormData) => {
            const response = await fetch('http://localhost:8000/api/v1/user/update-company-profile', {
                method: 'PUT',
                credentials: 'include',
                body: data,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to update profile');
            }

            return result;
        },
        onSuccess: () => {
            showToast('Profile updated successfully!', 'success');
        },
        onError: (error: Error) => {
            showToast(error.message || 'Failed to update profile', 'error');
        },
    });
};
