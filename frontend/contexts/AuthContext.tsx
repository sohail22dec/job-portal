import { createContext, useState, useEffect, type ReactNode } from 'react';

// Types
type User = {
    _id: string;
    fullname: string;
    email: string;
    role: 'job_seeker' | 'recruiter';
    profile?: any;
};

type AuthContextType = {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string, role: string) => Promise<{ success: boolean; error?: string }>;
    signup: (fullname: string, email: string, password: string, role: string) => Promise<{ success: boolean; error?: string }>;
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

    // Base URL for API
    const API_URL = 'http://localhost:8000/api/v1/user';

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
    const login = async (email: string, password: string, role: string) => {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, role }),
                credentials: 'include',
            });

            const result = await response.json();

            if (!response.ok) {
                return { success: false, error: result.message || 'Login failed' };
            }
            setUser(result.user);

            return { success: true };
        } catch (error) {
            return { success: false, error: 'Login failed. Please try again.' };
        }
    };

    // Signup function
    const signup = async (fullname: string, email: string, password: string, role: string) => {
        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullname, email, password, role }),
                credentials: 'include',
            });

            const result = await response.json();

            if (!response.ok) {
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
            await fetch(`${API_URL}/logout`, {
                method: 'GET',
                credentials: 'include',
            });
            setUser(null);
        } catch (error) {
            console.error('Logout failed:', error);
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