import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { Rocket, Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import HeroSection from '../../components/landing/HeroSection';
import FeaturesSection from '../../components/landing/FeaturesSection';
import FeaturedJobsSection from '../../components/landing/FeaturedJobsSection';
import StatsSection from '../../components/landing/StatsSection';
import HowItWorksSection from '../../components/landing/HowItWorksSection';
import TestimonialsSection from '../../components/landing/TestimonialsSection';
import CTASection from '../../components/landing/CTASection';

const LandingPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Redirect to dashboard if user is already logged in
    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <HeroSection />
            <FeaturesSection />
            <FeaturedJobsSection />
            <StatsSection />
            <HowItWorksSection />
            <TestimonialsSection />
            <CTASection />

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                        {/* Brand Section */}
                        <div className="lg:col-span-1">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
                                    <Rocket className="h-6 w-6 text-white" />
                                </div>
                                <span className="text-2xl font-bold text-white">JobPortal</span>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                Connect talented professionals with amazing opportunities. Your career journey starts here.
                            </p>
                            <div className="flex gap-3">
                                <a
                                    href="https://twitter.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-gray-800 hover:bg-blue-600 rounded-lg transition-colors duration-200">
                                    <Twitter className="w-5 h-5" />
                                </a>
                                <a
                                    href="https://linkedin.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-gray-800 hover:bg-blue-600 rounded-lg transition-colors duration-200">
                                    <Linkedin className="w-5 h-5" />
                                </a>
                                <a
                                    href="https://github.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-gray-800 hover:bg-blue-600 rounded-lg transition-colors duration-200">
                                    <Github className="w-5 h-5" />
                                </a>
                                <a
                                    href="mailto:contact@jobportal.com"
                                    className="p-2 bg-gray-800 hover:bg-blue-600 rounded-lg transition-colors duration-200">
                                    <Mail className="w-5 h-5" />
                                </a>
                            </div>
                        </div>

                        {/* For Job Seekers */}
                        <div>
                            <h3 className="text-white font-semibold mb-4">For Job Seekers</h3>
                            <ul className="space-y-3">
                                <li>
                                    <Link to="/jobs" className="text-gray-400 hover:text-white transition-colors text-sm">
                                        Browse Jobs
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/signup" className="text-gray-400 hover:text-white transition-colors text-sm">
                                        Create Profile
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/login" className="text-gray-400 hover:text-white transition-colors text-sm">
                                        Job Seeker Login
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* For Employers */}
                        <div>
                            <h3 className="text-white font-semibold mb-4">For Employers</h3>
                            <ul className="space-y-3">
                                <li>
                                    <Link to="/signup" className="text-gray-400 hover:text-white transition-colors text-sm">
                                        Post a Job
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/login" className="text-gray-400 hover:text-white transition-colors text-sm">
                                        Recruiter Login
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Company */}
                        <div>
                            <h3 className="text-white font-semibold mb-4">Company</h3>
                            <ul className="space-y-3">
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                                        About Us
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                                        Contact
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                                        Privacy Policy
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                                        Terms of Service
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="pt-8 border-t border-gray-800">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <p className="text-sm text-gray-400">
                                © 2026 JobPortal. All rights reserved.
                            </p>
                            <p className="text-sm text-gray-400">
                                Made with <span className="text-red-500">❤️</span> for job seekers and recruiters
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;


