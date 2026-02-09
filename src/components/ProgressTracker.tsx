'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

interface WorkoutSession {
    id: string;
    date: string;
    muscle_group: string; // Supabase column name
    duration: number;
    notes: string;
}

export default function ProgressTracker() {
    const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
    const [workoutSessions, setWorkoutSessions] = useState<WorkoutSession[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchWorkouts = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('workouts')
                .select('*')
                .eq('user_id', user.id)
                .order('date', { ascending: false });

            if (error) {
                console.error('Error fetching workouts:', error);
            } else {
                setWorkoutSessions(data || []);
            }
            setLoading(false);
        };

        fetchWorkouts();
    }, [supabase]);

    const stats = {
        totalWorkouts: workoutSessions.length,
        totalMinutes: workoutSessions.reduce((sum, session) => sum + session.duration, 0),
        avgDuration: workoutSessions.length > 0 ? Math.round(workoutSessions.reduce((sum, session) => sum + session.duration, 0) / workoutSessions.length) : 0,
        streak: 0, // Streak hesaplaması daha sonra eklenebilir
    };

    const muscleGroupDistribution = workoutSessions.reduce((acc, session) => {
        const group = session.muscle_group;
        acc[group] = (acc[group] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold gradient-text">İlerleme Takibi</h2>
                <p className="text-gray-400 text-lg">Antrenman geçmişinizi ve istatistiklerinizi görüntüleyin</p>
            </div>

            {/* Time Range Selector */}
            <div className="flex justify-center gap-4">
                {(['week', 'month', 'year'] as const).map((range) => (
                    <button
                        key={range}
                        onClick={() => setTimeRange(range)}
                        className={`px-6 py-2 rounded-lg transition-all ${timeRange === range
                                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                                : 'glass text-gray-400 hover:text-white'
                            }`}
                    >
                        {range === 'week' ? 'Bu Hafta' : range === 'month' ? 'Bu Ay' : 'Bu Yıl'}
                    </button>
                ))}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass p-6 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-400">Toplam Antrenman</span>
                        <span className="text-3xl">🏋️</span>
                    </div>
                    <p className="text-4xl font-bold gradient-text">{stats.totalWorkouts}</p>
                </div>

                <div className="glass p-6 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-400">Toplam Süre</span>
                        <span className="text-3xl">⏱️</span>
                    </div>
                    <p className="text-4xl font-bold gradient-text">{stats.totalMinutes} dk</p>
                </div>

                <div className="glass p-6 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-400">Ortalama Süre</span>
                        <span className="text-3xl">📊</span>
                    </div>
                    <p className="text-4xl font-bold gradient-text">{stats.avgDuration} dk</p>
                </div>

                <div className="glass p-6 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-400">Seri</span>
                        <span className="text-3xl">🔥</span>
                    </div>
                    <p className="text-4xl font-bold gradient-text">{stats.streak} gün</p>
                </div>
            </div>

            {workoutSessions.length === 0 ? (
                <div className="glass p-12 rounded-2xl text-center space-y-4">
                    <p className="text-6xl">📝</p>
                    <h3 className="text-2xl font-bold text-white">Henüz Kayıt Yok</h3>
                    <p className="text-gray-400">
                        İlk antrenmanınızı tamamladığınızda istatistikleriniz burada görünecek.
                    </p>
                </div>
            ) : (
                <>
                    {/* Muscle Group Distribution */}
                    <div className="glass p-8 rounded-2xl space-y-6">
                        <h3 className="text-2xl font-bold text-white">Kas Grubu Dağılımı</h3>
                        <div className="space-y-4">
                            {Object.entries(muscleGroupDistribution).map(([muscle, count]) => {
                                const percentage = (count / stats.totalWorkouts) * 100;
                                return (
                                    <div key={muscle} className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-300">{muscle}</span>
                                            <span className="text-gray-400">{count} antrenman ({percentage.toFixed(0)}%)</span>
                                        </div>
                                        <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Recent Workouts */}
                    <div className="glass p-8 rounded-2xl space-y-6">
                        <h3 className="text-2xl font-bold text-white">Son Antrenmanlar</h3>
                        <div className="space-y-4">
                            {workoutSessions.map((session) => (
                                <div
                                    key={session.id}
                                    className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-all"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                                            <span className="text-2xl">💪</span>
                                        </div>
                                        <div>
                                            <p className="text-white font-semibold">{session.muscle_group}</p>
                                            <p className="text-gray-400 text-sm">
                                                {new Date(session.date).toLocaleDateString('tr-TR', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-white font-semibold">{session.duration} dakika</p>
                                        <p className="text-gray-400 text-sm">{session.notes}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {/* Motivational Message */}
            <div className="glass p-8 rounded-2xl text-center space-y-4">
                <p className="text-2xl">🎯</p>
                <p className="text-xl text-white font-semibold">Harika gidiyorsun!</p>
                <p className="text-gray-400">
                    Düzenli antrenman yaparak hedeflerine ulaşıyorsun. Devam et!
                </p>
            </div>
        </div>
    );
}
