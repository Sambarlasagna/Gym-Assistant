// Check if current user is admin
function isAdminUser() {
    const role = localStorage.getItem('currentRole');
    return role === 'admin';
}

const DIET_PLANS = {
    'weight-loss': [
        {
            id: 'wl-d1',
            name: 'Standard Weight Loss Diet',
            calories: '1800 kcal/day',
            description: 'Balanced deficit diet to support healthy weight loss',
            macros: { protein: '150g', carbs: '180g', fats: '60g' },
            meals: [
                {
                    type: 'Breakfast',
                    time: '7:00 AM',
                    items: ['Oatmeal with berries and almond milk', 'Green tea', 'Whole wheat toast'],
                    calories: 350
                },
                {
                    type: 'Mid-Morning Snack',
                    time: '10:00 AM',
                    items: ['Greek yogurt', 'Mixed nuts (handful)'],
                    calories: 150
                },
                {
                    type: 'Lunch',
                    time: '1:00 PM',
                    items: ['Grilled chicken breast (150g)', 'Brown rice (1 cup)', 'Steamed broccoli', 'Olive oil dressing'],
                    calories: 500
                },
                {
                    type: 'Afternoon Snack',
                    time: '4:00 PM',
                    items: ['Apple', 'Protein shake', 'Almonds (10-12)'],
                    calories: 200
                },
                {
                    type: 'Dinner',
                    time: '7:00 PM',
                    items: ['Baked salmon (150g)', 'Sweet potato', 'Spinach salad', 'Lemon juice'],
                    calories: 500
                }
            ]
        }
    ],
    'muscle-gain': [
        {
            id: 'mg-d1',
            name: 'Bulking Diet',
            calories: '2800 kcal/day',
            description: 'High calorie, protein-rich diet to support muscle growth',
            macros: { protein: '200g', carbs: '350g', fats: '93g' },
            meals: [
                {
                    type: 'Breakfast',
                    time: '7:00 AM',
                    items: ['5 Egg whites + 2 whole eggs', 'Oatmeal (1.5 cups)', 'Banana', 'Whole milk'],
                    calories: 600
                },
                {
                    type: 'Mid-Morning Snack',
                    time: '10:00 AM',
                    items: ['Protein shake with whey', 'Rice cakes with peanut butter'],
                    calories: 400
                },
                {
                    type: 'Lunch',
                    time: '1:00 PM',
                    items: ['Lean beef (200g)', 'White rice (2 cups)', 'Mixed vegetables', 'Olive oil'],
                    calories: 700
                },
                {
                    type: 'Pre-Workout Snack',
                    time: '4:00 PM',
                    items: ['Banana', 'Energy bar', 'Black coffee'],
                    calories: 300
                },
                {
                    type: 'Dinner',
                    time: '7:00 PM',
                    items: ['Grilled chicken (200g)', 'Sweet potato (large)', 'Broccoli', 'Olive oil'],
                    calories: 600
                },
                {
                    type: 'Evening Snack',
                    time: '10:00 PM',
                    items: ['Casein protein shake', 'Almonds'],
                    calories: 200
                }
            ]
        }
    ],
    'endurance': [
        {
            id: 'en-d1',
            name: 'Endurance Fuel',
            calories: '2400 kcal/day',
            description: 'Carb-focused diet for sustaining long duration activities',
            macros: { protein: '120g', carbs: '360g', fats: '60g' },
            meals: [
                {
                    type: 'Breakfast',
                    time: '7:00 AM',
                    items: ['Whole grain cereal', 'Skim milk', 'Banana', 'Whole wheat toast with honey'],
                    calories: 450
                },
                {
                    type: 'Mid-Morning Snack',
                    time: '10:00 AM',
                    items: ['Energy bar', 'Orange juice'],
                    calories: 250
                },
                {
                    type: 'Lunch',
                    time: '1:00 PM',
                    items: ['Pasta with lean meat sauce', 'Steamed vegetables', 'Whole wheat bread'],
                    calories: 600
                },
                {
                    type: 'Pre-Run Snack',
                    time: '4:00 PM',
                    items: ['Banana', 'Granola bar', 'Water'],
                    calories: 300
                },
                {
                    type: 'Dinner',
                    time: '7:00 PM',
                    items: ['Fish (150g)', 'Rice pilaf', 'Roasted vegetables', 'Olive oil'],
                    calories: 550
                },
                {
                    type: 'Evening Snack',
                    time: '9:00 PM',
                    items: ['Yogurt', 'Granola', 'Berries'],
                    calories: 250
                }
            ]
        }
    ]
};

function initDietManagementPage(container) {
    const dietForm = container.querySelector('#dietForm');
    if (dietForm) {
        dietForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
            const meals = mealTypes.map(type => {
                const itemsStr = document.getElementById(`meal${type}Items`).value;
                const items = itemsStr.split(',').map(i => i.trim()).filter(i => i);
                return {
                    type: type,
                    time: document.getElementById(`meal${type}Time`).value,
                    items: items,
                    calories: document.getElementById(`meal${type}Calories`).value
                };
            });

            const macros = {
                protein: document.getElementById('macroProtein').value,
                carbs: document.getElementById('macroCarbs').value,
                fats: document.getElementById('macroFats').value
            };

            let dietList = JSON.parse(localStorage.getItem('dietPlans')) || [];
            const newPlan = {
                id: 'custom-diet-' + Date.now(),
                name: document.getElementById('dietName').value,
                goal: document.getElementById('dietGoal').value,
                calories: document.getElementById('dietCalories').value,
                description: document.getElementById('dietDescription').value,
                macros: macros,
                meals: meals
            };

            dietList.push(newPlan);
            localStorage.setItem('dietPlans', JSON.stringify(dietList));

            if (window.location.pathname.includes('manage-diet.html')) {
                window.location.reload();
            } else {
                window.dispatchEvent(new CustomEvent('navigate', { detail: 'manage-diet' }));
            }
        });
    }

    const plansListContainer = container.querySelector('#dietPlansList');
    if (plansListContainer) {
        let customDietList = JSON.parse(localStorage.getItem('dietPlans')) || [];
        // Combine default and custom plans
        let allPlans = [];
        for (const goal in DIET_PLANS) {
            allPlans = allPlans.concat(DIET_PLANS[goal]);
        }
        allPlans = allPlans.concat(customDietList);

        if (allPlans.length === 0) {
            plansListContainer.innerHTML = '<p class="no-data">No diet plans available.</p>';
        } else {
            plansListContainer.innerHTML = '';
            allPlans.forEach((plan, index) => {
                const isCustom = customDietList.some(p => p.id === plan.id);
                const customIndex = customDietList.findIndex(p => p.id === plan.id);
                const planCard = document.createElement('div');
                planCard.className = 'plan-item card';
                planCard.innerHTML = `
                    <h3>${plan.name}${isCustom ? ' (Custom)' : ''}</h3>
                    <p><strong>Goal:</strong> ${plan.goal}</p>
                    <p><strong>Calories:</strong> ${plan.calories}</p>
                    <p>${plan.description}</p>
                    ${isCustom ? `<div style="display: flex; gap: 0.5rem;"><button class="btn btn-secondary" onclick="editDietPlan('${plan.id}')">Edit</button><button class="btn btn-danger" onclick="deleteDietPlan(${customIndex})">Delete</button></div>` : '<p><em>Default plan</em></p>'}
                `;
                plansListContainer.appendChild(planCard);
            });
        }
    }
}

function createDietManagementPage() {
    // Check if user is admin
    if (!isAdminUser()) {
        const container = document.createElement('div');
        container.className = 'diet-management-container';
        container.innerHTML = `
            <div class="page-header">
                <h1>Manage Diet Plans</h1>
            </div>
            <div style="padding: 2rem; text-align: center;">
                <p style="color: red; font-weight: bold;">Access Denied: You must be logged in as an admin to manage diet plans.</p>
            </div>
        `;
        return container;
    }

    const container = document.createElement('div');
    container.className = 'diet-management-container';

    const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

    container.innerHTML = `
        <div class="page-header">
            <h1>Manage Diet Plans</h1>
        </div>

        <div class="management-section">
            <h2>Create New Diet Plan</h2>
            <form id="dietForm" class="management-form">
                <div class="grid grid-2">
                    <div class="form-group">
                        <label for="dietName">Plan Name:</label>
                        <input type="text" id="dietName" name="dietName" placeholder="e.g. Keto Starter" required>
                    </div>

                    <div class="form-group">
                        <label for="dietGoal">Fitness Goal:</label>
                        <select id="dietGoal" name="dietGoal" required>
                            <option value="weight-loss">Weight Loss</option>
                            <option value="muscle-gain">Muscle Gain</option>
                            <option value="endurance">Endurance</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>

                <div class="grid grid-2">
                    <div class="form-group">
                        <label for="dietCalories">Total Daily Calories:</label>
                        <input type="text" id="dietCalories" name="dietCalories" placeholder="e.g., 1800 kcal" required>
                    </div>
                     <div class="form-group">
                        <label>Target Macros (P/C/F):</label>
                        <div style="display: flex; gap: 0.5rem;">
                            <input type="text" id="macroProtein" placeholder="Prot (g)" required>
                            <input type="text" id="macroCarbs" placeholder="Carb (g)" required>
                            <input type="text" id="macroFats" placeholder="Fat (g)" required>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label for="dietDescription">Description:</label>
                    <textarea id="dietDescription" name="dietDescription" rows="3" required></textarea>
                </div>

                <h3>Daily Meal Structure</h3>
                <div class="meals-inputs">
                    ${mealTypes.map(type => `
                        <div class="meal-input-group card" style="padding: 1rem; margin-bottom: 1rem;">
                            <h4>${type}</h4>
                            <div class="grid grid-3">
                                <div class="form-group">
                                    <label>Approx Time</label>
                                    <input type="text" id="meal${type}Time" placeholder="e.g. 8:00 AM">
                                </div>
                                <div class="form-group">
                                    <label>Calories</label>
                                    <input type="text" id="meal${type}Calories" placeholder="e.g. 400">
                                </div>
                                <div class="form-group">
                                    <label>Food Items (comma separated)</label>
                                    <input type="text" id="meal${type}Items" placeholder="Eggs, Toast, Coffee">
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <button type="submit" class="btn btn-primary btn-lg" style="margin-top: 1rem;">Create Diet Plan</button>
            </form>
        </div>

        <div class="plans-list">
            <h2>Current Diet Plans</h2>
            <div id="dietPlansList"></div>
        </div>
    `;

    setTimeout(() => initDietManagementPage(container), 0);

    return container;
}


function editDietPlan(planId) {
    if (!isAdminUser()) {
        alert('You must be logged in as an admin to edit diet plans.');
        return;
    }

    let dietList = JSON.parse(localStorage.getItem('dietPlans')) || [];
    const plan = dietList.find(p => p.id === planId);

    if (!plan) return;

    const newName = prompt('Enter new plan name:', plan.name);
    if (newName === null) return;

    const newCalories = prompt('Enter new calories:', plan.calories);
    if (newCalories === null) return;

    const newDescription = prompt('Enter new description:', plan.description);
    if (newDescription === null) return;

    plan.name = newName;
    plan.calories = newCalories;
    plan.description = newDescription;

    localStorage.setItem('dietPlans', JSON.stringify(dietList));
    window.dispatchEvent(new CustomEvent('navigate', { detail: 'manage-diet' }));
}

function deleteDietPlan(index) {
    if (!isAdminUser()) {
        alert('You must be logged in as an admin to delete diet plans.');
        return;
    }

    if (!confirm('Are you sure you want to delete this plan?')) return;

    let dietList = JSON.parse(localStorage.getItem('dietPlans')) || [];
    dietList.splice(index, 1);
    localStorage.setItem('dietPlans', JSON.stringify(dietList));

    window.dispatchEvent(new CustomEvent('navigate', { detail: 'manage-diet' }));
}
