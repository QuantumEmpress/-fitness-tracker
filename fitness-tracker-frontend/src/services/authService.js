import api from './api';

const signup = (signupRequest) => {
    return api.post('/api/auth/signup', signupRequest);
};

const login = (loginRequest) => {
    return api.post('/api/auth/signin', loginRequest)
        .then((response) => {
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            return response.data;
        });
};

const logout = () => {
    localStorage.removeItem('token');
};

const getCurrentUser = () => {
    return api.get('/api/user/profile');
};

const verifyEmail = (token) => {
    return api.get(`/api/auth/verify-email?token=${token}`);
};

const forgotPassword = (email) => {
    return api.post('/api/auth/forgot-password', { email });
};

const resetPassword = (token, newPassword) => {
    return api.post('/api/auth/reset-password', { token, newPassword });
};

const authService = {
    signup,
    login,
    logout,
    getCurrentUser,
    verifyEmail,
    forgotPassword,
    resetPassword,
};

export default authService;
