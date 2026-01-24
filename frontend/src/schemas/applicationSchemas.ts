import { z } from 'zod';

export const applicationSchema = z.object({
    coverLetter: z.string()
        .min(50, 'Cover letter must be at least 50 characters')
        .max(2000, 'Cover letter must be less than 2000 characters'),

    resume: z.custom<FileList>()
        .refine((files) => files?.length > 0, 'Resume is required')
        .refine((files) => files?.[0]?.type === 'application/pdf', 'Only PDF files are allowed')
        .refine((files) => files?.[0]?.size <= 5 * 1024 * 1024, 'Max file size is 5MB'),
});

export type ApplicationFormData = z.infer<typeof applicationSchema>;
