'use client';

import { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import WorkoutSelector from '@/components/WorkoutSelector';
import WorkoutPlan from '@/components/WorkoutPlan';
import ProgressTracker from '@/components/ProgressTracker';
import AuthModal from '@/components/AuthModal';
import CalorieCalculator from '@/components/CalorieCalculator';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { Language, translations } from '@/utils/translations';


export default function Home() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string | null>(null);
    const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);
    const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
    const [currentView, setCurrentView] = useState<'home' | 'workout' | 'progress' | 'calorie'>('home');
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [lang, setLang] = useState<Language>('tr');
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const t = translations[lang];


    const supabase = createClient();

    useEffect(() => {
        // Dark mode initialization
        if (typeof window !== 'undefined') {
            if (isDarkMode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    }, [isDarkMode]);

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

    const handleWorkoutSelect = (muscleGroup: string, equipment: string, difficulty: string) => {
        setSelectedMuscleGroup(muscleGroup);
        setSelectedEquipment(equipment);
        setSelectedDifficulty(difficulty);
    };

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    const toggleLang = () => {
        setLang(lang === 'tr' ? 'en' : 'tr');
    };


    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <main className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
            {/* Navigation */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${isDarkMode ? 'glass border-white/10' : 'bg-white/80 backdrop-blur-md border-gray-200 shadow-sm'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setCurrentView('home')}>
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                                <span className="text-2xl">💪</span>
                            </div>
                            <h1 className="text-2xl font-black gradient-text hidden sm:block font-outfit tracking-tighter">FitTrack Pro</h1>
                        </div>

                        <div className="flex items-center space-x-1 sm:space-x-6">
                            {user && (
                                <div className="flex items-center space-x-1 sm:space-x-4">
                                    <button
                                        onClick={() => setCurrentView('home')}
                                        className={`px-3 py-2 rounded-lg text-sm font-black font-outfit transition-all uppercase tracking-tighter ${currentView === 'home'
                                            ? 'text-indigo-500 bg-indigo-500/10'
                                            : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                                            }`}
                                    >
                                        {t.nav.home}
                                    </button>
                                    <button
                                        onClick={() => setCurrentView('workout')}
                                        className={`px-3 py-2 rounded-lg text-sm font-black font-outfit transition-all uppercase tracking-tighter ${currentView === 'workout'
                                            ? 'text-indigo-500 bg-indigo-500/10'
                                            : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                                            }`}
                                    >
                                        {t.nav.workout}
                                    </button>
                                    <button
                                        onClick={() => setCurrentView('progress')}
                                        className={`px-3 py-2 rounded-lg text-sm font-black font-outfit transition-all uppercase tracking-tighter ${currentView === 'progress'
                                            ? 'text-indigo-500 bg-indigo-500/10'
                                            : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                                            }`}
                                    >
                                        {t.nav.progress}
                                    </button>
                                    <button
                                        onClick={() => setCurrentView('calorie')}
                                        className={`px-3 py-2 rounded-lg text-sm font-black font-outfit transition-all uppercase tracking-tighter ${currentView === 'calorie'
                                            ? 'text-indigo-500 bg-indigo-500/10'
                                            : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                                            }`}
                                    >
                                        {t.nav.calorie}
                                    </button>
                                </div>

                            )}

                            <div className="flex items-center space-x-4 pl-4 border-l border-gray-700/50">
                                <button
                                    onClick={toggleLang}
                                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${isDarkMode ? 'border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/10' : 'border-gray-300 text-gray-600 hover:bg-gray-100'}`}
                                >
                                    {lang.toUpperCase()}
                                </button>
                                <button
                                    onClick={toggleTheme}
                                    className={`p-2 rounded-full transition-colors ${isDarkMode ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                                >
                                    {isDarkMode ? '☀️' : '🌙'}
                                </button>

                                {user ? (
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                                            className="flex items-center focus:outline-none group"
                                        >
                                            <div className="w-10 h-10 rounded-full border-2 border-indigo-500/50 p-0.5 group-hover:border-indigo-500 transition-all">
                                                {user.user_metadata?.avatar_url ? (
                                                    <img
                                                        src={user.user_metadata.avatar_url}
                                                        alt="Profile"
                                                        className="w-full h-full rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                                                        {user.email?.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                        </button>

                                        {showProfileMenu && (
                                            <div className={`absolute right-0 mt-3 w-48 rounded-xl shadow-2xl z-[60] border animate-fade-in ${isDarkMode ? 'bg-gray-900 border-white/10' : 'bg-white border-gray-200'}`}>
                                                <div className="p-2 space-y-1">
                                                    <div className="px-4 py-3 border-b border-gray-700/50 mb-1">
                                                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            setCurrentView('progress');
                                                            setShowProfileMenu(false);
                                                        }}
                                                        className={`w-full text-left px-4 py-2 text-sm font-bold font-outfit rounded-lg transition-all ${isDarkMode ? 'text-gray-300 hover:bg-white/5 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                                                    >
                                                        👤 {lang === 'tr' ? 'Profili Görüntüle' : 'View Profile'}
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            handleSignOut();
                                                            setShowProfileMenu(false);
                                                        }}
                                                        className="w-full text-left px-4 py-2 text-sm font-bold font-outfit text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                                    >
                                                        🚪 {t.nav.logout}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setShowAuthModal(true)}
                                        className="px-6 py-2 btn-primary rounded-lg text-white font-black font-outfit shadow-lg hover:shadow-indigo-500/20 uppercase tracking-tighter"
                                    >
                                        {t.nav.login}
                                    </button>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                {currentView === 'home' && (
                    <Hero onGetStarted={handleGetStarted} isAuthenticated={!!user} lang={lang} />
                )}

                {currentView === 'calorie' && (
                    <div className="max-w-4xl mx-auto py-8">
                        <CalorieCalculator lang={lang} />
                    </div>
                )}


                {currentView === 'workout' && (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        {!selectedMuscleGroup || !selectedEquipment || !selectedDifficulty ? (
                            <WorkoutSelector onSelect={handleWorkoutSelect} lang={lang} />
                        ) : (
                            <WorkoutPlan
                                muscleGroup={selectedMuscleGroup}
                                equipment={selectedEquipment}
                                difficulty={selectedDifficulty}
                                lang={lang}
                                onBack={() => {
                                    setSelectedMuscleGroup(null);
                                    setSelectedEquipment(null);
                                    setSelectedDifficulty(null);
                                }}
                            />
                        )}
                    </div>
                )}

                {currentView === 'progress' && (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <ProgressTracker lang={lang} />
                    </div>
                )}

            </div>

            {/* Auth Modal */}
            {showAuthModal && (
                <AuthModal
                    onClose={() => setShowAuthModal(false)}
                    lang={lang}
                />
            )}

        </main>
    );
}
