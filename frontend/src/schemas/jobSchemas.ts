import { z } from 'zod';

/**
 * Job posting schema for creating and updating jobs
 */
export const jobSchema = z.object({
    title: z.string()
        .min(5, 'Title must be at least 5 characters')
        .max(100, 'Title must be less than 100 characters'),

    description: z.string()
        .min(50, 'Description must be at least 50 characters')
        .max(2000, 'Description must be less than 2000 characters'),

    salary: z.number()
        .min(1, 'Salary must be positive'),

    location: z.string()
        .min(2, 'Location is required'),

    jobType: z.enum(['Full-time', 'Part-time', 'Contract', 'Internship'], {
        message: 'Please select a valid job type',
    }),

    experience: z.number()
        .min(0, 'Experience cannot be negative')
        .max(50, 'Experience seems too high'),

    position: z.number()
        .min(1, 'At least 1 position required')
        .max(100, 'Too many positions'),

    status: z.enum(['open', 'closed']),
});

export type JobFormData = z.infer<typeof jobSchema>;
