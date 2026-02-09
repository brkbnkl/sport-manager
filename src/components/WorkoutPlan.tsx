'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface Exercise {
    name: string;
    sets: number;
    reps: string;
    rest: string;
    youtubeUrl: string;
}

interface WorkoutPlanProps {
    muscleGroup: string;
    equipment: string;
    onBack: () => void;
}

export default function WorkoutPlan({ muscleGroup, equipment, onBack }: WorkoutPlanProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const supabase = createClient();

    // Mock workout data
    const workoutPlans: Record<string, Record<string, Exercise[]>> = {
        chest: {
            gym: [
                { name: 'Bench Press', sets: 4, reps: '8-10', rest: '90 sn', youtubeUrl: 'https://youtube.com/watch?v=rT7DgCr-3pg' },
                { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', rest: '60 sn', youtubeUrl: 'https://youtube.com/watch?v=8iPEnn-ltC8' },
                { name: 'Cable Flyes', sets: 3, reps: '12-15', rest: '60 sn', youtubeUrl: 'https://youtube.com/watch?v=Iwe6AmxVf7o' },
                { name: 'Dips', sets: 3, reps: '10-12', rest: '60 sn', youtubeUrl: 'https://youtube.com/watch?v=2z8JmcrW-As' },
            ],
            home: [
                { name: 'Dumbbell Bench Press', sets: 4, reps: '10-12', rest: '90 sn', youtubeUrl: 'https://youtube.com/watch?v=VmB1G1K7v94' },
                { name: 'Dumbbell Flyes', sets: 3, reps: '12-15', rest: '60 sn', youtubeUrl: 'https://youtube.com/watch?v=eozdVDA78K0' },
                { name: 'Push-ups', sets: 3, reps: '15-20', rest: '45 sn', youtubeUrl: 'https://youtube.com/watch?v=IODxDxX7oi4' },
                { name: 'Dumbbell Pullovers', sets: 3, reps: '12-15', rest: '60 sn', youtubeUrl: 'https://youtube.com/watch?v=FK1vO6oZzhs' },
            ],
        },
        legs: {
            gym: [
                { name: 'Squat', sets: 4, reps: '8-10', rest: '120 sn', youtubeUrl: 'https://youtube.com/watch?v=ultWZbUMPL8' },
                { name: 'Leg Press', sets: 3, reps: '10-12', rest: '90 sn', youtubeUrl: 'https://youtube.com/watch?v=IZxyjW7MPJQ' },
                { name: 'Leg Curl', sets: 3, reps: '12-15', rest: '60 sn', youtubeUrl: 'https://youtube.com/watch?v=ELOCsoDSmrg' },
                { name: 'Calf Raises', sets: 4, reps: '15-20', rest: '45 sn', youtubeUrl: 'https://youtube.com/watch?v=gwLzBJYoWlI' },
            ],
            home: [
                { name: 'Goblet Squat', sets: 4, reps: '12-15', rest: '90 sn', youtubeUrl: 'https://youtube.com/watch?v=MeIiIdhvXT4' },
                { name: 'Dumbbell Lunges', sets: 3, reps: '10-12 (her bacak)', rest: '60 sn', youtubeUrl: 'https://youtube.com/watch?v=QOVaHwm-Q6U' },
                { name: 'Romanian Deadlift', sets: 3, reps: '10-12', rest: '90 sn', youtubeUrl: 'https://youtube.com/watch?v=2SHsk9AzdjA' },
                { name: 'Single Leg Calf Raises', sets: 3, reps: '15-20 (her bacak)', rest: '45 sn', youtubeUrl: 'https://youtube.com/watch?v=3j423cZxNi8' },
            ],
        },
        arms: {
            gym: [
                { name: 'Barbell Curl', sets: 3, reps: '10-12', rest: '60 sn', youtubeUrl: 'https://youtube.com/watch?v=kwG2ipFRgfo' },
                { name: 'Tricep Dips', sets: 3, reps: '10-12', rest: '60 sn', youtubeUrl: 'https://youtube.com/watch?v=6kALZikXxLc' },
                { name: 'Hammer Curls', sets: 3, reps: '12-15', rest: '45 sn', youtubeUrl: 'https://youtube.com/watch?v=TwD-YGVP4Bk' },
                { name: 'Cable Pushdowns', sets: 3, reps: '12-15', rest: '45 sn', youtubeUrl: 'https://youtube.com/watch?v=2-LAMcpzODU' },
            ],
            home: [
                { name: 'Dumbbell Bicep Curl', sets: 3, reps: '12-15', rest: '60 sn', youtubeUrl: 'https://youtube.com/watch?v=ykJmrZ5v0Oo' },
                { name: 'Overhead Tricep Extension', sets: 3, reps: '12-15', rest: '60 sn', youtubeUrl: 'https://youtube.com/watch?v=YbX7Wd8jQ-Q' },
                { name: 'Concentration Curls', sets: 3, reps: '10-12', rest: '45 sn', youtubeUrl: 'https://youtube.com/watch?v=Jvj2wV0vOdY' },
                { name: 'Tricep Kickbacks', sets: 3, reps: '12-15', rest: '45 sn', youtubeUrl: 'https://youtube.com/watch?v=6SS6K3lAwZ8' },
            ],
        },
        back: {
            gym: [
                { name: 'Deadlift', sets: 4, reps: '6-8', rest: '120 sn', youtubeUrl: 'https://youtube.com/watch?v=op9kVnSso6Q' },
                { name: 'Pull-ups', sets: 3, reps: '8-10', rest: '90 sn', youtubeUrl: 'https://youtube.com/watch?v=eGo4IYlbE5g' },
                { name: 'Barbell Row', sets: 3, reps: '10-12', rest: '60 sn', youtubeUrl: 'https://youtube.com/watch?v=FWJR5Ve8bnQ' },
                { name: 'Lat Pulldown', sets: 3, reps: '12-15', rest: '60 sn', youtubeUrl: 'https://youtube.com/watch?v=CAwf7n6Luuc' },
            ],
            home: [
                { name: 'Dumbbell Row', sets: 3, reps: '10-12 (her kol)', rest: '60 sn', youtubeUrl: 'https://youtube.com/watch?v=roCP6wCXPqo' },
                { name: 'Dumbbell Deadlift', sets: 4, reps: '10-12', rest: '90 sn', youtubeUrl: 'https://youtube.com/watch?v=lJ3QwaXNJfw' },
                { name: 'Reverse Flyes', sets: 3, reps: '12-15', rest: '45 sn', youtubeUrl: 'https://youtube.com/watch?v=ea7u6w_b5Kw' },
                { name: 'Dumbbell Shrugs', sets: 3, reps: '15-20', rest: '45 sn', youtubeUrl: 'https://youtube.com/watch?v=cJRVVxmytaM' },
            ],
        },
    };

    const exercises = workoutPlans[muscleGroup]?.[equipment] || [];

    const muscleGroupNames: Record<string, string> = {
        chest: 'Göğüs',
        legs: 'Bacak',
        arms: 'Kol',
        back: 'Sırt',
    };

    const equipmentNames: Record<string, string> = {
        gym: 'Spor Salonu',
        home: 'Ev (Dambıl)',
    };

    const handleCompleteWorkout = async () => {
        try {
            setIsSaving(true);

            // Get current user
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                alert('Lütfen önce giriş yapın!');
                return;
            }

            // Save workout to Supabase
            const { error } = await supabase.from('workouts').insert({
                user_id: user.id,
                muscle_group: muscleGroupNames[muscleGroup],
                equipment: equipmentNames[equipment],
                duration: 45, // Varsayılan süre, ileride dinamik yapılabilir
                notes: `${exercises.length} egzersiz tamamlandı.`
            });

            if (error) throw error;

            setSaveSuccess(true);
            setTimeout(() => {
                onBack(); // 2 saniye sonra ana ekrana dön
            }, 2000);

        } catch (error) {
            console.error('Error saving workout:', error);
            alert('Antrenman kaydedilirken bir hata oluştu.');
        } finally {
            setIsSaving(false);
        }
    };

    if (saveSuccess) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6 animate-fade-in">
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-4xl animate-bounce">
                    ✅
                </div>
                <h2 className="text-3xl font-bold gradient-text">Harika İş!</h2>
                <p className="text-xl text-gray-300">Antrenman başarıyla kaydedildi.</p>
                <p className="text-gray-400">Ana sayfaya yönlendiriliyorsunuz...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <h2 className="text-4xl font-bold gradient-text">
                        {muscleGroupNames[muscleGroup]} Antrenmanı
                    </h2>
                    <p className="text-gray-400 text-lg">{equipmentNames[equipment]}</p>
                </div>
                <button
                    onClick={onBack}
                    className="px-6 py-3 glass rounded-xl text-white hover:bg-gray-800 transition-all"
                >
                    ← Geri Dön
                </button>
            </div>

            {/* Workout Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass p-6 rounded-2xl text-center space-y-2">
                    <p className="text-gray-400">Toplam Egzersiz</p>
                    <p className="text-3xl font-bold gradient-text">{exercises.length}</p>
                </div>
                <div className="glass p-6 rounded-2xl text-center space-y-2">
                    <p className="text-gray-400">Tahmini Süre</p>
                    <p className="text-3xl font-bold gradient-text">45-60 dk</p>
                </div>
                <div className="glass p-6 rounded-2xl text-center space-y-2">
                    <p className="text-gray-400">Zorluk</p>
                    <p className="text-3xl font-bold gradient-text">Orta</p>
                </div>
            </div>

            {/* Exercise List */}
            <div className="space-y-6">
                {exercises.map((exercise, index) => (
                    <div key={index} className="glass p-6 rounded-2xl space-y-4 hover:bg-gray-800 transition-all">
                        <div className="flex items-start justify-between">
                            <div className="space-y-2">
                                <div className="flex items-center space-x-3">
                                    <span className="text-2xl font-bold gradient-text">{index + 1}</span>
                                    <h3 className="text-2xl font-bold text-white">{exercise.name}</h3>
                                </div>
                                <div className="flex flex-wrap gap-4 text-gray-400">
                                    <span>📊 {exercise.sets} set</span>
                                    <span>🔢 {exercise.reps} tekrar</span>
                                    <span>⏱️ {exercise.rest} dinlenme</span>
                                </div>
                            </div>
                            <a
                                href={exercise.youtubeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-xl text-white font-semibold transition-all flex items-center space-x-2"
                            >
                                <span>▶️</span>
                                <span>Video İzle</span>
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {/* Complete Workout Button */}
            <div className="flex justify-center pt-8">
                <button
                    onClick={handleCompleteWorkout}
                    disabled={isSaving}
                    className="px-12 py-5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl text-white text-xl font-bold shadow-2xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3"
                >
                    {isSaving ? (
                        <>
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Kaydediliyor...</span>
                        </>
                    ) : (
                        <>
                            <span>✅</span>
                            <span>Antrenmanı Tamamla ve Kaydet</span>
                        </>
                    )}
                </button>
            </div>

            {/* Tips */}
            <div className="glass p-6 rounded-2xl space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                    <span>💡</span>
                    <span>İpuçları</span>
                </h3>
                <ul className="space-y-2 text-gray-300">
                    <li>• Antrenman öncesi 5-10 dakika ısınma yapın</li>
                    <li>• Her egzersizde doğru form tekniğine dikkat edin</li>
                    <li>• Dinlenme sürelerine uyun</li>
                    <li>• Antrenman sonrası esnetme hareketleri yapın</li>
                    <li>• Yeterli su tüketin</li>
                </ul>
            </div>
        </div>
    );
}
