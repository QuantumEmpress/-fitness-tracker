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
    <AnimationWrapper className="flex items-center justify-center min-h-screen p-4 mesh-light">
      {/* Floating Shapes for background depth */}
      <div className="fixed w-64 h-64 bg-purple-300 rounded-full top-20 left-20 mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="fixed w-64 h-64 bg-yellow-300 rounded-full top-20 right-20 mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="fixed w-64 h-64 bg-pink-300 rounded-full -bottom-8 left-40 mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="glass-card w-full max-w-5xl overflow-hidden flex shadow-2xl relative z-10 min-h-[600px]">
        {/* Left Side - Illustration */}
        <div className="relative items-center justify-center hidden w-1/2 p-12 lg:flex bg-gradient-to-br from-violet-50 to-pink-50">
          <div className="absolute inset-0 z-0 bg-white/30 backdrop-blur-sm"></div>
          <div className="relative z-10 text-center">
            {/* Shigureni Illustration */}
            <img
              src="/images/25.png"
              alt="Welcome"
              className="object-contain w-full max-w-md drop-shadow-2xl animate-float"
            />
            <h2 className="mt-8 font-sans text-3xl font-bold text-gray-800">Welcome Back!</h2>
            <p className="mt-2 text-gray-500">Ready to crush your goals today?</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex flex-col justify-center w-full p-8 lg:w-1/2 md:p-16 bg-white/50 backdrop-blur-xl">
          <div className="w-full max-w-md mx-auto">
            <div className="mb-10 text-center">
              <h2 className="mb-2 font-sans text-4xl font-bold tracking-tight text-gray-800">Login</h2>
              <p className="text-gray-500">Enter your details to access your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
              <div className="space-y-2">
                <label className="block ml-1 text-sm font-semibold text-gray-700">Username</label>
                <input
                  type="text"
                  autoComplete="off"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-5 py-4 font-medium text-gray-700 placeholder-gray-400 transition-all bg-white border border-gray-100 shadow-sm outline-none rounded-xl focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                  placeholder="Enter your username"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block ml-1 text-sm font-semibold text-gray-700">Password</label>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 font-medium text-gray-700 placeholder-gray-400 transition-all bg-white border border-gray-100 shadow-sm outline-none rounded-xl focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                  placeholder="••••••••"
                  required
                />
                <div className="text-right">
                  <Link to="/forgot-password" className="text-sm text-violet-600 font-semibold hover:underline">
                    Forgot password?
                  </Link>
                </div>
              </div>



              <button
                type="submit"
                className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 shadow-xl shadow-slate-200"
              >
                Sign In
              </button>
            </form>

            <p className="mt-8 font-medium text-center text-gray-500">
              Don't have an account? <Link to="/signup" className="ml-1 font-bold text-violet-600 hover:underline">Create one now</Link>
            </p>
          </div>
        </div>
      </div>
    </AnimationWrapper>
  );
};

export default Login;
