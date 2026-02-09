export type Language = 'tr' | 'en';

export const translations = {
    tr: {
        nav: {
            home: 'Ana Sayfa',
            workout: 'Antrenman Programı',
            progress: 'İlerleme Durumu',
            calorie: 'Kalori Hesaplama',
            login: 'Giriş Yap',
            logout: 'Çıkış Yap',
        },
        hero: {
            title: 'Kişisel Antrenman Asistanın',
            subtitle: 'Hedefine ulaşmak için sana özel programlar.',
            getStarted: 'Hemen Başla',
            learnMore: 'Daha Fazla',
            features: {
                personalized: 'Kişiselleştirilmiş Program',
                tracking: 'İlerleme Takibi',
                smart: 'Akıllı Analiz',
            }
        },
        selector: {
            steps: {
                muscle: 'Hangi bölgeyi çalıştıracaksın?',
                equipment: 'Hangi ekipmanların var?',
                difficulty: 'Seviyen nedir?',
            },
            muscles: {
                fullbody: 'Tüm Vücut',
                chest: 'Göğüs',
                back: 'Sırt',
                legs: 'Bacak',
                arms: 'Kol',
            },
            equipment: {
                gym: 'Spor Salonu',
                gymDesc: 'Tam donanımlı',
                home: 'Ev',
                homeDesc: 'Dumbell',
                bodyweight: 'Vücut Ağırlığı',
                bodyweightDesc: 'Ekipmansız',
            },
            difficulty: {
                beginner: 'Başlangıç',
                beginnerDesc: 'Yeni başlayanlar için düşük yoğunluk',
                intermediate: 'Orta',
                intermediateDesc: 'Düzenli spor yapanlar için ideal',
                advanced: 'İleri',
                advancedDesc: 'Yüksek yoğunluklu zorlu antrenman',
            }
        },
        plan: {
            title: 'Antrenman Programın Hazır!',
            muscle: 'Bölge',
            difficulty: 'Seviye',
            equipment: 'Ekipman',
            sets: 'Set',
            reps: 'Tekrar',
            rest: 'Dinlenme',
            completeWorkout: 'Antrenmanı Tamamla ve Kaydet',
            saving: 'Kaydediliyor...',
            success: 'Antrenman Başarıyla Kaydedildi!',
            error: 'Bir hata oluştu.',
            viewProgress: 'İlerlemeyi Gör',
            noExercises: 'Bu seçim için uygun egzersiz bulunamadı.',
            goBack: 'Geri Dön',
        },
        progress: {
            title: 'İlerleme Durumu',
            totalWorkouts: 'Toplam Antrenman',
            totalDuration: 'Toplam Süre',
            avgDuration: 'Ortalama Süre',
            recentActivity: 'Son Aktiviteler',
            muscleDistribution: 'Bölgesel Dağılım',
            minutes: 'dk',
            calories: 'kcal',
        },
        calorie: {
            title: 'Kalori Hesaplayıcı',
            subtitle: 'Hedefine ulaşmak için günlük ihtiyacını öğren.',
            gender: {
                male: 'Erkek',
                female: 'Kadın',
            },
            inputs: {
                age: 'Yaş',
                height: 'Boy (cm)',
                weight: 'Kilo (kg)',
                activity: 'Hareketlilik Seviyesi',
            },
            activityLevels: {
                sedentary: 'Hareketsiz (Masa başı iş, spor yok)',
                light: 'Az Hareketli (Haftada 1-3 gün spor)',
                moderate: 'Orta Hareketli (Haftada 3-5 gün spor)',
                active: 'Çok Hareketli (Haftada 6-7 gün spor)',
                athlete: 'Profesyonel Sporcu (Günde 2 antrenman)',
            },
            calculate: 'Hesapla',
            results: {
                tdee: 'Günlük Kalori İhtiyacın (TDEE)',
                bmr: 'Bazal Metabolizma Hızın (BMR)',
                lose: 'Kilo Vermek İçin',
                maintain: 'Kiloyu Korumak',
                gain: 'Kilo Almak İçin',
                loseDesc: '(-0.5 kg / hafta)',
                maintainDesc: '(Değişim yok)',
                gainDesc: '(+0.5 kg / hafta)',
                bmrDesc: '(Hiç hareket etmeden yaktığın enerji)',
            }
        }
    },
    en: {
        nav: {
            home: 'Home',
            workout: 'Workout Plan',
            progress: 'Progress Status',
            calorie: 'Calorie Calculator',
            login: 'Login',
            logout: 'Logout',
        },
        hero: {
            title: 'Your Personal Trainer',
            subtitle: 'Custom programs tailored to reach your goals.',
            getStarted: 'Get Started',
            learnMore: 'Learn More',
            features: {
                personalized: 'Personalized Program',
                tracking: 'Progress Tracking',
                smart: 'Smart Analysis',
            }
        },
        selector: {
            steps: {
                muscle: 'Target Muscle Group?',
                equipment: 'Available Equipment?',
                difficulty: 'Your Level?',
            },
            muscles: {
                fullbody: 'Full Body',
                chest: 'Chest',
                back: 'Back',
                legs: 'Legs',
                arms: 'Arms',
            },
            equipment: {
                gym: 'Gym',
                gymDesc: 'Full equipment',
                home: 'Home',
                homeDesc: 'Dumbbell',
                bodyweight: 'Bodyweight',
                bodyweightDesc: 'No equipment',
            },
            difficulty: {
                beginner: 'Beginner',
                beginnerDesc: 'Low intensity for starters',
                intermediate: 'Intermediate',
                intermediateDesc: 'Ideal for regular fitness',
                advanced: 'Advanced',
                advancedDesc: 'High intensity workout',
            }
        },
        plan: {
            title: 'Your Workout Plan is Ready!',
            muscle: 'Muscle',
            difficulty: 'Level',
            equipment: 'Equipment',
            sets: 'Sets',
            reps: 'Reps',
            rest: 'Rest',
            completeWorkout: 'Complete & Save Workout',
            saving: 'Saving...',
            success: 'Workout Saved Successfully!',
            error: 'An error occurred.',
            viewProgress: 'View Progress',
            noExercises: 'No exercises found for this selection.',
            goBack: 'Go Back',
        },
        progress: {
            title: 'Progress Status',
            totalWorkouts: 'Total Workouts',
            totalDuration: 'Total Duration',
            avgDuration: 'Avg Duration',
            recentActivity: 'Recent Activity',
            muscleDistribution: 'Muscle Distribution',
            minutes: 'min',
            calories: 'kcal',
        },
        calorie: {
            title: 'Calorie Calculator',
            subtitle: 'Calculate your daily energy needs.',
            gender: {
                male: 'Male',
                female: 'Female',
            },
            inputs: {
                age: 'Age',
                height: 'Height (cm)',
                weight: 'Weight (kg)',
                activity: 'Activity Level',
            },
            activityLevels: {
                sedentary: 'Sedentary (Office job, no exercise)',
                light: 'Lightly Active (1-3 days/week)',
                moderate: 'Moderately Active (3-5 days/week)',
                active: 'Very Active (6-7 days/week)',
                athlete: 'Professional Athlete (2x training/day)',
            },
            calculate: 'Calculate',
            results: {
                tdee: 'Daily Calorie Needs (TDEE)',
                bmr: 'Basal Metabolic Rate (BMR)',
                lose: 'To Lose Weight',
                maintain: 'To Maintain Weight',
                gain: 'To Gain Weight',
                loseDesc: '(-0.5 kg / week)',
                maintainDesc: '(No change)',
                gainDesc: '(+0.5 kg / week)',
                bmrDesc: '(Energy burned at complete rest)',
            }
        }
    }
};
