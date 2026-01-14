import { useActionState, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';

type SignupState = {
    error?: string;
    success?: boolean;
};

type ValidationErrors = {
    fullname?: string;
    email?: string;
    password?: string;
    phoneNumber?: string;
    role?: string;
    companyName?: string;
};

const Signup = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const [selectedRole, setSelectedRole] = useState<string>('');
    const { signup } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const validateForm = (formData: FormData): boolean => {
        const errors: ValidationErrors = {};
        const fullname = formData.get('fullname') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const phoneNumber = formData.get('phoneNumber') as string;
        const role = formData.get('role') as string;
        const companyName = formData.get('companyName') as string;

        if (!fullname || fullname.trim() === '') {
            errors.fullname = 'Full name is required';
        } else if (fullname.trim().length < 2) {
            errors.fullname = 'Name must be at least 2 characters';
        }

        if (!email || email.trim() === '') {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = 'Please enter a valid email';
        }

        if (!password || password.trim() === '') {
            errors.password = 'Password is required';
        } else if (password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        if (!role) {
            errors.role = 'Please select your role';
        }

        // Phone number required ONLY for job seekers
        if (role === 'job_seeker') {
            if (!phoneNumber || phoneNumber.trim() === '') {
                errors.phoneNumber = 'Phone number is required';
            } else if (!/^\d{10}$/.test(phoneNumber.replace(/\D/g, ''))) {
                errors.phoneNumber = 'Please enter a valid 10-digit phone number';
            }
        }

        // Company name required for recruiters
        if (role === 'recruiter' && (!companyName || companyName.trim() === '')) {
            errors.companyName = 'Company name is required for recruiters';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const signupAction = async (_prevState: SignupState, formData: FormData): Promise<SignupState> => {
        setValidationErrors({});

        if (!validateForm(formData)) {
            return { error: 'Please fix the errors below' };
        }

        const result = await signup(
            formData.get('fullname') as string,
            formData.get('email') as string,
            formData.get('password') as string,
            formData.get('role') as string,
            formData.get('phoneNumber') as string,
            formData.get('companyName') as string
        );

        if (result.success) {
            navigate('/dashboard');
            return { success: true };
        }

        if (result.error) {
            showToast(result.error, 'error');
        }
        return { error: result.error || 'Signup failed' };
    };

    const [, action, isPending] = useActionState(signupAction, { success: false });

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-semibold text-gray-900 mb-2">Create Account</h2>
                    <p className="text-gray-600">Start your journey today</p>
                </div>

                {/* Form */}
                <div className="bg-white border border-gray-200 rounded-lg p-8">
                    <form action={action}>
                        {/* Full Name */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="fullname"
                                placeholder="John Doe"
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-black outline-none text-sm"
                            />
                            {validationErrors.fullname && (
                                <p className="mt-1 text-xs text-red-600">{validationErrors.fullname}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-black outline-none text-sm"
                            />
                            {validationErrors.email && (
                                <p className="mt-1 text-xs text-red-600">{validationErrors.email}</p>
                            )}
                        </div>



                        {/* Password */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="••••••••"
                                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-black outline-none text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {validationErrors.password && (
                                <p className="mt-1 text-xs text-red-600">{validationErrors.password}</p>
                            )}
                        </div>

                        {/* Phone Number (Only for Job Seekers) */}
                        {selectedRole === 'job_seeker' && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    placeholder="1234567890"
                                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-black outline-none text-sm"
                                />
                                {validationErrors.phoneNumber && (
                                    <p className="mt-1 text-xs text-red-600">{validationErrors.phoneNumber}</p>
                                )}
                            </div>
                        )}

                        {/* Company Name (Only for Recruiters) */}
                        {selectedRole === 'recruiter' && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Company Name
                                </label>
                                <input
                                    type="text"
                                    name="companyName"
                                    placeholder="Your Company Inc."
                                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-black outline-none text-sm"
                                />
                                {validationErrors.companyName && (
                                    <p className="mt-1 text-xs text-red-600">{validationErrors.companyName}</p>
                                )}
                            </div>
                        )}

                        {/* Role Selection */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                I am a
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <label className={`border-2 rounded-lg p-3 cursor-pointer transition ${selectedRole === 'job_seeker'
                                    ? 'border-black bg-gray-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="job_seeker"
                                        className="sr-only"
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                    />
                                    <div className="text-center">
                                        <div className="text-sm font-medium text-gray-900">Job Seeker</div>
                                    </div>
                                </label>
                                <label className={`border-2 rounded-lg p-3 cursor-pointer transition ${selectedRole === 'recruiter'
                                    ? 'border-black bg-gray-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="recruiter"
                                        className="sr-only"
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                    />
                                    <div className="text-center">
                                        <div className="text-sm font-medium text-gray-900">Recruiter</div>
                                    </div>
                                </label>
                            </div>
                            {validationErrors.role && (
                                <p className="mt-1 text-xs text-red-600">{validationErrors.role}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full py-3 bg-black text-white font-medium rounded hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>

                        {/* Login Link */}
                        <p className="mt-6 text-center text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="text-black font-medium hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
