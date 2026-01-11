import api from './api';

const getLeaderboard = () => {
    return api.get('/api/leaderboard');
};

const leaderboardService = {
    getLeaderboard,
};

export default leaderboardService;
