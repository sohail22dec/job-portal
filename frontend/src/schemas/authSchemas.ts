import { z } from 'zod';

export const signupSchema = z.object({
    fullname: z.string()
        .min(1, 'Full name is required')
        .min(2, 'Name must be at least 2 characters'),
    email: z.string()
        .min(1, 'Email is required')
        .email('Please enter a valid email'),
    password: z.string()
        .min(1, 'Password is required')
        .min(6, 'Password must be at least 6 characters'),
    role: z.enum(['job_seeker', 'recruiter'], {
        message: 'Please select your role'
    }),
    phoneNumber: z.string().optional(),
    companyName: z.string().optional(),
}).refine((data) => {
    if (data.role === 'job_seeker') {
        if (!data.phoneNumber || data.phoneNumber.trim() === '' || !/^\d{10}$/.test(data.phoneNumber)) return false;
    } return true;
}, {
    message: 'Please enter a valid 10-digit phone number',
    path: ['phoneNumber']
}).refine((data) => {
    if (data.role === 'recruiter' && (!data.companyName || data.companyName.trim() === '')) return false;
    return true;
}, {
    message: 'Company name is required for recruiters',
    path: ['companyName']
});

export type SignupFormData = z.infer<typeof signupSchema>;


export const loginSchema = z.object({
    email: z.string()
        .min(1, 'Email is required')
        .email('Please enter a valid email'),
    password: z.string()
        .min(1, 'Password is required')
        .min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
