import React, { useEffect, useMemo, useState } from 'react';

const DEFAULT_DIET_PLANS = {
    'weight-loss': [
        {
            id: 'default-diet-wl',
            name: 'Weight Loss Nutrition',
            calories: '1800 kcal/day',
            macros: { protein: '150g', carbs: '180g', fats: '60g' },
            meals: [
                { name: 'Breakfast', menu: 'Oats, berries, almonds' },
                { name: 'Lunch', menu: 'Grilled chicken, brown rice, greens' },
                { name: 'Snack', menu: 'Greek yogurt, fruit' },
                { name: 'Dinner', menu: 'Salmon, sweet potato, spinach' }
            ]
        }
    ],
    'muscle-gain': [
        {
            id: 'default-diet-mg',
            name: 'Muscle Gain Nutrition',
            calories: '2800 kcal/day',
            macros: { protein: '200g', carbs: '350g', fats: '90g' },
            meals: [
                { name: 'Breakfast', menu: 'Eggs, oats, banana' },
                { name: 'Lunch', menu: 'Lean beef, rice, vegetables' },
                { name: 'Pre-workout', menu: 'Banana, granola bar' },
                { name: 'Dinner', menu: 'Chicken, potato, broccoli' }
            ]
        }
    ],
    endurance: [
        {
            id: 'default-diet-endurance',
            name: 'Endurance Fuel Plan',
            calories: '2400 kcal/day',
            macros: { protein: '120g', carbs: '360g', fats: '60g' },
            meals: [
                { name: 'Breakfast', menu: 'Whole grain cereal, milk, fruit' },
                { name: 'Lunch', menu: 'Pasta, lean protein, vegetables' },
                { name: 'Pre-run', menu: 'Energy bar, banana' },
                { name: 'Dinner', menu: 'Fish, rice, roasted vegetables' }
            ]
        }
    ]
};

function readDietPlans() {
    try {
        const raw = localStorage.getItem('dietPlans');
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function normalizeCustomDiet(plan) {
    const macros = plan.macros || {};
    const meals = Array.isArray(plan.meals) ? plan.meals : [];

    return {
        id: plan.id || `custom-diet-${Date.now()}`,
        name: plan.name || 'Custom Diet Plan',
        calories: plan.calories || 'Not specified',
        macros: {
            protein: macros.protein || '-',
            carbs: macros.carbs || '-',
            fats: macros.fats || '-'
        },
        meals: meals.length > 0
            ? meals.map((meal, index) => ({
                name: meal.type || `Meal ${index + 1}`,
                menu: Array.isArray(meal.items) ? meal.items.join(', ') : (meal.items || 'No meal details')
            }))
            : [{ name: 'Plan', menu: plan.description || 'No meal details provided.' }]
    };
}

function DietPlans() {
    const [customPlans, setCustomPlans] = useState(() => readDietPlans());
    const goalOptions = useMemo(() => {
        const set = new Set(Object.keys(DEFAULT_DIET_PLANS));
        customPlans.forEach((plan) => {
            if (plan.goal) {
                set.add(plan.goal);
            }
        });
        return Array.from(set);
    }, [customPlans]);

    const [goal, setGoal] = useState('weight-loss');
    const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);

    useEffect(() => {
        function handleStorage(event) {
            if (!event.key || event.key === 'dietPlans') {
                setCustomPlans(readDietPlans());
            }
        }

        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    useEffect(() => {
        if (!goalOptions.includes(goal)) {
            setGoal(goalOptions[0] || 'weight-loss');
            setSelectedPlanIndex(0);
        }
    }, [goalOptions, goal]);

    const plansForGoal = useMemo(() => {
        const defaults = DEFAULT_DIET_PLANS[goal] || [];
        const customs = customPlans
            .filter((plan) => plan.goal === goal)
            .map(normalizeCustomDiet);
        return [...defaults, ...customs];
    }, [goal, customPlans]);

    useEffect(() => {
        setSelectedPlanIndex(0);
    }, [goal, plansForGoal.length]);

    const plan = plansForGoal[selectedPlanIndex];

    return (
        <section className="diet-container">
            <div className="page-header">
                <h1>Diet Plans</h1>
                <p>Pick a goal and follow a focused meal structure.</p>
            </div>

            <div className="goal-selector">
                <label htmlFor="dietGoalSelect">Goal</label>
                <select
                    id="dietGoalSelect"
                    value={goal}
                    onChange={(event) => setGoal(event.target.value)}
                >
                    {goalOptions.map((goalOption) => (
                        <option value={goalOption} key={goalOption}>{goalOption}</option>
                    ))}
                </select>
            </div>

            {plansForGoal.length > 1 ? (
                <div className="goal-selector">
                    <label htmlFor="dietPlanSelect">Select Plan</label>
                    <select
                        id="dietPlanSelect"
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
                    <div className="card diet-summary">
                        <h2>{plan.name}</h2>
                        <p className="diet-calories">{plan.calories}</p>
                        <div className="diet-macros">
                            <span className="macro-pill">Protein {plan.macros.protein}</span>
                            <span className="macro-pill">Carbs {plan.macros.carbs}</span>
                            <span className="macro-pill">Fats {plan.macros.fats}</span>
                        </div>
                    </div>

                    <div className="grid grid-2">
                        {plan.meals.map((meal, index) => (
                            <article className="card meal-block" key={`${meal.name}-${index}`}>
                                <h3>{meal.name}</h3>
                                <p>{meal.menu}</p>
                            </article>
                        ))}
                    </div>
                </>
            ) : (
                <p className="no-data">No diet plans found for this goal.</p>
            )}
        </section>
    );
}

export default DietPlans;
