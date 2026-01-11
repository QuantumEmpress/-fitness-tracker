import api from './api';

const getAllGoals = () => {
    return api.get('/api/goals');
};

const createGoal = (goalData) => {
    return api.post('/api/goals', goalData);
};

const updateGoal = (id, goalData) => {
    return api.put(`/api/goals/${id}`, goalData);
};

const deleteGoal = (id) => {
    return api.delete(`/api/goals/${id}`);
};

const goalService = {
    getAllGoals,
    createGoal,
    updateGoal,
    deleteGoal,
};

export default goalService;
