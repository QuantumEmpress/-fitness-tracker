import React, { useState, useEffect, useContext } from 'react';
import userService from '../services/userService';
import { AuthContext } from '../contexts/AuthContext';
import { User, Camera, Lock, Key } from 'lucide-react';
import Badges from '../components/Badges';
import { toast } from 'react-hot-toast';
import AnimationWrapper, { StaggerContainer, StaggerItem } from '../components/AnimationWrapper';

const Profile = () => {
    const { user: authUser } = useContext(AuthContext);
    const [profile, setProfile] = useState({
        username: '',
        email: '',
        profilePictureUrl: ''
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await userService.getProfile();
            setProfile(response.data);
        } catch (error) {
            console.error("Failed to fetch profile", error);
            toast.error("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        const loadingToast = toast.loading('Uploading picture...');

        try {
            const response = await userService.uploadProfilePicture(formData);
            setProfile(prev => ({ ...prev, profilePictureUrl: response.data }));
            toast.success('Profile picture updated!', { id: loadingToast });
        } catch (error) {
            console.error("Failed to upload image", error);
            toast.error('Failed to upload profile picture.', { id: loadingToast });
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loadingToast = toast.loading('Updating profile...');
        try {
            const updateData = { ...profile };
            delete updateData.profilePictureUrl; // Handled separately

            await userService.updateProfile(updateData);
            toast.success('Profile updated successfully!', { id: loadingToast });
        } catch (error) {
            toast.error('Failed to update profile.', { id: loadingToast });
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            toast.error('All password fields are required.');
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New passwords do not match.');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error('New password must be at least 6 characters.');
            return;
        }

        const loadingToast = toast.loading('Changing password...');
        try {
            await userService.changePassword(passwordData.currentPassword, passwordData.newPassword);
            toast.success('Password changed successfully!', { id: loadingToast });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to change password. Please check your current password.', { id: loadingToast });
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div></div>;

    return (
        <AnimationWrapper className="max-w-4xl mx-auto p-6 space-y-8">
            {/* Decorative Header */}
            <div className="glass-card p-8 text-center relative overflow-hidden">
                <img
                    src="/src/assets/images/8.png"
                    alt="Profile"
                    className="w-64 mx-auto mb-4 drop-shadow-2xl animate-float"
                />
                <h1 className="text-4xl font-bold text-gray-800 mb-2">My Profile</h1>
                <p className="text-gray-500 text-lg">Manage your account and track your progress</p>
            </div>

            <StaggerContainer className="space-y-8">
                {/* Profile Information Section */}
                <StaggerItem className="glass-card p-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <User size={28} />
                        My Profile
                    </h1>

                    <div className="flex flex-col items-center mb-8">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 bg-gray-100 flex items-center justify-center">
                                {profile.profilePictureUrl ? (
                                    <img src={profile.profilePictureUrl} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={64} className="text-gray-400" />
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white cursor-pointer hover:bg-blue-700 transition shadow-md">
                                <Camera size={20} />
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={uploading} />
                            </label>
                        </div>
                        {uploading && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={profile.username}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={profile.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                        >
                            Update Profile
                        </button>
                    </form>
                </StaggerItem>

                {/* Password Change Section */}
                <StaggerItem className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Lock size={24} />
                        Change Password
                    </h2>

                    <form onSubmit={handlePasswordSubmit} className="space-y-6">
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Current Password</label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your current password"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">New Password</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter new password (min 6 characters)"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Confirm New Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Confirm new password"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center gap-2"
                        >
                            <Key size={20} />
                            Change Password
                        </button>
                    </form>
                </StaggerItem>

                {/* Achievements Section */}
                <StaggerItem className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                    <Badges />
                </StaggerItem>
            </StaggerContainer>
        </AnimationWrapper>
    );
};

export default Profile;
