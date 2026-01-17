import { queryOptions } from '@tanstack/react-query';
import applicationApi from '../applicationApi';

export const applicationQueries = {
    my: () => queryOptions({
        queryKey: ['applications', 'my'] as const,
        queryFn: () => applicationApi.getMyApplications(),
        select: (data) => data.success ? data.applications : [],
    }),

    status: (jobId: string) => queryOptions({
        queryKey: ['applications', 'status', jobId] as const,
        queryFn: () => applicationApi.getApplicationById(jobId).then(data => ({ success: true, hasApplied: !!data })),
        enabled: !!jobId,
    }),

    byJob: (jobId: string) => queryOptions({
        queryKey: ['applications', 'byJob', jobId] as const,
        queryFn: () => applicationApi.getJobApplicants(jobId),
        enabled: !!jobId,
    }),
};
