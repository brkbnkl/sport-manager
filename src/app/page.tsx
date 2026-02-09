'use client';

import { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import WorkoutSelector from '@/components/WorkoutSelector';
import WorkoutPlan from '@/components/WorkoutPlan';
import ProgressTracker from '@/components/ProgressTracker';
import AuthModal from '@/components/AuthModal';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

export default function Home() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string | null>(null);
    const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);
    const [currentView, setCurrentView] = useState<'home' | 'workout' | 'progress'>('home');

    const supabase = createClient();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setIsLoading(false);
        };

        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setIsLoading(false);
            if (session?.user) {
                setShowAuthModal(false);
            }
        });

        return () => subscription.unsubscribe();
    }, [supabase.auth]);

    const handleGetStarted = () => {
        if (!user) {
            setShowAuthModal(true);
        } else {
            setCurrentView('workout');
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setCurrentView('home');
        setUser(null);
    };

    const handleWorkoutSelect = (muscleGroup: string, equipment: string) => {
        setSelectedMuscleGroup(muscleGroup);
        setSelectedEquipment(equipment);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <main className="min-h-screen">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 glass">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setCurrentView('home')}>
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">💪</span>
                            </div>
                            <h1 className="text-2xl font-bold gradient-text">FitTrack Pro</h1>
                        </div>

                        <div className="flex items-center space-x-6">
                            {user && (
                                <>
                                    <button
                                        onClick={() => setCurrentView('home')}
                                        className={`px-4 py-2 rounded-lg transition-all ${currentView === 'home' ? 'text-indigo-400' : 'text-gray-400 hover:text-white'
                                            }`}
                                    >
                                        Ana Sayfa
                                    </button>
                                    <button
                                        onClick={() => setCurrentView('workout')}
                                        className={`px-4 py-2 rounded-lg transition-all ${currentView === 'workout' ? 'text-indigo-400' : 'text-gray-400 hover:text-white'
                                            }`}
                                    >
                                        Antrenmanlar
                                    </button>
                                    <button
                                        onClick={() => setCurrentView('progress')}
                                        className={`px-4 py-2 rounded-lg transition-all ${currentView === 'progress' ? 'text-indigo-400' : 'text-gray-400 hover:text-white'
                                            }`}
                                    >
                                        İlerleme
                                    </button>
                                </>
                            )}

                            {user ? (
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm text-gray-400 hidden md:block">{user.email}</span>
                                    <button
                                        onClick={handleSignOut}
                                        className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-all text-white"
                                    >
                                        Çıkış Yap
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowAuthModal(true)}
                                    className="px-6 py-2 btn-primary rounded-lg text-white font-semibold"
                                >
                                    Giriş Yap
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="pt-16">
                {currentView === 'home' && (
                    <Hero onGetStarted={handleGetStarted} isAuthenticated={!!user} />
                )}

                {currentView === 'workout' && (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        {!selectedMuscleGroup || !selectedEquipment ? (
                            <WorkoutSelector onSelect={handleWorkoutSelect} />
                        ) : (
                            <WorkoutPlan
                                muscleGroup={selectedMuscleGroup}
                                equipment={selectedEquipment}
                                onBack={() => {
                                    setSelectedMuscleGroup(null);
                                    setSelectedEquipment(null);
                                }}
                            />
                        )}
                    </div>
                )}

                {currentView === 'progress' && (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <ProgressTracker />
                    </div>
                )}
            </div>

            {/* Auth Modal */}
            {showAuthModal && (
                <AuthModal
                    onClose={() => setShowAuthModal(false)}
                />
            )}
        </main>
    );
}
