import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import authService from '../services/authService';
import AnimationWrapper from '../components/AnimationWrapper';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
    const [message, setMessage] = useState('');

    useEffect(() => {
        const token = searchParams.get('token');
        if (!token) {
            setStatus('error');
            setMessage('No verification token found in the link. Please use the link from your email.');
            return;
        }

        authService.verifyEmail(token)
            .then((res) => {
                setStatus('success');
                setMessage(res.data.message);
            })
            .catch((err) => {
                setStatus('error');
                setMessage(err.response?.data?.message || 'Verification failed. The link may be invalid or expired.');
            });
    }, [searchParams]);

    return (
        <AnimationWrapper className="min-h-screen flex items-center justify-center p-4 mesh-light">
            <div className="fixed top-20 right-20 w-64 h-64 bg-violet-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
            <div className="fixed bottom-20 left-20 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />

            <div className="glass-card w-full max-w-md p-10 text-center relative z-10 shadow-2xl">
                {status === 'loading' && (
                    <>
                        <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-gray-800">Verifying your email…</h2>
                        <p className="text-gray-500 mt-2">Please wait a moment.</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-200">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Email Verified! 🎉</h2>
                        <p className="text-gray-500 mb-8">{message}</p>
                        <Link
                            to="/login"
                            className="inline-block w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                        >
                            Go to Login
                        </Link>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-200">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Verification Failed</h2>
                        <p className="text-gray-500 mb-8">{message}</p>
                        <Link
                            to="/signup"
                            className="inline-block w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                        >
                            Sign Up Again
                        </Link>
                        <Link to="/login" className="block mt-4 text-violet-600 font-semibold hover:underline">
                            Back to Login
                        </Link>
                    </>
                )}
            </div>
        </AnimationWrapper>
    );
};

export default VerifyEmail;
