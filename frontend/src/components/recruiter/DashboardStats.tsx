import type { LucideIcon } from 'lucide-react';
import { Briefcase, Users, Calendar } from 'lucide-react';

type StatsCardProps = {
    label: string;
    value: number;
    icon: LucideIcon;
    iconColor: 'blue' | 'green' | 'indigo' | 'purple' | 'red' | 'yellow';
};

const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600',
    yellow: 'bg-yellow-100 text-yellow-600',
};

const StatsCard = ({ label, value, icon: Icon, iconColor }: StatsCardProps) => {
    return (
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-600 text-sm font-medium">{label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[iconColor]}`}>
                    <Icon className="w-8 h-8" />
                </div>
            </div>
        </div>
    );
};

type DashboardStatsProps = {
    totalJobs: number;
    totalApplicants: number;
    activeJobs: number;
};

const DashboardStats = ({ totalJobs, totalApplicants, activeJobs }: DashboardStatsProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatsCard
                label="Total Jobs"
                value={totalJobs}
                icon={Briefcase}
                iconColor="blue"
            />
            <StatsCard
                label="Total Applicants"
                value={totalApplicants}
                icon={Users}
                iconColor="green"
            />
            <StatsCard
                label="Active Jobs"
                value={activeJobs}
                icon={Calendar}
                iconColor="indigo"
            />
        </div>
    );
};

export default DashboardStats;
