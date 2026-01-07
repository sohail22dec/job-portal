import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router';
import { Menu, X, Briefcase, User as UserIcon, LogOut, Settings, LayoutDashboard, FileText, Heart, ChevronDown } from 'lucide-react';
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
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="p-2 bg-blue-600 rounded-lg group-hover:bg-blue-700 transition-colors">
                            <Briefcase className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            JobPortal
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Home</Link>
                        <Link to="/jobs" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Find Jobs</Link>
                        <Link to="/browse" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Browse</Link>
                    </div>

                    {/* Auth Section */}
                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg hover:from-blue-100 hover:to-indigo-100 transition-all border border-blue-100"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                                            <UserIcon className="h-4 w-4 text-white" />
                                        </div>
                                        <div className="flex flex-col items-start">
                                            <span className="text-sm font-semibold text-gray-800">{user.fullname}</span>
                                            <span className="text-xs text-gray-500 capitalize">{user.role.replace('_', ' ')}</span>
                                        </div>
                                    </div>
                                    <ChevronDown className={`h-4 w-4 text-gray-600 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                        {/* Dashboard */}
                                        <Link
                                            to="/dashboard"
                                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                            onClick={() => setShowDropdown(false)}
                                        >
                                            <LayoutDashboard className="h-5 w-5" />
                                            <span className="font-medium">Dashboard</span>
                                        </Link>

                                        {/* My Profile */}
                                        <Link
                                            to="/profile"
                                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                            onClick={() => setShowDropdown(false)}
                                        >
                                            <UserIcon className="h-5 w-5" />
                                            <span className="font-medium">My Profile</span>
                                        </Link>

                                        {/* Role-Specific Options */}
                                        {user.role === 'job_seeker' ? (
                                            <>
                                                <Link
                                                    to="/applied-jobs"
                                                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                                    onClick={() => setShowDropdown(false)}
                                                >
                                                    <FileText className="h-5 w-5" />
                                                    <span className="font-medium">Applied Jobs</span>
                                                </Link>
                                                <Link
                                                    to="/saved-jobs"
                                                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                                    onClick={() => setShowDropdown(false)}
                                                >
                                                    <Heart className="h-5 w-5" />
                                                    <span className="font-medium">Saved Jobs</span>
                                                </Link>
                                            </>
                                        ) : (
                                            <>
                                                <Link
                                                    to="/posted-jobs"
                                                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                                    onClick={() => setShowDropdown(false)}
                                                >
                                                    <FileText className="h-5 w-5" />
                                                    <span className="font-medium">Posted Jobs</span>
                                                </Link>
                                                <Link
                                                    to="/applications"
                                                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                                    onClick={() => setShowDropdown(false)}
                                                >
                                                    <Heart className="h-5 w-5" />
                                                    <span className="font-medium">Applications</span>
                                                </Link>
                                            </>
                                        )}

                                        {/* Settings */}
                                        <Link
                                            to="/settings"
                                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                            onClick={() => setShowDropdown(false)}
                                        >
                                            <Settings className="h-5 w-5" />
                                            <span className="font-medium">Settings</span>
                                        </Link>

                                        {/* Divider */}
                                        <div className="my-2 border-t border-gray-100"></div>

                                        {/* Logout */}
                                        <button
                                            onClick={() => {
                                                setShowDropdown(false);
                                                handleLogout();
                                            }}
                                            className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                                        >
                                            <LogOut className="h-5 w-5" />
                                            <span className="font-medium">Logout</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="px-4 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors">
                                    Log in
                                </Link>
                                <Link to="/signup" className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5">
                                    Sign up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={toggleMenu} className="text-gray-600 hover:text-gray-900 focus:outline-none">
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-b border-gray-100">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-center">
                        <Link to="/" className="block px-3 py-2 text-gray-600 hover:text-blue-600 font-medium w-full text-center">Home</Link>
                        <Link to="/jobs" className="block px-3 py-2 text-gray-600 hover:text-blue-600 font-medium w-full text-center">Find Jobs</Link>
                        <Link to="/browse" className="block px-3 py-2 text-gray-600 hover:text-blue-600 font-medium w-full text-center">Browse</Link>
                        <div className="border-t border-gray-100 w-full my-2"></div>
                        {user ? (
                            <>
                                <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg w-full justify-center">
                                    <UserIcon className="h-5 w-5 text-blue-600" />
                                    <span className="text-sm font-medium text-gray-700">{user.fullname}</span>
                                </div>
                                <Link to="/dashboard" className="block px-3 py-2 text-gray-600 hover:text-blue-600 font-medium w-full text-center">Dashboard</Link>
                                <Link to="/profile" className="block px-3 py-2 text-gray-600 hover:text-blue-600 font-medium w-full text-center">My Profile</Link>
                                {user.role === 'job_seeker' ? (
                                    <>
                                        <Link to="/applied-jobs" className="block px-3 py-2 text-gray-600 hover:text-blue-600 font-medium w-full text-center">Applied Jobs</Link>
                                        <Link to="/saved-jobs" className="block px-3 py-2 text-gray-600 hover:text-blue-600 font-medium w-full text-center">Saved Jobs</Link>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/posted-jobs" className="block px-3 py-2 text-gray-600 hover:text-blue-600 font-medium w-full text-center">Posted Jobs</Link>
                                        <Link to="/applications" className="block px-3 py-2 text-gray-600 hover:text-blue-600 font-medium w-full text-center">Applications</Link>
                                    </>
                                )}
                                <Link to="/settings" className="block px-3 py-2 text-gray-600 hover:text-blue-600 font-medium w-full text-center">Settings</Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-3 py-2 text-red-600 font-medium w-full justify-center"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="block px-3 py-2 text-blue-600 font-medium w-full text-center">Log in</Link>
                                <Link to="/signup" className="block w-full px-3 py-2 bg-blue-600 text-white font-medium rounded-lg text-center mx-2 hover:bg-blue-700">Sign up</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
