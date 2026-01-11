import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import { toast } from 'react-hot-toast';
import AnimationWrapper from '../components/AnimationWrapper';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        roles: ['user'] // Default role
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loadingToast = toast.loading('Creating your account...');
        try {
            await authService.signup(formData);
            toast.success('Account created! Please log in.', { id: loadingToast });
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to sign up', { id: loadingToast });
        }
    };

    return (
        <AnimationWrapper className="min-h-screen flex items-center justify-center p-4 mesh-light">
            {/* Floating Shapes */}
            <div className="fixed top-20 right-20 w-64 h-64 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="fixed bottom-20 left-20 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

            <div className="glass-card w-full max-w-5xl overflow-hidden flex shadow-2xl relative z-10 min-h-[600px]">

                {/* Left Side - Illustration */}
                <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-pink-50 to-cyan-50 items-center justify-center relative p-12">
                    <div className="absolute inset-0 bg-white/30 backdrop-blur-sm z-0"></div>
                    <div className="relative z-10 text-center">
                        {/* Shigureni Illustration */}
                        <img
                            src="/src/assets/images/119.png"
                            alt="Join Us"
                            className="w-full max-w-md drop-shadow-2xl animate-float object-contain"
                        />
                        <h2 className="mt-8 text-3xl font-bold text-gray-800 font-sans">Join the Movement</h2>
                        <p className="text-gray-500 mt-2">Start your premium fitness journey today.</p>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white/50 backdrop-blur-xl">
                    <div className="max-w-md mx-auto w-full">
                        <div className="text-center mb-8">
                            <h2 className="text-4xl font-bold text-gray-800 mb-2 font-sans tracking-tight">Create Account</h2>
                            <p className="text-gray-500">Sign up to get started</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
                            <div className="space-y-2">
                                <label className="block text-gray-700 font-semibold text-sm ml-1">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    autoComplete="off"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 rounded-xl bg-white border border-gray-100 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all outline-none text-gray-700 font-medium shadow-sm placeholder-gray-400"
                                    placeholder="Choose your username"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-gray-700 font-semibold text-sm ml-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    autoComplete="off"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 rounded-xl bg-white border border-gray-100 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all outline-none text-gray-700 font-medium shadow-sm placeholder-gray-400"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-gray-700 font-semibold text-sm ml-1">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    autoComplete="new-password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 rounded-xl bg-white border border-gray-100 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all outline-none text-gray-700 font-medium shadow-sm placeholder-gray-400"
                                    placeholder="Create a strong password"
                                    required
                                />
                            </div>

                            <div className="flex items-center text-sm text-gray-500 mt-2">
                                <input type="checkbox" className="w-4 h-4 rounded text-pink-500 focus:ring-pink-200 border-gray-300 mr-2" required />
                                <span>I agree to the <a href="#" className="text-pink-500 font-bold hover:underline">Terms & Conditions</a></span>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 shadow-xl shadow-slate-200 mt-4"
                            >
                                Get Started
                            </button>
                        </form>

                        <p className="mt-8 text-center text-gray-500 font-medium">
                            Already have an account? <Link to="/login" className="text-pink-500 font-bold hover:underline ml-1">Log in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </AnimationWrapper>
    );
};

export default Signup;

