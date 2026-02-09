'use client';

import { useState } from 'react';
import React from 'react';
import { Language, translations } from '@/utils/translations';

export default function CalorieCalculator({ lang }: { lang: Language }) {
    const t = translations[lang].calorie;
    const [formData, setFormData] = useState({
        gender: 'male',
        age: '',
        height: '',
        weight: '',
        activity: '1.2'
    });


    const [result, setResult] = useState<{ bmr: number; tdee: number } | null>(null);

    const calculateCalories = (e: React.FormEvent) => {
        e.preventDefault();

        const age = Number(formData.age);
        const height = Number(formData.height);
        const weight = Number(formData.weight);
        const activity = Number(formData.activity);

        // Harris-Benedict Formula
        let bmr = 0;
        if (formData.gender === 'male') {
            bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
        } else {
            bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
        }

        const tdee = bmr * activity;
        setResult({ bmr: Math.round(bmr), tdee: Math.round(tdee) });
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
            <div className="text-center space-y-2">
                <h2 className="text-4xl font-bold gradient-text font-outfit">{t.title}</h2>
                <p className="text-gray-400">{t.subtitle}</p>
            </div>

            <form onSubmit={calculateCalories} className="glass p-8 rounded-3xl space-y-6">
                {/* Gender */}
                <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, gender: 'male' })}
                        className={`p-4 rounded-xl transition-all font-semibold font-outfit ${formData.gender === 'male'
                            ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                    >
                        👨 {t.gender.male}
                    </button>
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, gender: 'female' })}
                        className={`p-4 rounded-xl transition-all font-semibold font-outfit ${formData.gender === 'female'
                            ? 'bg-pink-600 text-white ring-2 ring-pink-300'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                    >
                        👩 {t.gender.female}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">{t.inputs.age}</label>
                        <input
                            type="number"
                            required
                            placeholder={lang === 'tr' ? 'Örn: 25' : 'Ex: 25'}
                            className="w-full bg-black/50 border border-gray-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            value={formData.age}
                            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">{t.inputs.height}</label>
                        <input
                            type="number"
                            required
                            placeholder={lang === 'tr' ? 'Örn: 180' : 'Ex: 180'}
                            className="w-full bg-black/50 border border-gray-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            value={formData.height}
                            onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">{t.inputs.weight}</label>
                        <input
                            type="number"
                            required
                            placeholder={lang === 'tr' ? 'Örn: 75' : 'Ex: 75'}
                            className="w-full bg-black/50 border border-gray-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            value={formData.weight}
                            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">{t.inputs.activity}</label>
                    <select
                        className="w-full bg-black/50 border border-gray-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none appearance-none cursor-pointer"
                        value={formData.activity}
                        onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
                    >
                        <option value="1.2">{t.activityLevels.sedentary}</option>
                        <option value="1.375">{t.activityLevels.light}</option>
                        <option value="1.55">{t.activityLevels.moderate}</option>
                        <option value="1.725">{t.activityLevels.active}</option>
                        <option value="1.9">{t.activityLevels.athlete}</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white font-black text-xl shadow-lg hover:scale-[1.02] transition-transform font-outfit"
                >
                    {t.calculate}
                </button>
            </form>

            {result && (
                <div className="glass p-8 rounded-3xl space-y-8 animate-fade-in border border-indigo-500/30">
                    <div className="text-center">
                        <p className="text-gray-400 mb-2">{t.results.tdee}</p>
                        <h3 className="text-5xl font-bold text-white gradient-text font-outfit">{result.tdee} kcal</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-2xl text-center space-y-2">
                            <span className="text-2xl">🥗</span>
                            <h4 className="font-black text-green-400 font-outfit">{t.results.lose}</h4>
                            <p className="text-2xl font-black text-white font-outfit">{result.tdee - 500}</p>
                            <p className="text-xs text-gray-400">{t.results.loseDesc}</p>
                        </div>
                        <div className="bg-yellow-500/10 border border-yellow-500/20 p-6 rounded-2xl text-center space-y-2">
                            <span className="text-2xl">⚖️</span>
                            <h4 className="font-black text-yellow-400 font-outfit">{t.results.maintain}</h4>
                            <p className="text-2xl font-black text-white font-outfit">{result.tdee}</p>
                            <p className="text-xs text-gray-400">{t.results.maintainDesc}</p>
                        </div>
                        <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl text-center space-y-2">
                            <span className="text-2xl">💪</span>
                            <h4 className="font-black text-red-400 font-outfit">{t.results.gain}</h4>
                            <p className="text-2xl font-black text-white font-outfit">{result.tdee + 500}</p>
                            <p className="text-xs text-gray-400">{t.results.gainDesc}</p>
                        </div>
                    </div>

                    <div className="bg-white/5 p-4 rounded-xl text-sm text-gray-400 text-center">
                        * {t.results.bmr}: <span className="text-white font-bold">{result.bmr} kcal</span> {t.results.bmrDesc}
                    </div>
                </div>
            )}
        </div>
    );
}
