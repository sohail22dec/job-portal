import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { signupSchema, type SignupFormData } from '../../schemas/authSchemas';

const Signup = () => {
    const [showPassword, setShowPassword] = useState(false);

    const { signup } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        mode: 'onBlur',
    });

    const selectedRole = watch('role');

    const signupMutation = useMutation({
        mutationFn: async (data: SignupFormData) => {
            return await signup(
                data.fullname,
                data.email,
                data.password,
                data.role,
                data.phoneNumber || '',
                data.companyName || ''
            );
        },
        onSuccess: (result) => {
            if (result.success) {
                showToast('Account created successfully!', 'success');
                navigate('/dashboard');
            } else if (result.error) {
                showToast(result.error, 'error');
            }
        },
        onError: (error: any) => {
            showToast(error.message || 'Signup failed', 'error');
        },
    });

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-semibold text-gray-900 mb-2">Create Account</h2>
                    <p className="text-gray-600">Start your journey today</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-8">
                    <form onSubmit={handleSubmit((data: SignupFormData) => signupMutation.mutate(data))}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                {...register('fullname')}
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-black outline-none text-sm"
                            />
                            {errors.fullname && (
                                <p className="mt-1 text-xs text-red-600">{errors.fullname.message}</p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                {...register('email')}
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-black outline-none text-sm"
                            />
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    {...register('password')}
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
                            {errors.password && (
                                <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
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
                                    placeholder="1234567890"
                                    {...register('phoneNumber')}
                                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-black outline-none text-sm"
                                />
                                {errors.phoneNumber && (
                                    <p className="mt-1 text-xs text-red-600">{errors.phoneNumber.message}</p>
                                )}
                            </div>
                        )}

                        {selectedRole === 'recruiter' && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Company Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Your Company Inc."
                                    {...register('companyName')}
                                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-black outline-none text-sm"
                                />
                                {errors.companyName && (
                                    <p className="mt-1 text-xs text-red-600">{errors.companyName.message}</p>
                                )}
                            </div>
                        )}

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
                                        value="job_seeker"
                                        {...register('role')}
                                        className="sr-only"
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
                                        value="recruiter"
                                        {...register('role')}
                                        className="sr-only"
                                    />
                                    <div className="text-center">
                                        <div className="text-sm font-medium text-gray-900">Recruiter</div>
                                    </div>
                                </label>
                            </div>
                            {errors.role && (
                                <p className="mt-1 text-xs text-red-600">{errors.role.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={signupMutation.isPending}
                            className="w-full py-3 bg-black text-white font-medium rounded hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                        >
                            {signupMutation.isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>

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
