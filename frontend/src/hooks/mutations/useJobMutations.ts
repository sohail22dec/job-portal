import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { jobApi } from '../../api/jobApi';
import { jobQueries } from '../../api/queries/jobQueries';
import { useToast } from '../useToast';

export const useCreateJob = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: jobApi.postJob,
        onSuccess: () => {
            queryClient.invalidateQueries(jobQueries.recruiter());
            navigate('/recruiter-dashboard');
        },
        onError: (error: Error) => {
            showToast(error.message || 'Failed to post job', 'error');
        },
    });
};

export const useUpdateJob = () => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: ({ jobId, data }: { jobId: string; data: any }) =>
            jobApi.updateJob(jobId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(jobQueries.detail(variables.jobId));
            queryClient.invalidateQueries(jobQueries.recruiter());
            showToast('Job updated successfully!', 'success');
            navigate('/recruiter-dashboard');
        },
        onError: (error: Error) => {
            showToast(error.message || 'Failed to update job', 'error');
        },
    });
};

export const useDeleteJob = () => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: jobApi.deleteJob,
        onSuccess: () => {
            queryClient.invalidateQueries(jobQueries.recruiter());
        },
        onError: (error: Error) => {
            showToast(error.message || 'Failed to delete job', 'error');
        },
    });
};
