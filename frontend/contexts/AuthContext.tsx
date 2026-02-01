import { createContext, useState, useEffect, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { API_BASE_URL } from '../src/utils/config';

// Types
type User = {
    _id: string;
    fullname: string;
    email: string;
    phoneNumber?: string;
    role: 'job_seeker' | 'recruiter';
    profile?: any;
};

type AuthContextType = {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    signup: (fullname: string, email: string, password: string, role: string, phoneNumber?: string, companyName?: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    refetchUser: () => Promise<void>;
};

// Create Context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Props
type AuthContextProviderProps = {
    children: ReactNode;
};

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const queryClient = useQueryClient();



    // Base URL for API
    const API_URL = `${API_BASE_URL}/user`;

    // Fetch current user (on mount and after login/signup)
    const fetchUser = async () => {
        try {
            const response = await fetch(`${API_URL}/me`, {
                credentials: 'include', // Include cookies
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Failed to fetch user:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // Login function
    const login = async (email: string, password: string) => {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            });

            const result = await response.json();

            if (!response.ok || !result.success) {  // Check both
                return { success: false, error: result.message || 'Login failed' };
            }
            setUser(result.user);

            // Clear all cached queries when logging in to prevent stale data
            queryClient.clear();

            return { success: true };
        } catch (error) {
            return { success: false, error: 'Login failed. Please try again.' };
        }
    };

    // Signup function
    const signup = async (
        fullname: string,
        email: string,
        password: string,
        role: string,
        phoneNumber?: string,
        companyName?: string
    ) => {
        try {
            const body: any = { fullname, email, password, role };

            if (phoneNumber) {
                body.phoneNumber = phoneNumber;
            }

            if (role === 'recruiter' && companyName) {
                body.profile = {
                    company: {
                        name: companyName
                    }
                };
            }

            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
                credentials: 'include',
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                return { success: false, error: result.message || 'Signup failed' };
            }
            setUser(result.user);
            return { success: true };
        } catch (error) {
            return { success: false, error: 'Signup failed. Please try again.' };
        }
    };

    // Logout function
    const logout = async () => {
        try {
            const response = await fetch(`${API_URL}/logout`, {
                method: 'GET',
                credentials: 'include',
            });

            // Wait for response to ensure cookie is cleared
            await response.json();

            // Clear user state
            setUser(null);

            // Clear all cached queries to prevent stale data on next login
            queryClient.clear();
        } catch (error) {
            console.error('Logout failed:', error);
            // Still clear user state even if API call fails
            setUser(null);

            // Clear all cached queries even if logout API fails
            queryClient.clear();
        }
    };

    // Fetch user on mount
    useEffect(() => {
        fetchUser();
    }, []);

    const value: AuthContextType = {
        user,
        loading,
        login,
        signup,
        logout,
        refetchUser: fetchUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};