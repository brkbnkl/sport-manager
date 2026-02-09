'use client';

import { useState } from 'react';
import { Language, translations } from '@/utils/translations';

type SelectorStep = 'muscle' | 'equipment' | 'difficulty';

interface WorkoutSelectorProps {
    onSelect: (muscleGroup: string, equipment: string, difficulty: string) => void;
    lang: Language;
}

export default function WorkoutSelector({ onSelect, lang }: WorkoutSelectorProps) {
    const t = translations[lang].selector;
    const [step, setStep] = useState<SelectorStep>('muscle');

    const [selections, setSelections] = useState({
        muscle: '',
        equipment: '',
        difficulty: ''
    });

    const muscleGroups = [
        { id: 'fullbody', name: t.muscles.fullbody, image: 'https://cdn.centr.com/content/8000/7790/images/landscapewidedesktop1x-3058cc7a537e7f0646c12b3c4a351f7c-loup-cen-inline-luke-169.jpg' },
        { id: 'chest', name: t.muscles.chest, image: 'https://www.mensjournal.com/.image/w_3840,q_auto:good,c_fill,ar_16:9/MTk2MTM2ODMyNjk1MDE4NjQx/main-cable-chest-arms.jpg' },
        { id: 'back', name: t.muscles.back, image: 'https://www.macfit.com/wp-content/uploads/2023/03/sirt-hareketleri.jpg' },
        { id: 'legs', name: t.muscles.legs, image: 'https://blog.ssnsports.com.tr/wp-content/uploads/2024/01/bacak-kasi-gelisimi-81.jpg' },
        { id: 'arms', name: t.muscles.arms, image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500&q=80' },
    ];

    const equipmentOptions = [
        { id: 'gym', name: t.equipment.gym, icon: '🏋️‍♂️', description: t.equipment.gymDesc },
        { id: 'dumbbells', name: t.equipment.home, icon: '🏠', description: t.equipment.homeDesc },
        { id: 'bodyweight', name: t.equipment.bodyweight, icon: '🤸', description: t.equipment.bodyweightDesc },
    ];

    const difficultyOptions = [
        { id: 'beginner', name: t.difficulty.beginner, icon: '🌱', description: t.difficulty.beginnerDesc },
        { id: 'intermediate', name: t.difficulty.intermediate, icon: '🔥', description: t.difficulty.intermediateDesc },
        { id: 'advanced', name: t.difficulty.advanced, icon: '⚡', description: t.difficulty.advancedDesc },
    ];

    const handleSelection = (type: SelectorStep, value: string) => {
        const newSelections = { ...selections, [type]: value };
        setSelections(newSelections);

        if (type === 'muscle') {
            setStep('equipment');
        } else if (type === 'equipment') {
            setStep('difficulty');
        } else {
            // Final selection made
            onSelect(newSelections.muscle, newSelections.equipment, value);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold gradient-text font-outfit">
                    {step === 'muscle' ? t.steps.muscle :
                        step === 'equipment' ? t.steps.equipment :
                            t.steps.difficulty}
                </h2>
                <div className="flex justify-center space-x-2">
                    <div className={`h-2 w-12 rounded-full transition-all duration-300 ${step === 'muscle' ? 'bg-indigo-500' : 'bg-gray-700'}`} />
                    <div className={`h-2 w-12 rounded-full transition-all duration-300 ${step === 'equipment' ? 'bg-indigo-500' : 'bg-gray-700'}`} />
                    <div className={`h-2 w-12 rounded-full transition-all duration-300 ${step === 'difficulty' ? 'bg-indigo-500' : 'bg-gray-700'}`} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {step === 'muscle' && muscleGroups.map((group) => (
                    <button
                        key={group.id}
                        onClick={() => handleSelection('muscle', group.id)}
                        className="group relative h-64 rounded-2xl overflow-hidden hover:scale-105 transition-all shadow-lg"
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                            style={{ backgroundImage: `url(${group.image})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                        <div className="absolute bottom-0 left-0 p-6 w-full text-left">
                            <h3 className="text-3xl font-black text-white mb-1 group-hover:text-indigo-400 transition-colors font-outfit">
                                {group.name}
                            </h3>
                            <div className="h-1 w-12 bg-indigo-500 rounded-full" />
                        </div>
                    </button>
                ))}

                {step === 'equipment' && equipmentOptions.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => handleSelection('equipment', option.id)}
                        className="glass p-8 rounded-2xl hover:scale-105 transition-all group text-left space-y-4"
                    >
                        <span className="text-4xl">{option.icon}</span>
                        <div>
                            <h3 className="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors font-outfit">
                                {option.name}
                            </h3>
                            {option.description && (
                                <p className="text-sm text-gray-400 mt-1">{option.description}</p>
                            )}
                        </div>
                    </button>
                ))}

                {step === 'difficulty' && difficultyOptions.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => handleSelection('difficulty', option.id)}
                        className="glass p-8 rounded-2xl hover:scale-105 transition-all group text-left space-y-4"
                    >
                        <span className="text-4xl">{option.icon}</span>
                        <div>
                            <h3 className="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors font-outfit">
                                {option.name}
                            </h3>
                            <p className="text-gray-400 text-sm mt-2">{option.description}</p>
                        </div>
                    </button>
                ))}
            </div>

            {step !== 'muscle' && (
                <div className="flex justify-center pt-8">
                    <button
                        onClick={() => setStep(step === 'difficulty' ? 'equipment' : 'muscle')}
                        className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2 font-medium"
                    >
                        <span>← {lang === 'tr' ? 'Geri Dön' : 'Go Back'}</span>
                    </button>
                </div>
            )}
        </div>
    );
}
