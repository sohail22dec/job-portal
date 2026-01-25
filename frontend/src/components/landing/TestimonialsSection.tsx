import { Star, Quote } from 'lucide-react';

const TestimonialsSection = () => {
    const testimonials = [
        {
            name: 'Sarah Johnson',
            role: 'Software Engineer',
            company: 'TechCorp',
            image: '👩‍💻',
            quote: 'I found my dream job in just two weeks! The platform made it so easy to apply and track my applications. The matching algorithm really works!',
            rating: 5,
            type: 'Job Seeker',
        },
        {
            name: 'Michael Chen',
            role: 'HR Director',
            company: 'Innovation Labs',
            image: '👨‍💼',
            quote: 'We\'ve hired 15 amazing candidates through JobPortal. The quality of applicants is outstanding, and the platform saves us so much time.',
            rating: 5,
            type: 'Recruiter',
        },
        {
            name: 'Emily Rodriguez',
            role: 'Product Designer',
            company: 'Creative Studios',
            image: '👩‍🎨',
            quote: 'The best job search experience I\'ve ever had. Clean interface, relevant matches, and quick responses from companies. Highly recommend!',
            rating: 5,
            type: 'Job Seeker',
        },
        {
            name: 'David Park',
            role: 'Recruiting Manager',
            company: 'Growth Dynamics',
            image: '👨‍💼',
            quote: 'JobPortal streamlined our entire hiring process. The application tracking and candidate filtering features are game-changers for our team.',
            rating: 5,
            type: 'Recruiter',
        },
    ];

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                        Success <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Stories</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Hear from job seekers and recruiters who found success with JobPortal.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 relative">
                            {/* Quote icon */}
                            <div className="absolute top-6 right-6 opacity-10">
                                <Quote className="w-12 h-12 text-blue-600" />
                            </div>

                            {/* Type badge */}
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${testimonial.type === 'Job Seeker'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-purple-100 text-purple-700'
                                }`}>
                                {testimonial.type}
                            </span>

                            {/* Rating */}
                            <div className="flex gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                ))}
                            </div>

                            {/* Quote */}
                            <p className="text-gray-600 leading-relaxed mb-6 relative z-10">
                                "{testimonial.quote}"
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                                <div className="text-4xl">{testimonial.image}</div>
                                <div>
                                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                                    <div className="text-sm text-gray-400">{testimonial.company}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
