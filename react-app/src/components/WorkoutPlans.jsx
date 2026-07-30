import React, { useEffect, useMemo, useState } from 'react';

const DEFAULT_WORKOUT_PLANS = {
    'weight-loss': [
        {
            id: 'default-wl',
            name: 'Weight Loss Plan',
            description: 'High-intensity cardio plus strength work to support fat loss.',
            days: [
                {
                    day: 'Monday',
                    focus: 'Full Body Cardio',
                    exercises: [
                        { name: 'Jumping Jacks', sets: '3', reps: '40', duration: '' },
                        { name: 'Burpees', sets: '3', reps: '15', duration: '' },
                        { name: 'Jump Rope', sets: '', reps: '', duration: '10 min' }
                    ]
                },
                {
                    day: 'Wednesday',
                    focus: 'Strength + Cardio',
                    exercises: [
                        { name: 'Squats', sets: '4', reps: '20', duration: '' },
                        { name: 'Push-ups', sets: '3', reps: '15', duration: '' },
                        { name: 'Treadmill Run', sets: '', reps: '', duration: '20 min' }
                    ]
                },
                {
                    day: 'Friday',
                    focus: 'HIIT',
                    exercises: [
                        { name: 'Sprint Intervals', sets: '8', reps: '', duration: '30 sec on / 30 sec off' },
                        { name: 'Kettlebell Swings', sets: '4', reps: '15', duration: '' },
                        { name: 'Battle Ropes', sets: '3', reps: '', duration: '30 sec' }
                    ]
                }
            ]
        }
    ],
    'muscle-gain': [
        {
            id: 'default-mg',
            name: 'Muscle Gain Plan',
            description: 'Progressive overload programming for lean muscle growth.',
            days: [
                {
                    day: 'Monday',
                    focus: 'Chest & Triceps',
                    exercises: [
                        { name: 'Bench Press', sets: '4', reps: '8-10', duration: '' },
                        { name: 'Incline Dumbbell Press', sets: '3', reps: '10-12', duration: '' }
                    ]
                },
                {
                    day: 'Wednesday',
                    focus: 'Back & Biceps',
                    exercises: [
                        { name: 'Deadlifts', sets: '4', reps: '5-6', duration: '' },
                        { name: 'Pull-ups', sets: '4', reps: '8-10', duration: '' }
                    ]
                },
                {
                    day: 'Friday',
                    focus: 'Legs & Shoulders',
                    exercises: [
                        { name: 'Squats', sets: '4', reps: '8-10', duration: '' },
                        { name: 'Shoulder Press', sets: '3', reps: '10', duration: '' }
                    ]
                }
            ]
        }
    ],
    endurance: [
        {
            id: 'default-endurance',
            name: 'Endurance Plan',
            description: 'Structured conditioning sessions to improve stamina.',
            days: [
                {
                    day: 'Monday',
                    focus: 'Long Run',
                    exercises: [{ name: 'Steady State Run', sets: '', reps: '', duration: '30-45 min' }]
                },
                {
                    day: 'Wednesday',
                    focus: 'Cross Training',
                    exercises: [
                        { name: 'Cycling', sets: '', reps: '', duration: '30 min' },
                        { name: 'Swimming', sets: '', reps: '', duration: '20 min' }
                    ]
                },
                {
                    day: 'Friday',
                    focus: 'Intervals',
                    exercises: [{ name: 'Fast Intervals', sets: '6', reps: '', duration: '2 min fast / 1 min slow' }]
                }
            ]
        }
    ]
};

function readWorkoutPlans() {
    try {
        const raw = localStorage.getItem('workoutPlans');
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function normalizeCustomPlan(plan) {
    const schedule = Array.isArray(plan.schedule) ? plan.schedule : [];
    const days = schedule.map((item, index) => ({
        day: item.day || `Day ${index + 1}`,
        focus: item.intensity || 'Planned Session',
        exercises: [
            {
                name: item.exercise || 'Workout Session',
                sets: '',
                reps: '',
                duration: item.duration || ''
            }
        ]
    }));

    return {
        id: plan.id || `custom-${Date.now()}`,
        name: plan.name || 'Custom Workout Plan',
        description: plan.description || 'Custom workout plan created by admin.',
        days: days.length > 0 ? days : [{
            day: 'Schedule',
            focus: plan.intensity || 'Planned Session',
            exercises: [{ name: 'Plan details added by admin', sets: '', reps: '', duration: plan.duration || '' }]
        }]
    };
}

function WorkoutPlans() {
    const [customPlans, setCustomPlans] = useState(() => readWorkoutPlans());
    const goalOptions = useMemo(() => {
        const set = new Set(Object.keys(DEFAULT_WORKOUT_PLANS));
        customPlans.forEach((plan) => {
            if (plan.goal) {
                set.add(plan.goal);
            }
        });
        return Array.from(set);
    }, [customPlans]);

    const [selectedGoal, setSelectedGoal] = useState('weight-loss');
    const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);

    useEffect(() => {
        function handleStorage(event) {
            if (!event.key || event.key === 'workoutPlans') {
                setCustomPlans(readWorkoutPlans());
            }
        }

        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    useEffect(() => {
        if (!goalOptions.includes(selectedGoal)) {
            setSelectedGoal(goalOptions[0] || 'weight-loss');
            setSelectedPlanIndex(0);
        }
    }, [goalOptions, selectedGoal]);

    const plansForGoal = useMemo(() => {
        const defaults = DEFAULT_WORKOUT_PLANS[selectedGoal] || [];
        const customs = customPlans
            .filter((plan) => plan.goal === selectedGoal)
            .map(normalizeCustomPlan);
        return [...defaults, ...customs];
    }, [selectedGoal, customPlans]);

    useEffect(() => {
        setSelectedPlanIndex(0);
    }, [selectedGoal, plansForGoal.length]);

    const plan = plansForGoal[selectedPlanIndex];

    return (
        <div className="workout-container">
            <div className="page-header">
                <h1>Workout Plans</h1>
                <p>Choose your goal and follow your training schedule.</p>
            </div>

            <div className="goal-selector">
                <label htmlFor="goalSelect">Select Your Fitness Goal:</label>
                <select
                    id="goalSelect"
                    value={selectedGoal}
                    onChange={(event) => setSelectedGoal(event.target.value)}
                >
                    {goalOptions.map((goal) => (
                        <option value={goal} key={goal}>{goal}</option>
                    ))}
                </select>
            </div>

            {plansForGoal.length > 1 ? (
                <div className="goal-selector">
                    <label htmlFor="planSelect">Select Plan:</label>
                    <select
                        id="planSelect"
                        value={selectedPlanIndex}
                        onChange={(event) => setSelectedPlanIndex(Number(event.target.value))}
                    >
                        {plansForGoal.map((item, index) => (
                            <option value={index} key={item.id || `${item.name}-${index}`}>{item.name}</option>
                        ))}
                    </select>
                </div>
            ) : null}

            {plan ? (
                <>
                    <div className="plan-header card">
                        <h2>{plan.name}</h2>
                        <p>{plan.description}</p>
                    </div>

                    <div className="workout-days">
                        {plan.days.map((dayPlan, dayIndex) => (
                            <div key={`${dayPlan.day}-${dayIndex}`} className="day-card card">
                                <div className="day-header">
                                    <h3>{dayPlan.day}</h3>
                                    <span className="focus-badge">{dayPlan.focus}</span>
                                </div>
                                <table className="exercise-table">
                                    <thead>
                                        <tr>
                                            <th>Exercise</th>
                                            <th>Sets</th>
                                            <th>Reps</th>
                                            <th>Duration</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dayPlan.exercises.map((ex, exIndex) => (
                                            <tr key={`${ex.name}-${exIndex}`}>
                                                <td>{ex.name}</td>
                                                <td>{ex.sets || '-'}</td>
                                                <td>{ex.reps || '-'}</td>
                                                <td>{ex.duration || '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <p className="no-data">No plans found for this goal.</p>
            )}
        </div>
    );
}

export default WorkoutPlans;
