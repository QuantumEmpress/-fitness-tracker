import React, { useState, useEffect, useContext } from 'react';
import exerciseService from '../services/exerciseService';
import { AuthContext } from '../contexts/AuthContext';
import { Plus, Play, Trash2, Edit2 } from 'lucide-react';
import CardSkeleton from '../components/CardSkeleton';
import { toast } from 'react-hot-toast';
import AnimationWrapper, { StaggerContainer, StaggerItem } from '../components/AnimationWrapper';
import GlassModal from '../components/GlassModal';

const Exercises = () => {
    const { user } = useContext(AuthContext);
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        muscleGroup: '',
        intensity: 'MEDIUM',
        videoFile: null,
        youtubeUrl: ''
    });

    // Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [exerciseToDelete, setExerciseToDelete] = useState(null);

    // Helper function to extract YouTube video ID
    const getYouTubeVideoId = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };
    const [selectedVideo, setSelectedVideo] = useState(null);

    useEffect(() => {
        fetchExercises();
    }, []);

    const fetchExercises = async () => {
        try {
            const response = await exerciseService.getAllExercises();
            setExercises(response.data);
        } catch (error) {
            console.error("Failed to fetch exercises", error);
            toast.error("Failed to load exercises");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        if (e.target.name === 'videoFile') {
            setFormData({ ...formData, videoFile: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loadingToast = toast.loading('Creating exercise...');
        const data = new FormData();
        const exerciseBlob = new Blob([JSON.stringify({
            name: formData.name,
            description: formData.description,
            muscleGroup: formData.muscleGroup,
            intensity: formData.intensity,
            videoUrl: formData.youtubeUrl // Add YouTube URL here
        })], { type: 'application/json' });

        data.append('exercise', exerciseBlob);

        if (formData.videoFile) {
            data.append('video', formData.videoFile);
        }

        try {
            await exerciseService.createExercise(data);
            toast.success('Exercise created successfully!', { id: loadingToast });
            setShowForm(false);
            setFormData({ name: '', description: '', muscleGroup: '', intensity: 'MEDIUM', videoFile: null, youtubeUrl: '' });
            fetchExercises();
        } catch (error) {
            console.error("Failed to create exercise", error);
            toast.error("Failed to create exercise", { id: loadingToast });
        }
    };

    const handleDeleteClick = (id) => {
        setExerciseToDelete(id);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!exerciseToDelete) return;
        const loadingToast = toast.loading('Deleting exercise...');
        try {
            await exerciseService.deleteExercise(exerciseToDelete);
            toast.success('Exercise deleted!', { id: loadingToast });
            fetchExercises();
        } catch (error) {
            console.error("Failed to delete exercise", error);
            toast.error("Failed to delete exercise", { id: loadingToast });
        } finally {
            setExerciseToDelete(null);
            setDeleteModalOpen(false);
        }
    };

    if (loading) return <div className="p-6"><CardSkeleton cards={6} /></div>;

    return (
        <AnimationWrapper className="space-y-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Exercise Library</h1>
                    <p className="text-gray-500 text-lg">Browse and manage your exercise collection</p>
                </div>
                {(user?.roles?.includes('ROLE_ADMIN')) && (
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold hover:shadow-lg hover:scale-105 transition-all"
                    >
                        <Plus size={20} />
                        Add Exercise
                    </button>
                )}
            </div>

            {showForm && (
                <div className="glass-card p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Exercise</h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Exercise Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full px-5 py-3 rounded-xl bg-white border border-gray-100 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition-all outline-none text-gray-700 font-medium shadow-sm"
                                placeholder="e.g., Bench Press"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="4"
                                className="w-full px-5 py-3 rounded-xl bg-white border border-gray-100 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition-all outline-none text-gray-700 font-medium shadow-sm resize-none"
                                placeholder="Describe the exercise technique..."
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Muscle Group</label>
                            <input
                                type="text"
                                name="muscleGroup"
                                value={formData.muscleGroup}
                                onChange={handleInputChange}
                                className="w-full px-5 py-3 rounded-xl bg-white border border-gray-100 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition-all outline-none text-gray-700 font-medium shadow-sm"
                                placeholder="e.g., Chest, Legs, Back"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Intensity (Calorie Burn)</label>
                            <select
                                name="intensity"
                                value={formData.intensity}
                                onChange={handleInputChange}
                                className="w-full px-5 py-3 rounded-xl bg-white border border-gray-100 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition-all outline-none text-gray-700 font-medium shadow-sm cursor-pointer"
                            >
                                <option value="MEDIUM">Medium (~7 cal/min)</option>
                                <option value="LOW">Low (~4 cal/min)</option>
                                <option value="HIGH">High (~10 cal/min)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">YouTube URL (Optional)</label>
                            <input
                                type="text"
                                name="youtubeUrl"
                                value={formData.youtubeUrl}
                                onChange={handleInputChange}
                                placeholder="https://www.youtube.com/watch?v=..."
                                className="w-full px-5 py-3 rounded-xl bg-white border border-gray-100 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition-all outline-none text-gray-700 font-medium shadow-sm"
                            />
                            <p className="text-xs text-gray-500 mt-1">Paste a YouTube video URL for this exercise</p>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">OR Upload Video File (Optional)</label>
                            <input
                                type="file"
                                name="videoFile"
                                onChange={handleInputChange}
                                accept="video/*"
                                className="w-full px-5 py-3 rounded-xl bg-white border border-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-violet-50 file:text-violet-600 file:font-semibold hover:file:bg-violet-100 transition-all"
                            />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                className="flex-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white py-3 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all"
                            >
                                Create Exercise
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exercises.map((exercise) => {
                    const youtubeId = getYouTubeVideoId(exercise.videoUrl);
                    return (
                        <StaggerItem key={exercise.id} className="glass-card overflow-hidden hover:scale-105 transition-transform duration-300 group">
                            {youtubeId ? (
                                <div className="relative bg-gradient-to-br from-violet-100 to-fuchsia-100 aspect-video cursor-pointer" onClick={() => setSelectedVideo(exercise.videoUrl)}>
                                    <img
                                        src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
                                        alt={exercise.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 group-hover:bg-opacity-20 transition-all">
                                        <div className="p-4 bg-white rounded-full shadow-xl group-hover:scale-110 transition-transform">
                                            <Play size={32} className="text-violet-600" fill="currentColor" />
                                        </div>
                                    </div>
                                </div>
                            ) : exercise.videoUrl ? (
                                <div className="relative bg-gradient-to-br from-violet-100 to-fuchsia-100 aspect-video cursor-pointer" onClick={() => setSelectedVideo(exercise.videoUrl)}>
                                    <video
                                        src={exercise.videoUrl}
                                        className="w-full h-full object-cover"
                                        controls={false}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 group-hover:bg-opacity-20 transition-all">
                                        <div className="p-4 bg-white rounded-full shadow-xl group-hover:scale-110 transition-transform">
                                            <Play size={32} className="text-violet-600" fill="currentColor" />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 aspect-video flex items-center justify-center">
                                    <Play size={48} className="text-violet-300" />
                                </div>
                            )}
                            <div className="p-5">
                                <h3 className="text-xl font-bold text-gray-800 mb-2">{exercise.name}</h3>
                                <p className="text-sm text-gray-600 mb-4">{exercise.description}</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-violet-600 bg-violet-50 px-3 py-1 rounded-full border border-violet-100">
                                        {exercise.muscleGroup}
                                    </span>
                                    {exercise.intensity && (
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${exercise.intensity === 'HIGH' ? 'text-red-600 bg-red-50 border-red-100' :
                                            exercise.intensity === 'LOW' ? 'text-green-600 bg-green-50 border-green-100' :
                                                'text-yellow-600 bg-yellow-50 border-yellow-100'
                                            }`}>
                                            {exercise.intensity}
                                        </span>
                                    )}
                                </div>
                                {user?.roles?.includes('ROLE_ADMIN') && (
                                    <button
                                        onClick={() => handleDeleteClick(exercise.id)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                        </StaggerItem>
                    );
                })}
            </StaggerContainer>

            {
                exercises.length === 0 && (
                    <div className="glass-card text-center py-16">
                        <img
                            src="/images/2.png"
                            alt="No exercises yet"
                            className="w-80 mx-auto mb-6 drop-shadow-2xl animate-float"
                        />
                        <p className="text-xl font-semibold text-gray-600 mb-2">No exercises available yet</p>
                        <p className="text-gray-400">Add your first exercise to get started!</p>
                    </div>
                )
            }

            {/* Video Modal */}
            {
                selectedVideo && (
                    <div
                        className="fixed inset-0 flex items-center justify-center z-50 p-4"
                        onClick={() => setSelectedVideo(null)}
                    >
                        <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={() => setSelectedVideo(null)}
                                className="absolute -top-14 right-0 px-6 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-xl font-bold hover:shadow-lg transition-all shadow-lg"
                            >
                                ✕ Close
                            </button>
                            {getYouTubeVideoId(selectedVideo) ? (
                                <iframe
                                    width="100%"
                                    height="600"
                                    src={`https://www.youtube.com/embed/${getYouTubeVideoId(selectedVideo)}?autoplay=1`}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="rounded-2xl shadow-2xl border-4 border-white"
                                ></iframe>
                            ) : (
                                <video
                                    src={selectedVideo}
                                    controls
                                    controlsList="nodownload"
                                    autoPlay
                                    className="w-full rounded-2xl shadow-2xl border-4 border-white"
                                    style={{ maxHeight: '80vh' }}
                                />
                            )}
                        </div>
                    </div>
                )
            }

            <GlassModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                title="Delete Exercise"
                message="Are you sure you want to delete this exercise? This action cannot be undone."
                onConfirm={confirmDelete}
                confirmText="Delete"
                type="danger"
            />
        </AnimationWrapper>
    );
};

export default Exercises;
