import { Link } from 'react-router';
import { ArrowRight, Sparkles } from 'lucide-react';

const CTASection = () => {
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0">
                <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-blob"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
            </div>

            <div className="max-w-4xl mx-auto text-center relative">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full mb-6 font-medium text-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>Join thousands of successful users</span>
                </div>

                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                    Ready to Take the Next Step in Your Career?
                </h2>

                <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Whether you're seeking your dream job or looking to hire exceptional talent, JobPortal is here to help you succeed.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                    <Link
                        to="/signup"
                        className="group px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:shadow-2xl hover:shadow-white/30 transition-all duration-300 hover:-translate-y-1 flex items-center gap-2">
                        Get Started Free
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        to="/jobs"
                        className="px-8 py-4 bg-transparent text-white font-semibold rounded-xl border-2 border-white/30 hover:bg-white/10 hover:border-white hover:shadow-xl transition-all duration-300 flex items-center gap-2">
                        Browse Jobs
                    </Link>
                </div>

                <p className="text-blue-100 text-sm">
                    No credit card required • Free forever • Get started in 2 minutes
                </p>
            </div>
        </section>
    );
};

export default CTASection;
