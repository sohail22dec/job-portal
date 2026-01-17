import { queryOptions } from '@tanstack/react-query';
import { jobApi } from '../jobApi';

export const jobQueries = {
    list: (keyword?: string) => queryOptions({
        queryKey: ['jobs', 'list', { keyword }] as const,
        queryFn: () => jobApi.getAllJobs(keyword),
        staleTime: 1000 * 60 * 5, // 5 minutes
        select: (data) => data.success ? data.jobs.filter((job: any) => job.status === 'open') : [],
    }),

    recruiter: () => queryOptions({
        queryKey: ['jobs', 'recruiter'] as const,
        queryFn: () => jobApi.getRecruiterJobs(),
        select: (data) => data.success ? data.jobs : [],
    }),

    detail: (jobId: string) => queryOptions({
        queryKey: ['jobs', 'detail', jobId] as const,
        queryFn: () => jobApi.getJobById(jobId),
        enabled: !!jobId,
        staleTime: 1000 * 60 * 10,
    }),
};
