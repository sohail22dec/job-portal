import { useMutation, useQueryClient } from '@tanstack/react-query';
import savedJobsApi from '../../api/savedJobsApi';
import { savedJobQueries } from '../../api/queries/savedJobQueries';
import { useToast } from '../useToast';

export const useToggleSaveJob = () => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: (jobId: string) => savedJobsApi.toggleSaveJob(jobId),
        onSuccess: (data, jobId) => {
            // Invalidate saved jobs list and individual saved status
            queryClient.invalidateQueries(savedJobQueries.my());
            queryClient.invalidateQueries(savedJobQueries.isSaved(jobId));
            showToast(data.message || 'Job saved successfully!', 'success');
        },
        onError: (error: Error) => {
            showToast(error.message || 'Failed to save job', 'error');
        },
    });
};
