'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Language, translations } from '@/utils/translations';

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
    difficulty: string;
    onBack: () => void;
    lang: Language;
}

export default function WorkoutPlan({ muscleGroup, equipment, difficulty, onBack, lang }: WorkoutPlanProps) {
    const t = translations[lang].plan;

    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [completedExercises, setCompletedExercises] = useState<Set<number>>(new Set());
    const supabase = createClient();

    // Zorluk seviyesine göre set ve tekrar ayarları
    const difficultySettings: Record<string, { sets: number, rest: string }> = {
        beginner: { sets: 2, rest: lang === 'tr' ? '90 sn' : '90 sec' },
        intermediate: { sets: 3, rest: lang === 'tr' ? '60 sn' : '60 sec' },
        advanced: { sets: 4, rest: lang === 'tr' ? '45 sn' : '45 sec' }
    };

    const currentSettings = difficultySettings[difficulty] || difficultySettings.intermediate;

    // Egzersiz veritabanı (Zorluk seviyesine göre ayrılmış)
    const workoutDatabase: Record<string, Record<string, Record<string, Omit<Exercise, 'sets' | 'rest'>[]>>> = {
        chest: {
            gym: {
                beginner: [
                    { name: 'Chest Press Machine', reps: '12-15', youtubeUrl: 'https://youtube.com/results?search_query=chest+press+machine+tutorial' },
                    { name: 'Incline Pec Deck Fly', reps: '12-15', youtubeUrl: 'https://youtube.com/results?search_query=pec+deck+fly+tutorial' },
                    { name: 'Knee Push-ups', reps: '10-15', youtubeUrl: 'https://youtube.com/results?search_query=knee+push+ups' },
                ],
                intermediate: [
                    { name: 'Barbell Bench Press', reps: '8-10', youtubeUrl: 'https://youtube.com/results?search_query=bench+press+tutorial' },
                    { name: 'Incline Dumbbell Press', reps: '10-12', youtubeUrl: 'https://youtube.com/results?search_query=incline+dumbbell+press' },
                    { name: 'Cable Flyes', reps: '12-15', youtubeUrl: 'https://youtube.com/results?search_query=cable+flyes' },
                    { name: 'Dips', reps: 'Max', youtubeUrl: 'https://youtube.com/results?search_query=chest+dips' },
                ],
                advanced: [
                    { name: 'Pause Bench Press', reps: '5-8', youtubeUrl: 'https://youtube.com/results?search_query=pause+bench+press' },
                    { name: 'Incline Barbell Press', reps: '8-10', youtubeUrl: 'https://youtube.com/results?search_query=incline+barbell+press' },
                    { name: 'Weighted Dips', reps: '8-12', youtubeUrl: 'https://youtube.com/results?search_query=weighted+dips' },
                    { name: 'Low-to-High Cable Fly', reps: '12-15', youtubeUrl: 'https://youtube.com/results?search_query=low+to+high+cable+fly' },
                    { name: 'Chest Press (Dropset)', reps: '10-12-15', youtubeUrl: 'https://youtube.com/results?search_query=chest+press+dropset' },
                ],
            },
            dumbbells: {
                beginner: [
                    { name: 'Dumbbell Floor Press', reps: '12-15', youtubeUrl: 'https://youtube.com/results?search_query=dumbbell+floor+press' },
                    { name: 'Dumbbell Flyes', reps: '12-15', youtubeUrl: 'https://youtube.com/results?search_query=dumbbell+flyes' },
                    { name: 'Glute Bridge Chest Press', reps: '12-15', youtubeUrl: 'https://youtube.com/results?search_query=glute+bridge+chest+press' },
                ],
                intermediate: [
                    { name: 'Dumbbell Bench Press', reps: '10-12', youtubeUrl: 'https://youtube.com/results?search_query=dumbbell+bench+press' },
                    { name: 'Incline Dumbbell Press', reps: '10-12', youtubeUrl: 'https://youtube.com/results?search_query=incline+dumbbell+press' },
                    { name: 'Dumbbell Flyes', reps: '12-15', youtubeUrl: 'https://youtube.com/results?search_query=dumbbell+flyes' },
                    { name: 'Dumbbell Pullover', reps: '12-15', youtubeUrl: 'https://youtube.com/results?search_query=dumbbell+pullover' },
                ],
                advanced: [
                    { name: 'Single Arm Dumbbell Press', reps: '10-12', youtubeUrl: 'https://youtube.com/results?search_query=single+arm+dumbbell+press' },
                    { name: 'Deficit Dumbbell Push-ups', reps: 'Max', youtubeUrl: 'https://youtube.com/results?search_query=dumbbell+push+ups+deficit' },
                    { name: 'Incline Dumbbell Flyes', reps: '12-15', youtubeUrl: 'https://youtube.com/results?search_query=incline+dumbbell+flyes' },
                    { name: 'Squeeze Press', reps: '12-15', youtubeUrl: 'https://youtube.com/results?search_query=dumbbell+squeeze+press' },
                ],
            },
            bodyweight: {
                beginner: [
                    { name: 'Incline Push-ups', reps: '12-15', youtubeUrl: 'https://youtube.com/results?search_query=incline+push+ups' },
                    { name: 'Knee Push-ups', reps: '10-15', youtubeUrl: 'https://youtube.com/results?search_query=knee+push+ups' },
                    { name: 'Plank', reps: '30-45 sn', youtubeUrl: 'https://youtube.com/results?search_query=plank' },
                ],
                intermediate: [
                    { name: 'Push-ups', reps: '15-20', youtubeUrl: 'https://youtube.com/results?search_query=perfect+push+up' },
                    { name: 'Wide Push-ups', reps: '12-15', youtubeUrl: 'https://youtube.com/results?search_query=wide+grip+push+ups' },
                    { name: 'Diamond Push-ups', reps: '8-12', youtubeUrl: 'https://youtube.com/results?search_query=diamond+push+ups' },
                    { name: 'Decline Push-ups', reps: '10-15', youtubeUrl: 'https://youtube.com/results?search_query=decline+push+ups' },
                ],
                advanced: [
                    { name: 'Archer Push-ups', reps: '8-12', youtubeUrl: 'https://youtube.com/results?search_query=archer+push+ups' },
                    { name: 'Explosive Push-ups', reps: '10-15', youtubeUrl: 'https://youtube.com/results?search_query=explosive+push+ups' },
                    { name: 'Pseudo Planche Push-ups', reps: '8-12', youtubeUrl: 'https://youtube.com/results?search_query=pseudo+planche+push+up' },
                    { name: 'One Arm Push-up Progressions', reps: '5-8', youtubeUrl: 'https://youtube.com/results?search_query=one+arm+push+up+progression' },
                ],
            },
        },
        back: {
            gym: {
                beginner: [
                    { name: 'Lat Pulldown (Wide)', reps: '12-15', youtubeUrl: 'https://youtube.com/results?search_query=lat+pulldown+tutorial' },
                    { name: 'Seated Cable Row', reps: '12-15', youtubeUrl: 'https://youtube.com/results?search_query=seated+cable+row+tutorial' },
                    { name: 'Hyper Extensions', reps: '15-20', youtubeUrl: 'https://youtube.com/results?search_query=back+hyperextension' },
                ],
                intermediate: [
                    { name: 'Pull-ups', reps: '8-10', youtubeUrl: 'https://youtube.com/results?search_query=pull+up+tutorial' },
                    { name: 'Barbell Row', reps: '8-10', youtubeUrl: 'https://youtube.com/results?search_query=barbell+row' },
                    { name: 'Lat Pulldown', reps: '10-12', youtubeUrl: 'https://youtube.com/results?search_query=lat+pulldown' },
                    { name: 'Deadlift', reps: '5-8', youtubeUrl: 'https://youtube.com/results?search_query=deadlift+form' },
                ],
                advanced: [
                    { name: 'Weighted Pull-ups', reps: '5-8', youtubeUrl: 'https://youtube.com/results?search_query=weighted+pull+ups' },
                    { name: 'Pendlay Row', reps: '8-10', youtubeUrl: 'https://youtube.com/results?search_query=pendlay+row' },
                    { name: 'Rack Pulls', reps: '5-8', youtubeUrl: 'https://youtube.com/results?search_query=rack+pulls' },
                    { name: 'Single Arm Lat Pulldown', reps: '10-12', youtubeUrl: 'https://youtube.com/results?search_query=single+arm+lat+pulldown' },
                    { name: 'T-Bar Row', reps: '8-10', youtubeUrl: 'https://youtube.com/results?search_query=t+bar+row' },
                ],
            },
            dumbbells: {
                beginner: [
                    { name: 'Two Arm Dumbbell Row', reps: '12-15', youtubeUrl: 'https://youtube.com/results?search_query=two+arm+dumbbell+row' },
                    { name: 'Dumbbell Shrugs', reps: '15-20', youtubeUrl: 'https://youtube.com/results?search_query=dumbbell+shrugs' },
                    { name: 'Reverse Flyes (Light)', reps: '12-15', youtubeUrl: 'https://youtube.com/results?search_query=dumbbell+reverse+fly' },
                ],
                intermediate: [
                    { name: 'Single Arm Dumbbell Row', reps: '10-12', youtubeUrl: 'https://youtube.com/results?search_query=one+arm+dumbbell+row' },
                    { name: 'Dumbbell Romanian Deadlift', reps: '10-12', youtubeUrl: 'https://youtube.com/results?search_query=dumbbell+rdl+back' },
                    { name: 'Reverse Flyes', reps: '12-15', youtubeUrl: 'https://youtube.com/results?search_query=dumbbell+reverse+fly' },
                    { name: 'Renegade Row', reps: '8-10', youtubeUrl: 'https://youtube.com/results?search_query=renegade+row' },
                ],
                advanced: [
                    { name: 'Kroc Rows', reps: '15-20', youtubeUrl: 'https://youtube.com/results?search_query=kroc+row' },
                    { name: 'Batwing Rows', reps: '10-12', youtubeUrl: 'https://youtube.com/results?search_query=batwing+row' },
                    { name: 'Dumbbell Pullover (Focus Back)', reps: '12-15', youtubeUrl: 'https://youtube.com/results?search_query=dumbbell+pullover+lat+focus' },
                    { name: 'Seal Row (with Dumbbells)', reps: '10-12', youtubeUrl: 'https://youtube.com/results?search_query=dumbbell+seal+row' },
                ],
            },
            bodyweight: {
                beginner: [
                    { name: 'Bird Dog', reps: '12-15', youtubeUrl: 'https://youtube.com/results?search_query=bird+dog+exercise' },
                    { name: 'Superman', reps: '12-15', youtubeUrl: 'https://youtube.com/results?search_query=superman+exercise' },
                    { name: 'Wall Slides', reps: '15-20', youtubeUrl: 'https://youtube.com/results?search_query=wall+slides' },
                ],
                intermediate: [
                    { name: 'Inverted Row (Australian Pull-up)', reps: '10-15', youtubeUrl: 'https://youtube.com/results?search_query=australian+pull+ups' },
                    { name: 'Pull-ups', reps: 'Max', youtubeUrl: 'https://youtube.com/results?search_query=pull+ups' },
                    { name: 'Superman Hold', reps: '30-45 sn', youtubeUrl: 'https://youtube.com/results?search_query=superman+hold' },
                    { name: 'Lower Back Extensions', reps: '15-20', youtubeUrl: 'https://youtube.com/results?search_query=back+extensions' },
                ],
                advanced: [
                    { name: 'Wide Grip Pull-up', reps: 'Max', youtubeUrl: 'https://youtube.com/results?search_query=wide+grip+pull+up' },
                    { name: 'Front Lever Progressions', reps: '10-15 sn', youtubeUrl: 'https://youtube.com/results?search_query=front+lever+progression' },
                    { name: 'L-Sit Pull-up', reps: '5-8', youtubeUrl: 'https://youtube.com/results?search_query=l+sit+pull+up' },
                    { name: 'Muscle up Progressions', reps: '5-8', youtubeUrl: 'https://youtube.com/results?search_query=muscle+up+progression' },
                ],
            },
        },
        legs: {
            gym: {
                beginner: [
                    { name: 'Leg Press', reps: '12-15', youtubeUrl: 'https://youtube.com/results?search_query=leg+press+tutorial' },
                    { name: 'Leg Extension', reps: '15-20', youtubeUrl: 'https://youtube.com/results?search_query=leg+extension+tutorial' },
                    { name: 'Seated Leg Curl', reps: '15-20', youtubeUrl: 'https://youtube.com/results?search_query=seated+leg+curl' },
                ],
                intermediate: [
                    { name: 'Barbell Squat', reps: '8-10', youtubeUrl: 'https://youtube.com/results?search_query=barbell+squat' },
                    { name: 'Leg Press', reps: '10-12', youtubeUrl: 'https://youtube.com/results?search_query=leg+press' },
                    { name: 'Lying Leg Curl', reps: '12-15', youtubeUrl: 'https://youtube.com/results?search_query=lying+leg+curl' },
                    { name: 'Calf Press on Leg Press', reps: '15-20', youtubeUrl: 'https://youtube.com/results?search_query=leg+press+calf+raise' },
                ],
                advanced: [
                    { name: 'Front Squat', reps: '8-10', youtubeUrl: 'https://youtube.com/results?search_query=front+squat' },
                    { name: 'Hack Squat', reps: '10-12', youtubeUrl: 'https://youtube.com/results?search_query=hack+squat' },
                    { name: 'Bulgarian Split Squat', reps: '10-12', youtubeUrl: 'https://youtube.com/results?search_query=bulgarian+split+squat+form' },
                    { name: 'Stiff Leg Deadlift', reps: '8-10', youtubeUrl: 'https://youtube.com/results?search_query=stiff+leg+deadlift' },
                ],
            },
            dumbbells: {
                beginner: [
                    { name: 'Goblet Squat', reps: '12-15', youtubeUrl: 'https://youtube.com/results?search_query=goblet+squat' },
                    { name: 'Dumbbell Step-ups', reps: '10-12', youtubeUrl: 'https://youtube.com/results?search_query=dumbbell+step+ups' },
                    { name: 'Standing Calf Raises', reps: '15-20', youtubeUrl: 'https://youtube.com/results?search_query=standing+calf+raise' },
                ],
                intermediate: [
                    { name: 'Dumbbell Lunges', reps: '10-12', youtubeUrl: 'https://youtube.com/results?search_query=dumbbell+lunges' },
                    { name: 'Dumbbell Romanian Deadlift', reps: '10-12', youtubeUrl: 'https://youtube.com/results?search_query=dumbbell+rdl' },
                    { name: 'Goblet Squat', reps: '12-15', youtubeUrl: 'https://youtube.com/results?search_query=goblet+squat' },
                    { name: 'Dumbbell Calf Raises', reps: '15-20', youtubeUrl: 'https://youtube.com/results?search_query=dumbbell+calf+raise' },
                ],
                advanced: [
                    { name: 'Dumbbell Bulgarian Split Squat', reps: '10-12', youtubeUrl: 'https://youtube.com/results?search_query=dumbbell+bulgarian+split+squat' },
                    { name: 'Dumbbell Thrusters', reps: '10-12', youtubeUrl: 'https://youtube.com/results?search_query=dumbbell+thruster' },
                    { name: 'Single Leg RDL', reps: '10-12', youtubeUrl: 'https://youtube.com/results?search_query=single+leg+deadlift+dumbbell' },
                    { name: 'Cossack Squats (with DB)', reps: '10-12', youtubeUrl: 'https://youtube.com/results?search_query=dumbbell+cossack+squat' },
                ],
            },
            bodyweight: {
                beginner: [
                    { name: 'Air Squats', reps: '15-20', youtubeUrl: 'https://youtube.com/results?search_query=bodyweight+squat' },
                    { name: 'Glute Bridge', reps: '15-20', youtubeUrl: 'https://youtube.com/results?search_query=glute+bridge' },
                    { name: 'Wall Sit', reps: '30 sn', youtubeUrl: 'https://youtube.com/results?search_query=wall+sit' },
                ],
                intermediate: [
                    { name: 'Reverse Lunges', reps: '12-15', youtubeUrl: 'https://youtube.com/results?search_query=reverse+lunges' },
                    { name: 'Walking Lunges', reps: '20 adim', youtubeUrl: 'https://youtube.com/results?search_query=walking+lunges' },
                    { name: 'Side Lunges', reps: '12-15', youtubeUrl: 'https://youtube.com/results?search_query=side+lunges' },
                    { name: 'Calf Raises', reps: '20-25', youtubeUrl: 'https://youtube.com/results?search_query=bodyweight+calf+raise' },
                ],
                advanced: [
                    { name: 'Pistol Squat Progressions', reps: '5-8', youtubeUrl: 'https://youtube.com/results?search_query=pistol+squat+progression' },
                    { name: 'Jump Squats', reps: '15-20', youtubeUrl: 'https://youtube.com/results?search_query=jump+squat' },
                    { name: 'Nordic Curls (Bodyweight)', reps: '5-8', youtubeUrl: 'https://youtube.com/results?search_query=bodyweight+nordic+curl' },
                    { name: 'Shrimp Squats', reps: '8-10', youtubeUrl: 'https://youtube.com/results?search_query=shrimp+squat' },
                ],
            },
        },
        arms: {
            gym: {
                beginner: [
                    { name: 'Cable Bicep Curl', reps: '12-15', youtubeUrl: 'https://youtube.com/results?search_query=cable+bicep+curl' },
                    { name: 'Cable Tricep Extension', reps: '12-15', youtubeUrl: 'https://youtube.com/results?search_query=cable+tricep+extension' },
                    { name: 'Machine Bicep Curl', reps: '12-15', youtubeUrl: 'https://youtube.com/results?search_query=machine+bicep+curl' },
                ],
                intermediate: [
                    { name: 'Barbell Curl', reps: '10-12', youtubeUrl: 'https://youtube.com/results?search_query=barbell+curl' },
                    { name: 'Tricep Pushdown (Rope)', reps: '12-15', youtubeUrl: 'https://youtube.com/results?search_query=tricep+pushdown' },
                    { name: 'Skull Crushers', reps: '10-12', youtubeUrl: 'https://youtube.com/results?search_query=skull+crushers' },
                    { name: 'Preacher Curl', reps: '10-12', youtubeUrl: 'https://youtube.com/results?search_query=preacher+curl' },
                ],
                advanced: [
                    { name: 'Z-Bar Spider Curl', reps: '10-12', youtubeUrl: 'https://youtube.com/results?search_query=spider+curl' },
                    { name: 'Close Grip Bench Press', reps: '8-10', youtubeUrl: 'https://youtube.com/results?search_query=close+grip+bench+press' },
                    { name: 'Dips (Tricep Focus)', reps: 'Max', youtubeUrl: 'https://youtube.com/results?search_query=tricep+dips' },
                    { name: 'Hammer Curls (Heavy)', reps: '8-10', youtubeUrl: 'https://youtube.com/results?search_query=heavy+hammer+curl' },
                ],
            },
            dumbbells: {
                beginner: [
                    { name: 'Seated Dumbbell Curl', reps: '12-15', youtubeUrl: 'https://youtube.com/results?search_query=seated+dumbbell+curl' },
                    { name: 'Overhead DB Extension', reps: '12-15', youtubeUrl: 'https://youtube.com/results?search_query=dumbbell+overhead+tricep' },
                    { name: 'Hammer Curls', reps: '12-15', youtubeUrl: 'https://youtube.com/results?search_query=hammer+curls' },
                ],
                intermediate: [
                    { name: 'Dumbbell Bicep Curl', reps: '10-12', youtubeUrl: 'https://youtube.com/results?search_query=dumbbell+curl' },
                    { name: 'Tricep Kickbacks', reps: '12-15', youtubeUrl: 'https://youtube.com/results?search_query=tricep+kickbacks' },
                    { name: 'Incline Dumbbell Curl', reps: '10-12', youtubeUrl: 'https://youtube.com/results?search_query=incline+dumbbell+curl' },
                    { name: 'Concentration Curl', reps: '12-15', youtubeUrl: 'https://youtube.com/results?search_query=concentration+curl' },
                ],
                advanced: [
                    { name: 'Zottman Curls', reps: '10-12', youtubeUrl: 'https://youtube.com/results?search_query=zottman+curl' },
                    { name: 'Floor Dumbbell Tricep Extension', reps: '10-12', youtubeUrl: 'https://youtube.com/results?search_query=floor+dumbbell+tricep+extension' },
                    { name: '21s (Bicep Curls)', reps: '21', youtubeUrl: 'https://youtube.com/results?search_query=bicep+curls+21s' },
                    { name: 'Alternating DB Curl (Heavy)', reps: '8-10', youtubeUrl: 'https://youtube.com/results?search_query=heavy+alternating+dumbbell+curl' },
                ],
            },
            bodyweight: {
                beginner: [
                    { name: 'Bench Dips', reps: '10-12', youtubeUrl: 'https://youtube.com/results?search_query=bench+dips' },
                    { name: 'Inclined Bicep Pulls', reps: '12-15', youtubeUrl: 'https://youtube.com/results?search_query=bodyweight+bicep+curl' },
                    { name: 'Diamond Push-ups (Knee)', reps: '8-12', youtubeUrl: 'https://youtube.com/results?search_query=diamond+push+ups+knees' },
                ],
                intermediate: [
                    { name: 'Tricep Dips (Chair)', reps: '12-15', youtubeUrl: 'https://youtube.com/results?search_query=chair+dips' },
                    { name: 'Diamond Push-ups', reps: '10-12', youtubeUrl: 'https://youtube.com/results?search_query=diamond+push+ups' },
                    { name: 'Chin-ups (Bicep Focus)', reps: 'Max', youtubeUrl: 'https://youtube.com/results?search_query=chin+ups' },
                    { name: 'Pike Push-ups', reps: '8-12', youtubeUrl: 'https://youtube.com/results?search_query=pike+push+ups' },
                ],
                advanced: [
                    { name: 'Handstand Push-ups Progressions', reps: '5-8', youtubeUrl: 'https://youtube.com/results?search_query=hspu+progression' },
                    { name: 'One Arm Push-ups Progressions', reps: '5-8', youtubeUrl: 'https://youtube.com/results?search_query=one+arm+push+up+progression' },
                    { name: 'Bodyweight Skull Crushers', reps: '10-12', youtubeUrl: 'https://youtube.com/results?search_query=bodyweight+skull+crushers' },
                    { name: 'Close Grip Chin-ups', reps: 'Max', youtubeUrl: 'https://youtube.com/results?search_query=close+grip+chin+ups' },
                ],
            },
        },
        fullbody: {
            gym: {
                beginner: [
                    { name: 'Leg Press', reps: '12-15', youtubeUrl: 'https://youtube.com/results?search_query=leg+press' },
                    { name: 'Chest Press Machine', reps: '12-15', youtubeUrl: 'https://youtube.com/results?search_query=chest+press+machine' },
                    { name: 'Lat Pulldown', reps: '12-15', youtubeUrl: 'https://youtube.com/results?search_query=lat+pulldown' },
                    { name: 'Seated Cable Row', reps: '12-15', youtubeUrl: 'https://youtube.com/results?search_query=seated+cable+row' },
                ],
                intermediate: [
                    { name: 'Squat', reps: '10-12', youtubeUrl: 'https://youtube.com/results?search_query=barbell+squat' },
                    { name: 'Bench Press', reps: '10-12', youtubeUrl: 'https://youtube.com/results?search_query=bench+press' },
                    { name: 'Lat Pulldown', reps: '12-15', youtubeUrl: 'https://youtube.com/results?search_query=lat+pulldown' },
                    { name: 'Dumbbell Shoulder Press', reps: '10-12', youtubeUrl: 'https://youtube.com/results?search_query=dumbbell+shoulder+press' },
                ],
                advanced: [
                    { name: 'Deadlift', reps: '5-8', youtubeUrl: 'https://youtube.com/results?search_query=deadlift' },
                    { name: 'Barbell Row', reps: '8-10', youtubeUrl: 'https://youtube.com/results?search_query=barbell+row' },
                    { name: 'Clean and Press', reps: '8-10', youtubeUrl: 'https://youtube.com/results?search_query=clean+and+press' },
                    { name: 'Weighted Dips', reps: '8-12', youtubeUrl: 'https://youtube.com/results?search_query=weighted+dips' },
                ],
            },
            dumbbells: {
                beginner: [
                    { name: 'Goblet Squat', reps: '12-15', youtubeUrl: 'https://youtube.com/results?search_query=goblet+squat' },
                    { name: 'Dumbbell Floor Press', reps: '12-15', youtubeUrl: 'https://youtube.com/results?search_query=dumbbell+floor+press' },
                    { name: 'Two Arm DB Row', reps: '12-15', youtubeUrl: 'https://youtube.com/results?search_query=two+arm+dumbbell+row' },
                ],
                intermediate: [
                    { name: 'Dumbbell Lunges', reps: '12-15', youtubeUrl: 'https://youtube.com/results?search_query=dumbbell+lunges' },
                    { name: 'Dumbbell Bench Press', reps: '10-12', youtubeUrl: 'https://youtube.com/results?search_query=dumbbell+bench+press' },
                    { name: 'Dumbbell Thrusters', reps: '10-12', youtubeUrl: 'https://youtube.com/results?search_query=dumbbell+thruster' },
                ],
                advanced: [
                    { name: 'Dumbbell Clean and Press', reps: '10-12', youtubeUrl: 'https://youtube.com/results?search_query=dumbbell+clean+and+press' },
                    { name: 'Dumbbell Renegade Row', reps: '10-12', youtubeUrl: 'https://youtube.com/results?search_query=renegade+row+dumbbell' },
                    { name: 'Dumbbell Snatch', reps: '10-12', youtubeUrl: 'https://youtube.com/results?search_query=dumbbell+snatch' },
                ],
            },
            bodyweight: {
                beginner: [
                    { name: 'Air Squats', reps: '15-20', youtubeUrl: 'https://youtube.com/results?search_query=bodyweight+squat' },
                    { name: 'Wall Push-ups', reps: '15-20', youtubeUrl: 'https://youtube.com/results?search_query=wall+push+up' },
                    { name: 'Plank', reps: '30 sn', youtubeUrl: 'https://youtube.com/results?search_query=plank' },
                ],
                intermediate: [
                    { name: 'Push-ups', reps: '15-20', youtubeUrl: 'https://youtube.com/results?search_query=push+ups' },
                    { name: 'Lunges', reps: '20 adim', youtubeUrl: 'https://youtube.com/results?search_query=lunges' },
                    { name: 'Burpees', reps: '10-15', youtubeUrl: 'https://youtube.com/results?search_query=burpee' },
                ],
                advanced: [
                    { name: 'Muscle up Progressions', reps: '5-8', youtubeUrl: 'https://youtube.com/results?search_query=muscle+up' },
                    { name: 'Handstand Push-ups', reps: '5-10', youtubeUrl: 'https://youtube.com/results?search_query=handstand+push+up' },
                    { name: 'Pistol Squats', reps: '8-10', youtubeUrl: 'https://youtube.com/results?search_query=pistol+squats' },
                ],
            },
        },
    };

    // Seçilen egzersizleri al ve zorluk seviyesini uygula
    const rawExercises = workoutDatabase[muscleGroup]?.[equipment]?.[difficulty] ||
        workoutDatabase[muscleGroup]?.[equipment]?.['intermediate'] || [];
    const exercises: Exercise[] = rawExercises.map(ex => ({
        ...ex,
        sets: currentSettings.sets,
        rest: currentSettings.rest
    }));

    const muscleGroupNames: Record<string, string> = {
        fullbody: t.muscle,
        chest: translations[lang].selector.muscles.chest,
        legs: translations[lang].selector.muscles.legs,
        arms: translations[lang].selector.muscles.arms,
        back: translations[lang].selector.muscles.back,
    };

    const equipmentNames: Record<string, string> = {
        gym: translations[lang].selector.equipment.gym,
        dumbbells: translations[lang].selector.equipment.home,
        bodyweight: translations[lang].selector.equipment.bodyweight,
    };

    const difficultyNames: Record<string, string> = {
        beginner: translations[lang].selector.difficulty.beginner,
        intermediate: translations[lang].selector.difficulty.intermediate,
        advanced: translations[lang].selector.difficulty.advanced,
    };

    const toggleExercise = (index: number) => {
        const newCompleted = new Set(completedExercises);
        if (newCompleted.has(index)) {
            newCompleted.delete(index);
        } else {
            newCompleted.add(index);
        }
        setCompletedExercises(newCompleted);
    };

    const handleCompleteWorkout = async () => {
        try {
            if (completedExercises.size === 0) {
                alert(lang === 'tr' ? 'Lütfen en az bir egzersizi tamamlayın!' : 'Please complete at least one exercise!');
                return;
            }

            setIsSaving(true);

            // Get current user
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                alert(lang === 'tr' ? 'Lütfen önce giriş yapın!' : 'Please login first!');
                return;
            }

            // Generate detailed notes about completed exercises
            const completedList = exercises
                .filter((_, index) => completedExercises.has(index))
                .map(ex => ex.name)
                .join(', ');

            const completionRate = Math.round((completedExercises.size / exercises.length) * 100);

            // Save workout to Supabase
            const { error } = await supabase.from('workouts').insert({
                user_id: user.id,
                muscle_group: muscleGroupNames[muscleGroup],
                equipment: equipmentNames[equipment],
                duration: 45, // Varsayılan süre
                notes: `[${difficultyNames[difficulty]}] Tamamlananlar (%${completionRate}): ${completedList}`
            });

            if (error) throw error;

            setSaveSuccess(true);
            setTimeout(() => {
                onBack(); // 2 saniye sonra ana ekrana dön
            }, 2000);

        } catch (error) {
            console.error('Error saving workout:', error);
            alert(t.error);
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
                <h2 className="text-3xl font-bold gradient-text font-outfit">{lang === 'tr' ? 'Harika İş!' : 'Great Job!'}</h2>
                <p className="text-xl text-gray-300">{t.success}</p>
                <div className="text-gray-400 text-center">
                    <p>{completedExercises.size} / {exercises.length} {lang === 'tr' ? 'egzersiz tamamlandı' : 'exercises completed'}</p>
                    <div className="w-48 h-2 bg-gray-700 rounded-full mt-2 mx-auto overflow-hidden">
                        <div
                            className="h-full bg-green-500 transition-all duration-1000"
                            style={{ width: `${(completedExercises.size / exercises.length) * 100}%` }}
                        />
                    </div>
                </div>
            </div>
        );
    }

    const progressPercentage = (completedExercises.size / exercises.length) * 100;

    return (
        <div className="space-y-8">
            {/* Header with Progress Bar */}
            <div className="sticky top-20 z-40 bg-black/80 backdrop-blur-md p-4 -mx-4 mb-8 border-b border-white/10">
                <div className="flex items-center justify-between mb-2">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold gradient-text font-outfit">
                            {muscleGroupNames[muscleGroup]}
                        </h2>
                        <div className="flex items-center space-x-2 text-xs text-gray-400">
                            <span>{equipmentNames[equipment]}</span>
                            <span>•</span>
                            <span className="text-indigo-400">{difficultyNames[difficulty]} {lang === 'tr' ? 'Seviye' : 'Level'}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-2xl font-bold text-white">{completedExercises.size}</span>
                        <span className="text-gray-400">/{exercises.length}</span>
                    </div>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
                <div className="mt-2 text-right">
                    <button
                        onClick={onBack}
                        className="text-sm text-gray-400 hover:text-white transition-colors flex items-center justify-end space-x-1 ml-auto font-medium"
                    >
                        <span>← {t.goBack}</span>
                    </button>
                </div>
            </div>

            {/* Exercise List */}
            <div className="space-y-4">
                {exercises.length > 0 ? (
                    exercises.map((exercise, index) => {
                        const isCompleted = completedExercises.has(index);
                        return (
                            <div
                                key={index}
                                onClick={() => toggleExercise(index)}
                                className={`glass p-6 rounded-2xl cursor-pointer transition-all border border-transparent hover:border-indigo-500/30 ${isCompleted ? 'bg-indigo-900/20 border-indigo-500/50' : ''
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    {/* Checkbox Element */}
                                    <div className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${isCompleted
                                        ? 'bg-green-500 border-green-500'
                                        : 'border-gray-500 hover:border-white'
                                        }`}>
                                        {isCompleted && <span className="text-white text-lg">✓</span>}
                                    </div>

                                    <div className="flex-grow space-y-3">
                                        <div className="flex justify-between items-start">
                                            <h3 className={`text-xl font-bold transition-all font-outfit ${isCompleted ? 'text-gray-400 line-through' : 'text-white'
                                                }`}>
                                                {exercise.name}
                                            </h3>
                                        </div>

                                        <div className={`flex flex-wrap gap-3 text-sm transition-all ${isCompleted ? 'text-gray-500' : 'text-gray-300'
                                            }`}>
                                            <span className="bg-white/5 px-3 py-1 rounded-lg">
                                                📊 {exercise.sets} {t.sets}
                                            </span>
                                            <span className="bg-white/5 px-3 py-1 rounded-lg">
                                                🔢 {exercise.reps} {t.reps}
                                            </span>
                                            <span className="bg-white/5 px-3 py-1 rounded-lg">
                                                ⏱️ {exercise.rest} {t.rest}
                                            </span>
                                        </div>

                                        <div className="pt-2" onClick={(e) => e.stopPropagation()}>
                                            <a
                                                href={exercise.youtubeUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center space-x-2 text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                                            >
                                                <span className="w-6 h-6 flex items-center justify-center bg-red-600/20 rounded-full">▶️</span>
                                                <span>{lang === 'tr' ? 'Nasıl yapılır? (Video)' : 'How to do? (Video)'}</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-12 glass rounded-2xl">
                        <p className="text-gray-400">{t.noExercises}</p>
                        <button onClick={onBack} className="mt-4 text-indigo-400 hover:text-white font-medium">{t.goBack}</button>
                    </div>
                )}
            </div>

            {/* Complete Workout Button */}
            <div className="sticky bottom-6 z-40 flex justify-center pt-4">
                <button
                    onClick={handleCompleteWorkout}
                    disabled={isSaving || completedExercises.size === 0}
                    className="w-full max-w-md px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl text-white text-lg font-bold shadow-2xl hover:scale-105 hover:shadow-green-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3 glass border-t border-white/20"
                >
                    {isSaving ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>{t.saving}</span>
                        </>
                    ) : (
                        <>
                            <span>✅</span>
                            <span>
                                {completedExercises.size === exercises.length
                                    ? (lang === 'tr' ? 'Antrenmanı Bitir' : 'Finish Workout')
                                    : `${completedExercises.size} / ${exercises.length} ${lang === 'tr' ? 'Tamamla ve Kaydet' : 'Complete & Save'}`}
                            </span>
                        </>
                    )}
                </button>
            </div>

            {/* Tips Section - Collapsible or simpler */}
            <div className="text-center text-sm text-gray-500 pb-8">
                <p>💡 {lang === 'tr' ? 'İpucu: Harekete tıklayarak tamamlandı olarak işaretleyebilirsiniz.' : 'Tip: Click on the exercise to mark it as completed.'}</p>
            </div>
        </div>
    );
}
