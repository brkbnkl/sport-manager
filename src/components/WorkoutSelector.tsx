'use client';

import { useState } from 'react';

interface WorkoutSelectorProps {
    onSelect: (muscleGroup: string, equipment: string) => void;
}

const muscleGroups = [
    { id: 'chest', name: 'Göğüs', icon: '💪', color: 'from-red-500 to-orange-500' },
    { id: 'back', name: 'Sırt', icon: '🦾', color: 'from-blue-500 to-cyan-500' },
    { id: 'legs', name: 'Bacak', icon: '🦵', color: 'from-green-500 to-emerald-500' },
    { id: 'arms', name: 'Kol', icon: '💪', color: 'from-purple-500 to-pink-500' },
    { id: 'shoulders', name: 'Omuz', icon: '🏋️', color: 'from-yellow-500 to-orange-500' },
    { id: 'abs', name: 'Karın', icon: '🎯', color: 'from-indigo-500 to-purple-500' },
];

const equipmentOptions = [
    { id: 'gym', name: 'Spor Salonu', icon: '🏋️‍♂️', description: 'Tam donanımlı ekipmanlar' },
    { id: 'home-dumbbells', name: 'Ev (Dambıl)', icon: '🏠', description: 'Dambıl ile ev antrenmanı' },
    { id: 'home-bodyweight', name: 'Ev (Ağırlıksız)', icon: '🤸', description: 'Sadece vücut ağırlığı' },
];

export default function WorkoutSelector({ onSelect }: WorkoutSelectorProps) {
    const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
    const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);

    const handleContinue = () => {
        if (selectedMuscle && selectedEquipment) {
            onSelect(selectedMuscle, selectedEquipment);
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="text-center mb-12">
                <h2 className="text-5xl font-bold gradient-text mb-4">
                    Antrenman Planını Oluştur
                </h2>
                <p className="text-xl text-gray-300">
                    Çalışmak istediğin kas grubunu ve ekipmanlarını seç
                </p>
            </div>

            {/* Muscle Group Selection */}
            <div className="mb-12">
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                    <span className="mr-3">1️⃣</span>
                    Kas Grubu Seç
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {muscleGroups.map((muscle) => (
                        <button
                            key={muscle.id}
                            onClick={() => setSelectedMuscle(muscle.id)}
                            className={`glass p-6 rounded-2xl transition-all hover:scale-105 ${selectedMuscle === muscle.id
                                    ? 'ring-4 ring-indigo-500 bg-gradient-to-br ' + muscle.color
                                    : 'hover:bg-white/5'
                                }`}
                        >
                            <div className="text-5xl mb-3">{muscle.icon}</div>
                            <div className="font-semibold">{muscle.name}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Equipment Selection */}
            <div className="mb-12">
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                    <span className="mr-3">2️⃣</span>
                    Ekipman Seç
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {equipmentOptions.map((equipment) => (
                        <button
                            key={equipment.id}
                            onClick={() => setSelectedEquipment(equipment.id)}
                            className={`glass p-8 rounded-2xl transition-all hover:scale-105 text-left ${selectedEquipment === equipment.id
                                    ? 'ring-4 ring-indigo-500 bg-indigo-500/20'
                                    : 'hover:bg-white/5'
                                }`}
                        >
                            <div className="text-5xl mb-4">{equipment.icon}</div>
                            <h4 className="text-xl font-bold mb-2">{equipment.name}</h4>
                            <p className="text-gray-400">{equipment.description}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Continue Button */}
            <div className="flex justify-center">
                <button
                    onClick={handleContinue}
                    disabled={!selectedMuscle || !selectedEquipment}
                    className={`px-12 py-4 rounded-full text-xl font-bold transition-all ${selectedMuscle && selectedEquipment
                            ? 'btn-primary text-white shadow-2xl hover:shadow-indigo-500/50'
                            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    Antrenman Planını Oluştur
                </button>
            </div>
        </div>
    );
}
