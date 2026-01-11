import api from './api';

const getAllUsers = () => {
    return api.get('/api/admin/users');
};

const deleteUser = (id) => {
    return api.delete(`/api/admin/users/${id}`);
};

const promoteUser = (id) => {
    return api.put(`/api/admin/users/${id}/role`);
};

const getStats = () => {
    return api.get('/api/admin/stats');
};

const banUser = (id) => {
    return api.put(`/api/admin/users/${id}/ban`);
};

const unbanUser = (id) => {
    return api.put(`/api/admin/users/${id}/unban`);
};

const adminService = {
    getAllUsers,
    deleteUser,
    promoteUser,
    getStats,
    banUser,
    unbanUser,
};

export default adminService;
