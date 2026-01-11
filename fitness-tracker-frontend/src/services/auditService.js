import api from './api';

const getAllLogs = () => {
    return api.get('/api/audit/logs');
};

const getLogsByAdmin = (adminId) => {
    return api.get(`/api/audit/logs/admin/${adminId}`);
};

const getLogsByUser = (userId) => {
    return api.get(`/api/audit/logs/user/${userId}`);
};

const clearAllLogs = () => {
    return api.delete('/api/audit/logs');
};

const auditService = {
    getAllLogs,
    getLogsByAdmin,
    getLogsByUser,
    clearAllLogs,
};

export default auditService;
