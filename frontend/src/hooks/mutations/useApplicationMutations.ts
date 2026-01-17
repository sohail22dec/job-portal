import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import applicationApi from '../../api/applicationApi';
import { applicationQueries } from '../../api/queries/applicationQueries';
import { useToast } from '../useToast';

export const useApplyToJob = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: ({ jobId, applicationData }: { jobId: string; applicationData: { coverLetter?: string; resume?: string } }) =>
            applicationApi.applyForJob(jobId, applicationData),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(applicationQueries.status(variables.jobId));
            queryClient.invalidateQueries(applicationQueries.my());
            showToast('Application submitted successfully!', 'success');
            navigate('/job-seeker-dashboard');
        },
        onError: (error: Error) => {
            showToast(error.message || 'Failed to submit application', 'error');
        },
    });
};

export const useUpdateApplicationStatus = () => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: ({ applicationId, status }: { applicationId: string; status: string }) =>
            applicationApi.updateApplicationStatus(applicationId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['applications', 'byJob'] });
            showToast('Status updated successfully!', 'success');
        },
        onError: (error: Error) => {
            showToast(error.message || 'Failed to update status', 'error');
        },
    });
};
