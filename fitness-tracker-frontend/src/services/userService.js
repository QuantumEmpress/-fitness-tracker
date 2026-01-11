import api from './api';

const getProfile = () => {
    return api.get('/api/user/profile');
};

const updateProfile = (data) => {
    return api.put('/api/user/profile', data);
};

const uploadProfilePicture = (formData) => {
    return api.post('/api/user/profile-picture', formData);
};

const changePassword = (currentPassword, newPassword) => {
    return api.put('/api/user/change-password', {
        currentPassword,
        newPassword
    });
};

const userService = {
    getProfile,
    updateProfile,
    uploadProfilePicture,
    changePassword,
};

export default userService;
