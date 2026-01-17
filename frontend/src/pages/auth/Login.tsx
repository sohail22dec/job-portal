import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { loginSchema, type LoginFormData } from '../../schemas/authSchemas';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);

    const { login } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: 'onBlur',
    });

    const loginMutation = useMutation({
        mutationFn: async (data: LoginFormData) => {
            return await login(data.email, data.password);
        },
        onSuccess: (result) => {
            if (result.success) {
                showToast('Successfully logged in!', 'success');
                navigate('/dashboard');
            } else if (result.error) {
                showToast(result.error, 'error');
            }
        },
        onError: (error: any) => {
            showToast(error.message || 'Login failed', 'error');
        },
    });

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-semibold text-gray-900 mb-2">Welcome Back</h2>
                    <p className="text-gray-600">Sign in to your account</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-8">
                    <form onSubmit={handleSubmit((data: LoginFormData) => loginMutation.mutate(data))}>
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

                        <div className="mb-6">
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

                        <button
                            type="submit"
                            disabled={loginMutation.isPending}
                            className="w-full py-3 bg-black text-white font-medium rounded hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                        >
                            {loginMutation.isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>

                        <p className="mt-6 text-center text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-black font-medium hover:underline">
                                Create account
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
