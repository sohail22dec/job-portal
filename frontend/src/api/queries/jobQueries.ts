import { queryOptions, infiniteQueryOptions } from '@tanstack/react-query';
import { jobApi } from '../jobApi';

export const jobQueries = {
    infiniteList: (keyword?: string) => infiniteQueryOptions({
        queryKey: ['jobs', 'infinite-list', { keyword }] as const,
        queryFn: ({ pageParam = 1 }) => jobApi.getAllJobs(keyword || '', pageParam, 20),
        getNextPageParam: (lastPage) => {
            if (lastPage.success && lastPage.pagination?.hasMore) {
                return lastPage.pagination.currentPage + 1;
            }
            return undefined;
        },
        initialPageParam: 1,
        staleTime: 1000 * 60 * 5, // 5 minutes
        select: (data) => ({
            pages: data.pages.map(page => ({
                ...page,
                jobs: page.success ? page.jobs.filter((job: any) => job.status === 'open') : []
            })),
            pageParams: data.pageParams
        }),
    }),

    // Legacy query for backwards compatibility (uses page 1 only)
    list: (keyword?: string) => queryOptions({
        queryKey: ['jobs', 'list', { keyword }] as const,
        queryFn: () => jobApi.getAllJobs(keyword || '', 1, 20),
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
