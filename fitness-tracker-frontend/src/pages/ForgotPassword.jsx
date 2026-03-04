import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';
import { toast } from 'react-hot-toast';
import AnimationWrapper from '../components/AnimationWrapper';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const loadingToast = toast.loading('Sending reset link…');
        try {
            await authService.forgotPassword(email);
            toast.success('Reset link sent! Check your inbox.', { id: loadingToast });
            setSent(true);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Something went wrong.', { id: loadingToast });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimationWrapper className="min-h-screen flex items-center justify-center p-4 mesh-light">
            <div className="fixed top-20 left-20 w-64 h-64 bg-violet-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
            <div className="fixed bottom-20 right-20 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />

            <div className="glass-card w-full max-w-md p-10 relative z-10 shadow-2xl">
                {!sent ? (
                    <>
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-200">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-1">Forgot Password?</h2>
                            <p className="text-gray-500 text-sm">Enter your email and we'll send you a reset link.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="block text-gray-700 font-semibold text-sm ml-1">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-5 py-4 rounded-xl bg-white border border-gray-100 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition-all outline-none text-gray-700 font-medium shadow-sm placeholder-gray-400"
                                    placeholder="Enter your registered email"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 shadow-xl shadow-slate-200 disabled:opacity-60"
                            >
                                Send Reset Link
                            </button>
                        </form>

                        <p className="mt-6 text-center text-gray-500 font-medium">
                            Remember your password?{' '}
                            <Link to="/login" className="text-violet-600 font-bold hover:underline ml-1">Log in</Link>
                        </p>
                    </>
                ) : (
                    <div className="text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-200">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Check Your Inbox!</h2>
                        <p className="text-gray-500 mb-6">
                            We've sent a password reset link to <span className="font-semibold text-gray-700">{email}</span>.
                            The link expires in 24 hours.
                        </p>
                        <p className="text-sm text-gray-400 mb-6">Don't see it? Check your spam folder.</p>
                        <Link
                            to="/login"
                            className="inline-block w-full text-center bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all duration-300"
                        >
                            Back to Login
                        </Link>
                    </div>
                )}
            </div>
        </AnimationWrapper>
    );
};

export default ForgotPassword;
