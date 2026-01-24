import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfile } from '../../api/userApi';
import { useToast } from '../useToast';

export const useUpdateProfile = () => {
    const { showToast } = useToast();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateProfile,
        onSuccess: () => {
            showToast('Profile updated successfully!', 'success');
            // Update the auth/user cache
            queryClient.invalidateQueries({ queryKey: ['auth'] });
        },
        onError: (error: any) => {
            showToast(error.message || 'Failed to update profile', 'error');
        },
    });
};
