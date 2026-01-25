import { Briefcase, Users, Building2, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { jobQueries } from '../../api/queries/jobQueries';

const StatsSection = () => {
    // Fetch jobs to calculate real stats
    const { data: jobs = [], isLoading } = useQuery(jobQueries.list());

    // Calculate real statistics
    const activeJobs = jobs.length;

    // Count unique companies (based on company name)
    const uniqueCompanies = new Set(
        jobs
            .map((job: any) => job.createdBy?.profile?.company?.name)
            .filter(Boolean)
    ).size;

    // For now, we'll show a motivational message instead of fake user counts
    // In the future, you could add API endpoints to get real user statistics

    const stats = [
        {
            icon: Briefcase,
            number: activeJobs > 0 ? activeJobs.toString() : '0',
            label: 'Active Jobs',
            gradient: 'from-blue-500 to-cyan-500',
            show: true,
        },
        {
            icon: Building2,
            number: uniqueCompanies > 0 ? uniqueCompanies.toString() : '0',
            label: uniqueCompanies === 1 ? 'Company' : 'Companies',
            gradient: 'from-purple-500 to-pink-500',
            show: true,
        },
        {
            icon: TrendingUp,
            number: '100%',
            label: 'Quality Focus',
            gradient: 'from-pink-500 to-rose-500',
            show: activeJobs > 0,
        },
        {
            icon: Users,
            number: 'Growing',
            label: 'Community',
            gradient: 'from-indigo-500 to-purple-500',
            show: activeJobs > 0,
        },
    ];

    const visibleStats = stats.filter(stat => stat.show);

    // Hide section if no jobs
    if (isLoading || activeJobs === 0) {
        return null;
    }

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-10 right-20 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-10"></div>
                <div className="absolute bottom-10 left-20 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-10"></div>
            </div>

            <div className="max-w-7xl mx-auto relative">
                <div className="text-center mb-16">
                    <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                        Join Our Platform
                    </h2>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                        Start your journey with us. Connect with opportunities and build your future.
                    </p>
                </div>

                <div className={`grid grid-cols-2 ${visibleStats.length === 4 ? 'md:grid-cols-4' : 'md:grid-cols-2'} gap-8`}>
                    {visibleStats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className="group relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 hover:bg-white/20 hover:-translate-y-2 transition-all duration-300">
                                <div className={`inline-flex p-4 bg-gradient-to-br ${stat.gradient} rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon className="w-8 h-8 text-white" />
                                </div>
                                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                                <div className="text-blue-100 font-medium">{stat.label}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;

