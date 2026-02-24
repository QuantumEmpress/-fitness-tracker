import React, { useState, useEffect } from 'react';
import goalService from '../services/goalService';
import { Plus, Target, Trash2, CheckCircle2, Circle } from 'lucide-react';
import TableSkeleton from '../components/TableSkeleton';
import { toast } from 'react-hot-toast';
import AnimationWrapper, { StaggerContainer, StaggerItem } from '../components/AnimationWrapper';
import GlassModal from '../components/GlassModal';

const Goals = () => {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        description: '',
        targetDate: '',
        achieved: false
    });

    // Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [goalToDelete, setGoalToDelete] = useState(null);

    useEffect(() => {
        fetchGoals();
    }, []);

    const fetchGoals = async () => {
        try {
            const response = await goalService.getAllGoals();
            setGoals(response.data);
        } catch (error) {
            console.error("Failed to fetch goals", error);
            toast.error("Failed to load goals");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loadingToast = toast.loading('Setting new goal...');
        try {
            await goalService.createGoal(formData);
            toast.success('Goal set! You got this! 🎯', { id: loadingToast });
            setShowForm(false);
            setFormData({ description: '', targetDate: '', achieved: false });
            fetchGoals();
        } catch (error) {
            console.error("Failed to create goal", error);
            toast.error("Failed to create goal", { id: loadingToast });
        }
    };

    const handleDeleteClick = (id) => {
        setGoalToDelete(id);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!goalToDelete) return;
        const loadingToast = toast.loading('Deleting goal...');
        try {
            await goalService.deleteGoal(goalToDelete);
            toast.success('Goal deleted', { id: loadingToast });
            fetchGoals();
        } catch (error) {
            console.error("Failed to delete goal", error);
            toast.error("Failed to delete goal", { id: loadingToast });
        } finally {
            setGoalToDelete(null);
            setDeleteModalOpen(false);
        }
    };

    const toggleAchieved = async (goal) => {
        try {
            await goalService.updateGoal(goal.id, { ...goal, achieved: !goal.achieved });
            if (!goal.achieved) {
                toast.success('Goal achieved! Congratulations! 🎉');
            }
            fetchGoals();
        } catch (error) {
            console.error("Failed to update goal", error);
            toast.error("Failed to update goal status");
        }
    };

    if (loading) return <div className="p-6"><TableSkeleton rows={4} columns={3} /></div>;

    return (
        <AnimationWrapper className="space-y-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Fitness Goals</h1>
                    <p className="text-gray-500 text-lg">Set targets and crush them!</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold flex items-center gap-2 hover:shadow-lg hover:scale-105 transition-all"
                >
                    <Plus size={20} />
                    Set Goal
                </button>
            </div>

            {showForm && (
                <div className="glass-card p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Set New Goal</h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Goal Description</label>
                            <input
                                type="text"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-5 py-3 rounded-xl bg-white border border-gray-100 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 transition-all outline-none text-gray-700 font-medium shadow-sm"
                                placeholder="e.g., Lose 5kg, Run 10k"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Target Date</label>
                            <input
                                type="date"
                                value={formData.targetDate}
                                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                                className="w-full px-5 py-3 rounded-xl bg-white border border-gray-100 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 transition-all outline-none text-gray-700 font-medium shadow-sm"
                                required
                            />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button type="submit" className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all">Create Goal</button>
                            <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all">Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {goals.map((goal) => (
                    <StaggerItem key={goal.id} className={`glass-card p-6 hover:scale-105 transition-all duration-300 ${goal.achieved ? 'border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50' : ''}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-2xl shadow-lg ${goal.achieved ? 'bg-gradient-to-br from-green-500 to-emerald-500 shadow-green-200' : 'bg-gradient-to-br from-cyan-500 to-blue-500 shadow-cyan-200'}`}>
                                    {goal.achieved ? (
                                        <CheckCircle2 size={28} className="text-white" strokeWidth={2.5} />
                                    ) : (
                                        <Target size={28} className="text-white" strokeWidth={2.5} />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className={`text-xl font-bold mb-1 ${goal.achieved ? 'text-green-800 line-through' : 'text-gray-800'}`}>{goal.description}</h3>
                                    <p className="text-sm text-gray-500 font-medium flex items-center gap-1.5">
                                        <span>Target:</span> {new Date(goal.targetDate).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => handleDeleteClick(goal.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                                <Trash2 size={18} />
                            </button>
                        </div>
                        <button
                            onClick={() => toggleAchieved(goal)}
                            className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${goal.achieved ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100'}`}
                        >
                            {goal.achieved ? (
                                <>
                                    <CheckCircle2 size={20} />
                                    Completed! 🎉
                                </>
                            ) : (
                                <>
                                    <Circle size={20} />
                                    Mark as Complete
                                </>
                            )}
                        </button>
                    </StaggerItem>
                ))}
            </StaggerContainer>

            {goals.length === 0 && (
                <div className="glass-card text-center py-16">
                    <img
                        src="/images/3.png"
                        alt="Set your goals"
                        className="w-80 mx-auto mb-6 drop-shadow-2xl animate-float"
                    />
                    <p className="text-xl font-semibold text-gray-600 mb-2">No goals set yet</p>
                    <p className="text-gray-400">Set your first goal and start achieving!</p>
                </div>
            )}

            <GlassModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                title="Delete Goal"
                message="Are you sure you want to delete this goal? This cannot be undone."
                onConfirm={confirmDelete}
                confirmText="Delete"
                type="danger"
            />
        </AnimationWrapper>
    );
};

export default Goals;
