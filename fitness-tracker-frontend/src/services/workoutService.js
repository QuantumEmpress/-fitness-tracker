import api from './api';

const getAllWorkouts = () => {
    return api.get('/api/workouts');
};

const getWorkout = (id) => {
    return api.get(`/api/workouts/${id}`);
};

const createWorkout = (workoutData) => {
    return api.post('/api/workouts', workoutData);
};

const updateWorkout = (id, workoutData) => {
    return api.put(`/api/workouts/${id}`, workoutData);
};

const deleteWorkout = (id) => {
    return api.delete(`/api/workouts/${id}`);
};

const workoutService = {
    getAllWorkouts,
    getWorkout,
    createWorkout,
    updateWorkout,
    deleteWorkout,
};

export default workoutService;
