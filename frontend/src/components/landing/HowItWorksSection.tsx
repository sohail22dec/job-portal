import { useState } from 'react';
import { UserPlus, FileText, Send, CheckCircle, Briefcase, Eye, UserCheck, ArrowRight, Sparkles, Building2 } from 'lucide-react';

const HowItWorksSection = () => {
    const [activeTab, setActiveTab] = useState<'jobseeker' | 'recruiter'>('jobseeker');

    const jobSeekerSteps = [
        {
            icon: UserPlus,
            title: 'Create Your Profile',
            description: 'Sign up in seconds and build your professional profile. Add your skills, experience, and career preferences to get started.',
            gradient: 'from-blue-500 to-cyan-500',
            iconBg: 'bg-blue-50',
            iconColor: 'text-blue-600',
        },
        {
            icon: FileText,
            title: 'Upload Resume',
            description: 'Upload your resume or build one using our intuitive tools. Highlight your achievements and stand out from the crowd.',
            gradient: 'from-indigo-500 to-purple-500',
            iconBg: 'bg-indigo-50',
            iconColor: 'text-indigo-600',
        },
        {
            icon: Send,
            title: 'Apply with One Click',
            description: 'Browse thousands of opportunities and apply instantly. Track all your applications in real-time from your dashboard.',
            gradient: 'from-purple-500 to-pink-500',
            iconBg: 'bg-purple-50',
            iconColor: 'text-purple-600',
        },
        {
            icon: CheckCircle,
            title: 'Get Hired',
            description: 'Connect with recruiters, prepare for interviews, and land your dream job. We support you throughout the entire journey.',
            gradient: 'from-pink-500 to-rose-500',
            iconBg: 'bg-pink-50',
            iconColor: 'text-pink-600',
        },
    ];

    const recruiterSteps = [
        {
            icon: Building2,
            title: 'Setup Company Profile',
            description: 'Create your company profile in minutes. Showcase your culture, values, and what makes you an amazing place to work.',
            gradient: 'from-blue-500 to-cyan-500',
            iconBg: 'bg-blue-50',
            iconColor: 'text-blue-600',
        },
        {
            icon: Briefcase,
            title: 'Post Job Listings',
            description: 'Create compelling job postings with detailed requirements. Reach thousands of qualified candidates instantly.',
            gradient: 'from-indigo-500 to-purple-500',
            iconBg: 'bg-indigo-50',
            iconColor: 'text-indigo-600',
        },
        {
            icon: Eye,
            title: 'Review Applicants',
            description: 'Browse qualified candidates, filter by skills and experience. Manage all applications efficiently in one place.',
            gradient: 'from-purple-500 to-pink-500',
            iconBg: 'bg-purple-50',
            iconColor: 'text-purple-600',
        },
        {
            icon: UserCheck,
            title: 'Hire Top Talent',
            description: 'Connect with the best candidates, schedule interviews, and make offers. Build your dream team effortlessly.',
            gradient: 'from-pink-500 to-rose-500',
            iconBg: 'bg-pink-50',
            iconColor: 'text-pink-600',
        },
    ];

    const steps = activeTab === 'jobseeker' ? jobSeekerSteps : recruiterSteps;

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>

            <div className="max-w-7xl mx-auto relative">
                <div className="text-center mb-16">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
                        <Sparkles className="w-4 h-4" />
                        Simple Process
                    </div>

                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                        How It <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Works</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
                        Getting started is easy. Follow these simple steps to achieve your goals.
                    </p>

                    <div className="inline-flex gap-2 p-1.5 bg-white rounded-2xl shadow-lg border border-gray-200">
                        <button
                            onClick={() => setActiveTab('jobseeker')}
                            className={`px-8 py-3.5 rounded-xl font-semibold transition-all duration-300 relative ${activeTab === 'jobseeker'
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-200'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}>
                            {activeTab === 'jobseeker' && (
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-30"></div>
                            )}
                            <span className="relative">For Job Seekers</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('recruiter')}
                            className={`px-8 py-3.5 rounded-xl font-semibold transition-all duration-300 relative ${activeTab === 'recruiter'
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-200'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}>
                            {activeTab === 'recruiter' && (
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-30"></div>
                            )}
                            <span className="relative">For Recruiters</span>
                        </button>
                    </div>
                </div>

                {/* Steps Grid with animations */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                    {/* Animated connecting arrows */}
                    {steps.map((_, index) => (
                        index < steps.length - 1 && (
                            <div
                                key={`arrow-${index}`}
                                className="hidden lg:block absolute top-1/2 transform -translate-y-1/2"
                                style={{
                                    left: `${(index + 1) * 25 - 2.5}%`,
                                    width: '5%',
                                }}>
                                <ArrowRight className="w-8 h-8 text-blue-300 mx-auto" />
                            </div>
                        )
                    ))}

                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <div key={index} className="relative group">
                                {/* Card */}
                                <div className="bg-white border-2 border-gray-100 rounded-3xl p-8 hover:shadow-2xl hover:border-blue-200 hover:-translate-y-2 transition-all duration-500 relative overflow-hidden h-full">
                                    {/* Gradient overlay on hover */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

                                    {/* Step number badge */}
                                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg opacity-90 group-hover:opacity-100 transition-opacity">
                                        {index + 1}
                                    </div>

                                    {/* Icon container */}
                                    <div className="relative mb-6">
                                        <div className={`inline-flex p-5 ${step.iconBg} rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                                            <Icon className={`w-10 h-10 ${step.iconColor}`} />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed text-sm">
                                        {step.description}
                                    </p>

                                    {/* Bottom accent line */}
                                    <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${step.gradient} w-0 group-hover:w-full transition-all duration-500`}></div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* CTA at bottom */}
                <div className="text-center mt-16">
                    <a
                        href="/signup"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-blue-300 transition-all duration-300 hover:-translate-y-1 group">
                        Get Started Free
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </a>
                    <p className="text-sm text-gray-500 mt-4">No credit card required • Free forever</p>
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;
