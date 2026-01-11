import api from './api';

const getPhotos = () => {
    return api.get('/api/progress-photos');
};

const uploadPhoto = (formData) => {
    return api.post('/api/progress-photos', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

const deletePhoto = (id) => {
    return api.delete(`/api/progress-photos/${id}`);
};

const progressPhotoService = {
    getPhotos,
    uploadPhoto,
    deletePhoto,
};

export default progressPhotoService;
