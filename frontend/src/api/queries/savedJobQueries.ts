import { queryOptions } from '@tanstack/react-query';
import savedJobsApi from '../savedJobsApi';

export const savedJobQueries = {
    my: () => queryOptions({
        queryKey: ['savedJobs', 'my'] as const,
        queryFn: () => savedJobsApi.getSavedJobs(),
        select: (data) => data.success ? data.savedJobs : [],
    }),

    isSaved: (jobId: string) => queryOptions({
        queryKey: ['savedJobs', 'status', jobId] as const,
        queryFn: () => savedJobsApi.checkIfSaved(jobId),
        enabled: !!jobId,
    }),
};
