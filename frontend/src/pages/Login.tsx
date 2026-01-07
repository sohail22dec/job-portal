import { useActionState, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Briefcase, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

type LoginState = {
    error?: string;
    success?: boolean;
};

type ValidationErrors = {
    email?: string;
    password?: string;
};

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const { login } = useAuth();
    const navigate = useNavigate();

    const validateForm = (formData: FormData): boolean => {
        const errors: ValidationErrors = {};
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

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

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const loginAction = async (_prevState: LoginState, formData: FormData): Promise<LoginState> => {
        // Clear previous validation errors
        setValidationErrors({});

        // Validate form
        if (!validateForm(formData)) {
            return { error: 'Please fix the errors below' };
        }

        const result = await login(
            formData.get('email') as string,
            formData.get('password') as string
        );

        if (result.success) {
            navigate('/dashboard');
            return { success: true };
        }

        return { error: result.error || 'Login failed' };
    };

    const [state, action, isPending] = useActionState(loginAction, { success: false });

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
                        <h2 className="text-3xl font-bold text-gray-900">Welcome back!</h2>
                        <p className="mt-2 text-gray-600">Sign in to continue your job search</p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        {/* Error Message */}
                        {state.error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600">{state.error}</p>
                            </div>
                        )}

                        <form action={action} className="space-y-6">
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

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-300 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </form>

                        {/* Signup Link */}
                        <p className="mt-6 text-center text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/signup" className="font-semibold text-blue-600 hover:text-blue-700">
                                Sign up for free
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
