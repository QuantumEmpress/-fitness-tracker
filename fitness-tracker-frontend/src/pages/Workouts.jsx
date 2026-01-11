import React, { useState, useEffect } from 'react';
import workoutService from '../services/workoutService';
import exerciseService from '../services/exerciseService';
import { Plus, Calendar, Clock, Trash2, Dumbbell } from 'lucide-react';
import TableSkeleton from '../components/TableSkeleton';
import { toast } from 'react-hot-toast';
import AnimationWrapper, { StaggerContainer, StaggerItem } from '../components/AnimationWrapper';
import GlassModal from '../components/GlassModal';

const Workouts = () => {
    const [workouts, setWorkouts] = useState([]);
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        date: new Date().toISOString().split('T')[0],
        duration: '',
        exerciseIds: []
    });

    // Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [workoutToDelete, setWorkoutToDelete] = useState(null);

    useEffect(() => {
        fetchWorkouts();
        fetchExercises();
    }, []);

    const fetchWorkouts = async () => {
        try {
            const response = await workoutService.getAllWorkouts();
            setWorkouts(response.data);
        } catch (error) {
            console.error("Failed to fetch workouts", error);
            toast.error("Failed to load workouts");
        } finally {
            setLoading(false);
        }
    };

    const fetchExercises = async () => {
        try {
            const response = await exerciseService.getAllExercises();
            setExercises(response.data);
        } catch (error) {
            console.error("Failed to fetch exercises", error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleExerciseToggle = (id) => {
        const currentIds = formData.exerciseIds;
        if (currentIds.includes(id)) {
            setFormData({ ...formData, exerciseIds: currentIds.filter(exId => exId !== id) });
        } else {
            setFormData({ ...formData, exerciseIds: [...currentIds, id] });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loadingToast = toast.loading('Saving workout...');
        try {
            const payload = {
                name: formData.name,
                date: new Date(formData.date).toISOString(),
                durationMinutes: parseInt(formData.duration),
                exerciseIds: formData.exerciseIds
            };
            await workoutService.createWorkout(payload);
            toast.success('Workout logged successfully!', { id: loadingToast });
            setShowForm(false);
            setFormData({
                name: '',
                date: new Date().toISOString().split('T')[0],
                duration: '',
                exerciseIds: []
            });
            fetchWorkouts();
        } catch (error) {
            console.error("Failed to create workout", error);
            toast.error("Failed to log workout", { id: loadingToast });
        }
    };

    const handleDeleteClick = (id) => {
        setWorkoutToDelete(id);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!workoutToDelete) return;
        const loadingToast = toast.loading('Deleting workout...');
        try {
            await workoutService.deleteWorkout(workoutToDelete);
            toast.success('Workout deleted!', { id: loadingToast });
            fetchWorkouts();
        } catch (error) {
            console.error("Failed to delete workout", error);
            toast.error("Failed to delete workout", { id: loadingToast });
        } finally {
            setWorkoutToDelete(null);
            setDeleteModalOpen(false);
        }
    };

    if (loading) return <div className="p-6"><TableSkeleton rows={5} columns={3} /></div>;

    return (
        <AnimationWrapper className="space-y-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Workout Log</h1>
                    <p className="text-gray-500 text-lg">Track your fitness journey</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold flex items-center gap-2 hover:shadow-lg hover:scale-105 transition-all"
                >
                    <Plus size={20} />
                    Log Workout
                </button>
            </div>

            {showForm && (
                <div className="glass-card p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Log New Workout</h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Workout Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-5 py-3 rounded-xl bg-white border border-gray-100 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all outline-none text-gray-700 font-medium shadow-sm" placeholder="e.g., Morning Cardio" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                                <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full px-5 py-3 rounded-xl bg-white border border-gray-100 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all outline-none text-gray-700 font-medium shadow-sm" required />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Duration (mins)</label>
                                <input type="number" name="duration" value={formData.duration} onChange={handleInputChange} className="w-full px-5 py-3 rounded-xl bg-white border border-gray-100 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all outline-none text-gray-700 font-medium shadow-sm" placeholder="45" required />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Select Exercises</label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-4 bg-gray-50 rounded-xl border border-gray-100">
                                {exercises.map(ex => (
                                    <label key={ex.id} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-white rounded-lg transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={formData.exerciseIds.includes(ex.id)}
                                            onChange={() => handleExerciseToggle(ex.id)}
                                            className="w-4 h-4 rounded text-pink-500 focus:ring-pink-200"
                                        />
                                        <span className="text-sm font-medium text-gray-700">{ex.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button type="submit" className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all">Save Workout</button>
                            <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all">Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            <StaggerContainer className="space-y-4">
                {workouts.map((workout) => (
                    <StaggerItem key={workout.id} className="glass-card p-6 hover:scale-[1.02] transition-transform duration-300">
                        <div className="flex justify-between items-start">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-2xl shadow-lg shadow-pink-200">
                                    <Dumbbell size={24} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{workout.name}</h3>
                                    <div className="flex gap-4 text-gray-500 text-sm">
                                        <span className="flex items-center gap-1.5 font-medium"><Calendar size={16} /> {new Date(workout.date).toLocaleDateString()}</span>
                                        <span className="flex items-center gap-1.5 font-medium"><Clock size={16} /> {workout.duration} mins</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-3 font-medium">
                                        Exercises: <span className="text-pink-600">{workout.exercises ? workout.exercises.map(e => e.name).join(', ') : 'None'}</span>
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => handleDeleteClick(workout.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </StaggerItem>
                ))}
                {workouts.length === 0 && (
                    <div className="glass-card text-center py-16">
                        <img
                            src="/src/assets/images/5.png"
                            alt="Start logging workouts"
                            className="w-80 mx-auto mb-6 drop-shadow-2xl animate-float"
                        />
                        <p className="text-xl font-semibold text-gray-600 mb-2">No workouts logged yet</p>
                        <p className="text-gray-400">Start tracking your fitness journey!</p>
                    </div>
                )}
            </StaggerContainer>

            <GlassModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                title="Delete Workout"
                message="Are you sure you want to delete this workout log? This cannot be undone."
                onConfirm={confirmDelete}
                confirmText="Delete"
                type="danger"
            />
        </AnimationWrapper>
    );
};

export default Workouts;
