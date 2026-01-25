import { Target, Zap, Bell, Building2 } from 'lucide-react';

const FeaturesSection = () => {
    const features = [
        {
            icon: Target,
            title: 'Smart Job Matching',
            description: 'AI-powered algorithm matches you with jobs that fit your skills, experience, and preferences perfectly.',
            gradient: 'from-blue-500 to-cyan-500',
        },
        {
            icon: Zap,
            title: 'Easy Application',
            description: 'Apply to multiple jobs with a single click. Your profile is your resume, always up-to-date.',
            gradient: 'from-indigo-500 to-purple-500',
        },
        {
            icon: Bell,
            title: 'Real-time Notifications',
            description: 'Get instant updates on application status, new job matches, and messages from recruiters.',
            gradient: 'from-purple-500 to-pink-500',
        },
        {
            icon: Building2,
            title: 'Company Insights',
            description: 'Research companies, read reviews, and learn about culture before you apply. Make informed decisions.',
            gradient: 'from-pink-500 to-rose-500',
        },
    ];

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                        Why Choose <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">JobPortal</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Everything you need to find your next opportunity or perfect candidate in one place.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="group relative bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer">
                                <div className={`inline-flex p-4 bg-gradient-to-br ${feature.gradient} rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>

                                {/* Hover glow effect */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
