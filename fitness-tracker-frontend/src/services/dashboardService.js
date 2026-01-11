import api from './api';

const getDashboardStats = () => {
    return api.get('/api/dashboard/stats');
};

const dashboardService = {
    getDashboardStats,
};

export default dashboardService;
