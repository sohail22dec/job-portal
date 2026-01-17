import { useMutation, useQueryClient } from '@tanstack/react-query';
import savedJobsApi from '../../api/savedJobsApi';
import { savedJobQueries } from '../../api/queries/savedJobQueries';
import { useToast } from '../useToast';

export const useToggleSaveJob = () => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: (jobId: string) => savedJobsApi.toggleSaveJob(jobId),
        onMutate: async (jobId: string) => {
            await queryClient.cancelQueries(savedJobQueries.isSaved(jobId));

            const previousStatus = queryClient.getQueryData<{ success: boolean; isSaved: boolean }>(
                savedJobQueries.isSaved(jobId).queryKey
            );
            const newSavedState = !previousStatus?.isSaved;

            queryClient.setQueryData(
                savedJobQueries.isSaved(jobId).queryKey,
                { success: true, isSaved: newSavedState }
            );

            return { previousStatus };
        },

        onSuccess: (data, jobId) => {
            // Invalidate queries to refetch fresh data
            queryClient.invalidateQueries(savedJobQueries.my());
            queryClient.invalidateQueries(savedJobQueries.isSaved(jobId));
            showToast(data.message || 'Job saved successfully!', 'success');
        },

        onError: (error: Error, jobId, context: any) => {
            // Rollback optimistic update on error
            if (context?.previousStatus) {
                queryClient.setQueryData(
                    savedJobQueries.isSaved(jobId).queryKey,
                    context.previousStatus
                );
            }
            showToast(error.message || 'Failed to save job', 'error');
        },
    });
};
