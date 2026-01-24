import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import applicationApi from '../../api/applicationApi';
import { applicationQueries } from '../../api/queries/applicationQueries';
import { useToast } from '../useToast';

import { jobQueries } from '../../api/queries/jobQueries';

export const useApplyToJob = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: ({ jobId, applicationData }: { jobId: string; applicationData: { coverLetter: string; resume: File } }) =>
            applicationApi.applyForJob(jobId, applicationData),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: applicationQueries.status(variables.jobId).queryKey });
            queryClient.invalidateQueries({ queryKey: applicationQueries.my().queryKey });
            queryClient.invalidateQueries({ queryKey: jobQueries.detail(variables.jobId).queryKey });
            queryClient.invalidateQueries({ queryKey: jobQueries.recruiter().queryKey });
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
        onSuccess: (data) => {
            const jobId = data.application.job._id;
            // Invalidate recruiter's view (applicants for this job)
            queryClient.invalidateQueries({ queryKey: applicationQueries.byJob(jobId).queryKey });
            // Invalidate job seeker's view (their applications list)
            queryClient.invalidateQueries({ queryKey: applicationQueries.my().queryKey });
            showToast('Status updated successfully!', 'success');
        },
        onError: (error: Error) => {
            showToast(error.message || 'Failed to update status', 'error');
        },
    });
};
