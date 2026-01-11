import React, { useState, useEffect } from 'react';
import userService from '../services/userService';
import { Calculator, Activity, Heart, Flame, Info } from 'lucide-react';

const Calculators = () => {
    const [stats, setStats] = useState({
        height: '',
        weight: '',
        age: '',
        gender: 'MALE',
        activityLevel: 'SEDENTARY'
    });
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await userService.getProfile();
            const data = response.data;
            if (data.height) {
                setStats({
                    height: data.height,
                    weight: data.weight,
                    age: data.age,
                    gender: data.gender || 'MALE',
                    activityLevel: data.activityLevel || 'SEDENTARY'
                });
                setResults({
                    bmi: data.bmi,
                    bmr: data.bmr,
                    tdee: data.tdee
                });
            }
        } catch (error) {
            console.error("Failed to fetch profile", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setStats({ ...stats, [e.target.name]: e.target.value });
    };

    const handleCalculate = async (e) => {
        e.preventDefault();
        try {
            // Update profile with new stats to get backend calculations
            const response = await userService.updateProfile(stats);
            const data = response.data;
            setResults({
                bmi: data.bmi,
                bmr: data.bmr,
                tdee: data.tdee
            });
            alert("Stats updated and calculated!");
        } catch (error) {
            console.error("Failed to calculate", error);
            alert("Failed to calculate. Please try again.");
        }
    };

    const getBMIStatus = (bmi) => {
        if (!bmi) return { text: '', color: '' };
        if (bmi < 18.5) return { text: 'Underweight', color: 'text-blue-500' };
        if (bmi < 25) return { text: 'Normal Weight', color: 'text-green-500' };
        if (bmi < 30) return { text: 'Overweight', color: 'text-orange-500' };
        return { text: 'Obese', color: 'text-red-500' };
    };

    if (loading) return <div className="p-6">Loading calculators...</div>;

    const bmiStatus = getBMIStatus(results?.bmi);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <Calculator className="text-indigo-600" size={32} />
                Fitness Calculators
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Form */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <Activity size={20} />
                        Your Stats
                    </h2>
                    <form onSubmit={handleCalculate} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                                <input
                                    type="number"
                                    name="height"
                                    value={stats.height}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-lg"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                                <input
                                    type="number"
                                    name="weight"
                                    value={stats.weight}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-lg"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                                <input
                                    type="number"
                                    name="age"
                                    value={stats.age}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-lg"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                <select
                                    name="gender"
                                    value={stats.gender}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-lg"
                                >
                                    <option value="MALE">Male</option>
                                    <option value="FEMALE">Female</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Activity Level</label>
                            <select
                                name="activityLevel"
                                value={stats.activityLevel}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-lg"
                            >
                                <option value="SEDENTARY">Sedentary (Little or no exercise)</option>
                                <option value="LIGHT">Light (Exercise 1-3 times/week)</option>
                                <option value="MODERATE">Moderate (Exercise 4-5 times/week)</option>
                                <option value="ACTIVE">Active (Daily exercise or intense exercise 3-4 times/week)</option>
                                <option value="VERY_ACTIVE">Very Active (Intense exercise 6-7 times/week)</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                        >
                            Calculate & Save
                        </button>
                    </form>
                </div>

                {/* Results */}
                <div className="space-y-6">
                    {/* BMI Card */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                <Heart className="text-red-500" size={20} />
                                BMI (Body Mass Index)
                            </h3>
                            <div className="group relative">
                                <Info size={16} className="text-gray-400 cursor-help" />
                                <div className="absolute right-0 w-48 bg-gray-800 text-white text-xs p-2 rounded hidden group-hover:block z-10">
                                    Measure of body fat based on height and weight.
                                </div>
                            </div>
                        </div>
                        <div className="text-center py-4">
                            <p className="text-4xl font-bold text-gray-800">{results?.bmi ? results.bmi.toFixed(1) : '--'}</p>
                            <p className={`font-medium ${bmiStatus.color}`}>{bmiStatus.text || 'Enter stats'}</p>
                        </div>
                    </div>

                    {/* BMR & TDEE Card */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2 mb-4">
                            <Flame className="text-orange-500" size={20} />
                            Energy Expenditure
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-orange-50 p-4 rounded-lg text-center">
                                <p className="text-sm text-gray-600 mb-1">BMR (Basal Metabolic Rate)</p>
                                <p className="text-2xl font-bold text-gray-800">{results?.bmr ? Math.round(results.bmr) : '--'}</p>
                                <p className="text-xs text-gray-500">Calories/day at rest</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg text-center">
                                <p className="text-sm text-gray-600 mb-1">TDEE (Total Daily Energy)</p>
                                <p className="text-2xl font-bold text-gray-800">{results?.tdee ? Math.round(results.tdee) : '--'}</p>
                                <p className="text-xs text-gray-500">Calories/day to maintain</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Calculators;
