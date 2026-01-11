import api from './api';

const getAllExercises = () => {
    return api.get('/api/exercises');
};

const getExercise = (id) => {
    return api.get(`/api/exercises/${id}`);
};

const createExercise = (exerciseData) => {
    // If uploading file, use FormData
    // Assuming backend accepts JSON or FormData depending on implementation
    // If video upload is separate or part of it, we need to know.
    // Requirement says "allow adding/editing exercises with video upload".
    // Usually this means FormData.
    return api.post('/api/exercises', exerciseData);
};

const updateExercise = (id, exerciseData) => {
    return api.put(`/api/exercises/${id}`, exerciseData);
};

const deleteExercise = (id) => {
    return api.delete(`/api/exercises/${id}`);
};

const exerciseService = {
    getAllExercises,
    getExercise,
    createExercise,
    updateExercise,
    deleteExercise,
};

export default exerciseService;
