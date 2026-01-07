import { useActionState, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Briefcase, Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

type SignupState = {
    error?: string;
    success?: boolean;
};

type ValidationErrors = {
    fullname?: string;
    email?: string;
    password?: string;
    role?: string;
};

const Signup = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const { signup } = useAuth();
    const navigate = useNavigate();

    const validateForm = (formData: FormData): boolean => {
        const errors: ValidationErrors = {};
        const fullname = formData.get('fullname') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const role = formData.get('role') as string;

        if (!fullname || fullname.trim() === '') {
            errors.fullname = 'Please enter your full name';
        } else if (fullname.trim().length < 2) {
            errors.fullname = 'Name must be at least 2 characters';
        }

        if (!email || email.trim() === '') {
            errors.email = 'Please enter your email';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = 'Please enter a valid email address';
        }

        if (!password || password.trim() === '') {
            errors.password = 'Please enter your password';
        } else if (password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        if (!role) {
            errors.role = 'Please select your role';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const signupAction = async (_prevState: SignupState, formData: FormData): Promise<SignupState> => {
        // Clear previous validation errors
        setValidationErrors({});

        // Validate form
        if (!validateForm(formData)) {
            return { error: 'Please fix the errors below' };
        }

        const result = await signup(
            formData.get('fullname') as string,
            formData.get('email') as string,
            formData.get('password') as string,
            formData.get('role') as string
        );

        if (result.success) {
            navigate('/dashboard');
            return { success: true };
        }

        return { error: result.error || 'Signup failed' };
    };

    const [state, action, isPending] = useActionState(signupAction, { success: false });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl">
                                <Briefcase className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
                        <p className="mt-2 text-gray-600">Start your journey to find the perfect job</p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        {/* Error Message */}
                        {state.error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600">{state.error}</p>
                            </div>
                        )}

                        <form action={action} className="space-y-5">
                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="fullname"
                                        disabled={isPending}
                                        className={`w-full pl-10 pr-4 py-3 border ${validationErrors.fullname ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} rounded-lg focus:ring-2 focus:border-transparent outline-none transition disabled:bg-gray-50 disabled:text-gray-500`}
                                        placeholder="John Doe"
                                    />
                                </div>
                                {validationErrors.fullname && (
                                    <p className="mt-1 text-sm text-red-600">{validationErrors.fullname}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        disabled={isPending}
                                        className={`w-full pl-10 pr-4 py-3 border ${validationErrors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} rounded-lg focus:ring-2 focus:border-transparent outline-none transition disabled:bg-gray-50 disabled:text-gray-500`}
                                        placeholder="you@example.com"
                                    />
                                </div>
                                {validationErrors.email && (
                                    <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        disabled={isPending}
                                        className={`w-full pl-10 pr-12 py-3 border ${validationErrors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} rounded-lg focus:ring-2 focus:border-transparent outline-none transition disabled:bg-gray-50 disabled:text-gray-500`}
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={isPending}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {validationErrors.password && (
                                    <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
                                )}
                            </div>

                            {/* Role Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    I am a
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <label className="cursor-pointer">
                                        <input
                                            type="radio"
                                            name="role"
                                            value="job_seeker"
                                            defaultChecked
                                            disabled={isPending}
                                            className="peer sr-only"
                                        />
                                        <div className={`p-3 rounded-lg border-2 ${validationErrors.role ? 'border-red-300' : 'border-gray-200'} peer-checked:border-blue-600 peer-checked:bg-blue-50 peer-checked:text-blue-700 hover:border-gray-300 transition-all peer-disabled:opacity-50`}>
                                            <User className="w-5 h-5 mx-auto mb-1" />
                                            <span className="text-sm font-medium block text-center">Job Seeker</span>
                                        </div>
                                    </label>
                                    <label className="cursor-pointer">
                                        <input
                                            type="radio"
                                            name="role"
                                            value="recruiter"
                                            disabled={isPending}
                                            className="peer sr-only"
                                        />
                                        <div className={`p-3 rounded-lg border-2 ${validationErrors.role ? 'border-red-300' : 'border-gray-200'} peer-checked:border-blue-600 peer-checked:bg-blue-50 peer-checked:text-blue-700 hover:border-gray-300 transition-all peer-disabled:opacity-50`}>
                                            <Briefcase className="w-5 h-5 mx-auto mb-1" />
                                            <span className="text-sm font-medium block text-center">Recruiter</span>
                                        </div>
                                    </label>
                                </div>
                                {validationErrors.role && (
                                    <p className="mt-1 text-sm text-red-600">{validationErrors.role}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-300 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Creating account...
                                    </>
                                ) : (
                                    'Create Account'
                                )}
                            </button>
                        </form>

                        {/* Login Link */}
                        <p className="mt-6 text-center text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
