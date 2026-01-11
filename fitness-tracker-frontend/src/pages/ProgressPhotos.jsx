import React, { useState, useEffect } from 'react';
import progressPhotoService from '../services/progressPhotoService';
import { Camera, Trash2, Plus, Calendar } from 'lucide-react';

const ProgressPhotos = () => {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [file, setFile] = useState(null);
    const [notes, setNotes] = useState('');
    const [weight, setWeight] = useState('');

    useEffect(() => {
        fetchPhotos();
    }, []);

    const fetchPhotos = async () => {
        try {
            const response = await progressPhotoService.getPhotos();
            setPhotos(response.data);
        } catch (error) {
            console.error("Failed to fetch photos", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('notes', notes);
        if (weight) formData.append('weight', weight);

        try {
            await progressPhotoService.uploadPhoto(formData);
            setFile(null);
            setNotes('');
            setWeight('');
            setShowForm(false);
            fetchPhotos(); // Refresh list
        } catch (error) {
            console.error("Failed to upload photo", error);
            alert("Failed to upload photo");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this photo?")) {
            try {
                await progressPhotoService.deletePhoto(id);
                setPhotos(photos.filter(p => p.id !== id));
            } catch (error) {
                console.error("Failed to delete photo", error);
            }
        }
    };

    if (loading) return <div className="p-6">Loading gallery...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                    <Camera className="text-purple-600" size={32} />
                    Progress Gallery
                </h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition"
                >
                    <Plus size={20} />
                    Add Photo
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-fade-in">
                    <h2 className="text-xl font-semibold mb-4">Upload New Photo</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="w-full p-2 border rounded-lg"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Current Weight (kg)</label>
                                <input
                                    type="number"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    className="w-full p-2 border rounded-lg"
                                    placeholder="Optional"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                <input
                                    type="text"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="w-full p-2 border rounded-lg"
                                    placeholder="Feeling strong..."
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={uploading}
                                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
                            >
                                {uploading ? 'Uploading...' : 'Save Photo'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {photos.map((photo) => (
                    <div key={photo.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group">
                        <div className="relative aspect-square">
                            <img
                                src={photo.photoUrl}
                                alt="Progress"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <button
                                    onClick={() => handleDelete(photo.id)}
                                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                                    title="Delete Photo"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2 text-gray-500 text-sm">
                                    <Calendar size={16} />
                                    {new Date(photo.date).toLocaleDateString()}
                                </div>
                                {photo.weight && (
                                    <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-medium">
                                        {photo.weight} kg
                                    </span>
                                )}
                            </div>
                            {photo.notes && (
                                <p className="text-gray-700 text-sm italic">"{photo.notes}"</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {photos.length === 0 && !loading && (
                <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <Camera size={48} className="mx-auto mb-4 text-gray-400" />
                    <p>No photos yet. Start tracking your transformation!</p>
                </div>
            )}
        </div>
    );
};

export default ProgressPhotos;
