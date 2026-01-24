import { z } from 'zod';

const experienceSchema = z.object({
    company: z.string().min(1, 'Company name is required'),
    title: z.string().min(1, 'Job title is required'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().optional().or(z.literal('')),
    currentlyWorking: z.boolean().optional(),
    description: z.string().optional().or(z.literal(''))
});

const educationSchema = z.object({
    institute: z.string().min(1, 'Institute name is required'),
    degree: z.string().min(1, 'Degree is required'),
    fieldOfStudy: z.string().optional().or(z.literal('')),
    startYear: z.string().min(1, 'Start year is required'),
    endYear: z.string().optional().or(z.literal(''))
});

export const profileSchema = z.object({
    fullname: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phoneNumber: z.string().optional().or(z.literal('')),
    bio: z.string().max(500, 'Bio must be less than 500 characters').optional().or(z.literal('')),
    skills: z.array(z.string()),
    experience: z.array(experienceSchema),
    education: z.array(educationSchema).min(1, 'At least one education entry is required')
});

export type ProfileFormData = z.infer<typeof profileSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Education = z.infer<typeof educationSchema>;
