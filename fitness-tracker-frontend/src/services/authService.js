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

const authService = {
    signup,
    login,
    logout,
    getCurrentUser,
};

export default authService;
