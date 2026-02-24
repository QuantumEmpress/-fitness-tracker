import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Target, TrendingUp, Award, Users, Zap, ArrowRight } from 'lucide-react';
import AnimationWrapper, { StaggerContainer, StaggerItem } from '../components/AnimationWrapper';

const Landing = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: <Dumbbell size={32} />,
            title: "Exercise Library",
            description: "Access hundreds of exercises with video demonstrations"
        },
        {
            icon: <Target size={32} />,
            title: "Goal Tracking",
            description: "Set and achieve your fitness goals with smart tracking"
        },
        {
            icon: <TrendingUp size={32} />,
            title: "Progress Analytics",
            description: "Visualize your journey with detailed statistics and charts"
        },
        {
            icon: <Award size={32} />,
            title: "Achievements",
            description: "Earn badges and unlock rewards as you progress"
        },
        {
            icon: <Users size={32} />,
            title: "Leaderboard",
            description: "Compete with friends and stay motivated"
        },
        {
            icon: <Zap size={32} />,
            title: "Calorie Tracking",
            description: "Automatic calorie calculation for every workout"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-fuchsia-50 to-cyan-50">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl">
                            <Dumbbell size={28} className="text-white" />
                        </div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                            FitTracker
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="px-6 py-2 text-gray-700 font-semibold hover:text-violet-600 transition-colors"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => navigate('/signup')}
                            className="px-6 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <AnimationWrapper className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="space-y-8">
                            <div className="inline-block px-4 py-2 bg-violet-100 rounded-full">
                                <span className="text-violet-600 font-semibold text-sm">🚀 Your Fitness Journey Starts Here</span>
                            </div>

                            <h1 className="text-6xl font-bold leading-tight">
                                Transform Your
                                <span className="block bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 bg-clip-text text-transparent">
                                    Fitness Journey
                                </span>
                            </h1>

                            <p className="text-xl text-gray-600 leading-relaxed">
                                Track workouts, set goals, earn achievements, and compete with friends.
                                Your all-in-one fitness companion powered by smart analytics.
                            </p>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => navigate('/signup')}
                                    className="px-8 py-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2"
                                >
                                    Start Free Today
                                    <ArrowRight size={20} />
                                </button>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:border-violet-300 hover:shadow-lg transition-all"
                                >
                                    Sign In
                                </button>
                            </div>

                            <div className="flex items-center gap-8 pt-4">
                                <div>
                                    <p className="text-3xl font-bold text-gray-800">10K+</p>
                                    <p className="text-gray-500">Active Users</p>
                                </div>
                                <div className="h-12 w-px bg-gray-300"></div>
                                <div>
                                    <p className="text-3xl font-bold text-gray-800">50K+</p>
                                    <p className="text-gray-500">Workouts Logged</p>
                                </div>
                                <div className="h-12 w-px bg-gray-300"></div>
                                <div>
                                    <p className="text-3xl font-bold text-gray-800">4.9★</p>
                                    <p className="text-gray-500">User Rating</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Image */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-violet-400 to-fuchsia-400 rounded-3xl blur-3xl opacity-20"></div>
                            <img
                                src="/images/1.png"
                                alt="Fitness Tracker Dashboard"
                                className="relative w-full drop-shadow-2xl animate-float"
                            />
                        </div>
                    </div>
                </div>
            </AnimationWrapper>

            {/* Features Section */}
            <div className="py-20 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">
                            Everything You Need to Succeed
                        </h2>
                        <p className="text-xl text-gray-600">
                            Powerful features designed to keep you motivated and on track
                        </p>
                    </div>

                    <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <StaggerItem
                                key={index}
                                className="group p-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 hover:border-violet-300 hover:shadow-xl transition-all duration-300"
                            >
                                <div className="p-4 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl w-fit mb-4 group-hover:scale-110 transition-transform">
                                    <div className="text-white">
                                        {feature.icon}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600">
                                    {feature.description}
                                </p>
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-20 px-6 bg-gradient-to-br from-violet-600 via-fuchsia-600 to-cyan-600">
                <AnimationWrapper className="max-w-4xl mx-auto text-center space-y-8">
                    <h2 className="text-5xl font-bold text-white">
                        Ready to Start Your Journey?
                    </h2>
                    <p className="text-xl text-white/90">
                        Join thousands of users who are already crushing their fitness goals
                    </p>
                    <button
                        onClick={() => navigate('/signup')}
                        className="px-10 py-5 bg-white text-violet-600 font-bold text-lg rounded-xl hover:shadow-2xl hover:scale-105 transition-all"
                    >
                        Create Free Account
                    </button>
                    <p className="text-white/80 text-sm">
                        No credit card required • Get started in 30 seconds
                    </p>
                </AnimationWrapper>
            </div>

            {/* Footer */}
            <footer className="py-8 px-6 bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Dumbbell size={24} />
                        <span className="text-xl font-bold">FitTracker</span>
                    </div>
                    <p className="text-gray-400">
                        © 2026 FitTracker. Built with ❤️ for fitness enthusiasts.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
