import { Link } from 'react-router';
import { ArrowRight, Search, Star } from 'lucide-react';

const HeroSection = () => {
    return (
        <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-20 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-40 left-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

            <div className="max-w-7xl mx-auto relative">
                <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full mb-8 font-medium text-sm animate-fade-in-up">
                        <Star className="w-4 h-4 fill-current" />
                        <span>Trusted by 10,000+ professionals</span>
                    </div>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in-up animation-delay-200">
                        Find Your <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Dream Job</span>
                        <br />
                        Or Hire <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Top Talent</span>
                    </h1>

                    <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-400">
                        Connect with opportunities that match your skills. Whether you're looking for your next role or the perfect candidate, we've got you covered.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in-up animation-delay-600">
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
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
