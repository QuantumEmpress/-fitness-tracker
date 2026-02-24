import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import AnimationWrapper from '../components/AnimationWrapper';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Signing in...');
    try {
      await login(username, password);
      toast.success(`Welcome back, ${username}!`, { id: loadingToast });
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid username or password', { id: loadingToast });
    }
  };

  return (
    <AnimationWrapper className="min-h-screen flex items-center justify-center p-4 mesh-light">
      {/* Floating Shapes for background depth */}
      <div className="fixed top-20 left-20 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="fixed top-20 right-20 w-64 h-64 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="fixed -bottom-8 left-40 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="glass-card w-full max-w-5xl overflow-hidden flex shadow-2xl relative z-10 min-h-[600px]">
        {/* Left Side - Illustration */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-violet-50 to-pink-50 items-center justify-center relative p-12">
          <div className="absolute inset-0 bg-white/30 backdrop-blur-sm z-0"></div>
          <div className="relative z-10 text-center">
            {/* Shigureni Illustration */}
            <img
              src="/images/25.png"
              alt="Welcome"
              className="w-full max-w-md drop-shadow-2xl animate-float object-contain"
            />
            <h2 className="mt-8 text-3xl font-bold text-gray-800 font-sans">Welcome Back!</h2>
            <p className="text-gray-500 mt-2">Ready to crush your goals today?</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-white/50 backdrop-blur-xl">
          <div className="max-w-md mx-auto w-full">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold text-gray-800 mb-2 font-sans tracking-tight">Login</h2>
              <p className="text-gray-500">Enter your details to access your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
              <div className="space-y-2">
                <label className="block text-gray-700 font-semibold text-sm ml-1">Username</label>
                <input
                  type="text"
                  autoComplete="off"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl bg-white border border-gray-100 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition-all outline-none text-gray-700 font-medium shadow-sm placeholder-gray-400"
                  placeholder="Enter your username"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-gray-700 font-semibold text-sm ml-1">Password</label>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl bg-white border border-gray-100 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition-all outline-none text-gray-700 font-medium shadow-sm placeholder-gray-400"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-gray-500 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded text-violet-500 focus:ring-violet-200 border-gray-300 mr-2" />
                  Remember me
                </label>
                <a href="#" className="font-semibold text-violet-600 hover:text-violet-700">Forgot Password?</a>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 shadow-xl shadow-slate-200"
              >
                Sign In
              </button>
            </form>

            <p className="mt-8 text-center text-gray-500 font-medium">
              Don't have an account? <Link to="/signup" className="text-violet-600 font-bold hover:underline ml-1">Create one now</Link>
            </p>
          </div>
        </div>
      </div>
    </AnimationWrapper>
  );
};

export default Login;
