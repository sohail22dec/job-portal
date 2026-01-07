import { Link } from 'react-router';
import { ArrowRight, Search, Briefcase, Star } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Hero Section */}
            <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
                {/* Background decorations */}
                <div className="absolute top-20 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-40 left-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

                <div className="max-w-7xl mx-auto relative">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full mb-8 font-medium text-sm">
                            <Star className="w-4 h-4 fill-current" />
                            <span>Trusted by 10,000+ professionals</span>
                        </div>

                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                            Find Your <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Dream Job</span>
                            <br />
                            Or Hire <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Top Talent</span>
                        </h1>

                        <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                            Connect with opportunities that match your skills. Whether you're looking for your next role or the perfect candidate, we've got you covered.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                            <Link
                                to="/signup"
                                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-blue-300 transition-all duration-300 hover:-translate-y-1 flex items-center gap-2">
                                Get Started Free
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/jobs"
                                className="px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 flex items-center gap-2">
                                <Search className="w-5 h-5" />
                                Browse Jobs
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100">
                                <div className="text-3xl font-bold text-blue-600 mb-1">10K+</div>
                                <div className="text-gray-600 text-sm">Active Jobs</div>
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100">
                                <div className="text-3xl font-bold text-indigo-600 mb-1">50K+</div>
                                <div className="text-gray-600 text-sm">Job Seekers</div>
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100">
                                <div className="text-3xl font-bold text-purple-600 mb-1">2K+</div>
                                <div className="text-gray-600 text-sm">Companies</div>
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100">
                                <div className="text-3xl font-bold text-pink-600 mb-1">95%</div>
                                <div className="text-gray-600 text-sm">Success Rate</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center gap-2 mb-4 md:mb-0">
                            <div className="p-2 bg-blue-600 rounded-lg">
                                <Briefcase className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white">JobPortal</span>
                        </div>
                        <div className="text-center md:text-right">
                            <p className="text-sm">© 2026 JobPortal. All rights reserved.</p>
                            <p className="text-sm mt-1">Made with ❤️ for job seekers and recruiters</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
