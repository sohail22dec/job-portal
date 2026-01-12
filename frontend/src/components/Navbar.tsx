import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router';
import { Menu, X, User as UserIcon, LogOut, ChevronDown, Plus, FileText, Building2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { user, logout } = useAuth();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = async () => {
        await logout();
        window.location.href = '/';
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
                        <Building2 className="h-6 w-6 text-gray-900" />
                        <span className="text-xl font-semibold text-gray-900">EasyHire</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        {user ? (
                            <>
                                {user.role === 'job_seeker' ? (
                                    <>
                                        <Link to="/jobs" className="text-sm text-gray-700 hover:text-black font-medium transition">
                                            Browse Jobs
                                        </Link>
                                        <Link to="/job-seeker-dashboard" className="text-sm text-gray-700 hover:text-black font-medium transition">
                                            My Applications
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/recruiter-dashboard" className="text-sm text-gray-700 hover:text-black font-medium transition">
                                            My Jobs
                                        </Link>
                                        <Link to="/post-job" className="flex items-center gap-1.5 px-4 py-2 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 transition">
                                            <Plus className="w-4 h-4" />
                                            Post Job
                                        </Link>
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                <Link to="/jobs" className="text-sm text-gray-700 hover:text-black font-medium transition">
                                    Browse Jobs
                                </Link>
                                <Link to="/signup?role=recruiter" className="text-sm text-gray-700 hover:text-black font-medium transition">
                                    For Employers
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Auth Section */}
                    <div className="hidden md:flex items-center gap-3">
                        {user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded hover:border-gray-300 transition"
                                >
                                    <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                                        <UserIcon className="h-4 w-4 text-white" />
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <span className="text-sm font-medium text-gray-900">{user.fullname}</span>
                                        <span className="text-xs text-gray-500 capitalize">{user.role.replace('_', ' ')}</span>
                                    </div>
                                    <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                                        {user.role === 'job_seeker' ? (
                                            <>
                                                <Link
                                                    to="/profile"
                                                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                                                    onClick={() => setShowDropdown(false)}
                                                >
                                                    <UserIcon className="h-4 w-4" />
                                                    My Profile
                                                </Link>
                                                <Link
                                                    to="/saved-jobs"
                                                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                                                    onClick={() => setShowDropdown(false)}
                                                >
                                                    <FileText className="h-4 w-4" />
                                                    Saved Jobs
                                                </Link>
                                            </>
                                        ) : (
                                            <Link
                                                to="/company-profile"
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                                                onClick={() => setShowDropdown(false)}
                                            >
                                                <Building2 className="h-4 w-4" />
                                                Recruiter Profile
                                            </Link>
                                        )}

                                        <div className="my-1 border-t border-gray-100"></div>

                                        <button
                                            onClick={() => {
                                                setShowDropdown(false);
                                                handleLogout();
                                            }}
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition w-full text-left"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="px-4 py-2 text-sm text-gray-700 hover:text-black font-medium transition">
                                    Log in
                                </Link>
                                <Link to="/signup" className="px-4 py-2 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 transition">
                                    Sign up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={toggleMenu} className="text-gray-700 hover:text-black">
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-200">
                    <div className="px-4 py-4 space-y-2">
                        {user ? (
                            <>
                                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded mb-3">
                                    <UserIcon className="h-5 w-5 text-gray-700" />
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">{user.fullname}</div>
                                        <div className="text-xs text-gray-500 capitalize">{user.role.replace('_', ' ')}</div>
                                    </div>
                                </div>

                                {user.role === 'job_seeker' ? (
                                    <>
                                        <Link to="/jobs" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition">
                                            Browse Jobs
                                        </Link>
                                        <Link to="/job-seeker-dashboard" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition">
                                            My Applications
                                        </Link>
                                        <Link to="/profile" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition">
                                            My Profile
                                        </Link>
                                        <Link to="/saved-jobs" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition">
                                            Saved Jobs
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/recruiter-dashboard" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition">
                                            My Jobs
                                        </Link>
                                        <Link to="/post-job" className="flex items-center gap-2 px-3 py-2 bg-black text-white text-sm font-medium rounded">
                                            <Plus className="w-4 h-4" />
                                            Post Job
                                        </Link>
                                        <Link to="/company-profile" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition">
                                            Company Profile
                                        </Link>
                                    </>
                                )}

                                <div className="border-t border-gray-100 my-2"></div>

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition w-full"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/jobs" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition">
                                    Browse Jobs
                                </Link>
                                <Link to="/signup?role=recruiter" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition">
                                    For Employers
                                </Link>
                                <div className="border-t border-gray-100 my-2"></div>
                                <Link to="/login" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition">
                                    Log in
                                </Link>
                                <Link to="/signup" className="block px-3 py-2 bg-black text-white text-sm font-medium rounded text-center">
                                    Sign up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
