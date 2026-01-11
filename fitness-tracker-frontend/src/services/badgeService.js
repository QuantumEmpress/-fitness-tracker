import api from './api';

const getMyBadges = () => {
    return api.get('/api/badges');
};

const badgeService = {
    getMyBadges,
};

export default badgeService;
