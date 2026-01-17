import { z } from 'zod';

/**
 * Job application schema for applying to jobs
 */
export const applicationSchema = z.object({
    coverLetter: z.string()
        .min(50, 'Cover letter must be at least 50 characters')
        .max(2000, 'Cover letter must be less than 2000 characters'),

    resume: z.string()
        .url('Please enter a valid URL')
        .optional()
        .or(z.literal('')),
});

export type ApplicationFormData = z.infer<typeof applicationSchema>;
