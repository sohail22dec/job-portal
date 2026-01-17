import { z } from 'zod';

export const companyProfileSchema = z.object({
    website: z.string()
        .min(1, 'Website is required')
        .refine((url) => url.startsWith('http://') || url.startsWith('https://'), {
            message: 'Please enter a valid website URL (starting with http:// or https://)'
        }),
    description: z.string()
        .min(10, 'Description must be at least 10 characters')
        .max(1000, 'Description must be less than 1000 characters'),
});

export type CompanyProfileFormData = z.infer<typeof companyProfileSchema>;
