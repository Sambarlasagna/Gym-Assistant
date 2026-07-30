
// Check if current user is admin
function isAdminUser() {
    const role = localStorage.getItem('currentRole');
    return role === 'admin';
}

const WORKOUT_PLANS = {
    'weight-loss': [
        {
            id: 'wl-1',
            name: 'Standard Weight Loss',
            duration: '12 weeks',
            intensity: 'High',
            description: 'High-intensity cardio and strength training for rapid fat loss',
            schedule: [
                { day: 'Monday', exercise: 'Cardio + Core', duration: '60 mins', intensity: 'High' },
                { day: 'Tuesday', exercise: 'Full Body Strength', duration: '50 mins', intensity: 'High' },
                { day: 'Wednesday', exercise: 'HIIT Training', duration: '40 mins', intensity: 'Very High' },
                { day: 'Thursday', exercise: 'Cardio + Abs', duration: '60 mins', intensity: 'High' },
                { day: 'Friday', exercise: 'Full Body Strength', duration: '50 mins', intensity: 'High' },
                { day: 'Saturday', exercise: 'Outdoor Running', duration: '45 mins', intensity: 'Medium' },
                { day: 'Sunday', exercise: 'Rest / Recovery', duration: 'Self-paced', intensity: 'Low' }
            ]
        }
    ],
    'muscle-gain': [
        {
            id: 'mg-1',
            name: 'Classic Muscle Building',
            duration: '16 weeks',
            intensity: 'Medium-High',
            description: 'Progressive strength training focused on hypertrophy and muscle growth',
            schedule: [
                { day: 'Monday', exercise: 'Chest & Triceps', duration: '60 mins', intensity: 'High' },
                { day: 'Tuesday', exercise: 'Back & Biceps', duration: '60 mins', intensity: 'High' },
                { day: 'Wednesday', exercise: 'Legs & Core', duration: '70 mins', intensity: 'Very High' },
                { day: 'Thursday', exercise: 'Shoulders & Arms', duration: '50 mins', intensity: 'High' },
                { day: 'Friday', exercise: 'Full Body Compound', duration: '60 mins', intensity: 'High' },
                { day: 'Saturday', exercise: 'Accessory Work', duration: '45 mins', intensity: 'Medium' },
                { day: 'Sunday', exercise: 'Complete Rest', duration: 'Rest day', intensity: 'Rest' }
            ]
        }
    ],
    'endurance': [
        {
            id: 'en-1',
            name: 'Marathon Prep',
            duration: '10 weeks',
            intensity: 'Medium',
            description: 'Build cardiovascular fitness and stamina for long-distance activities',
            schedule: [
                { day: 'Monday', exercise: 'Steady State Cardio', duration: '45 mins', intensity: 'Medium' },
                { day: 'Tuesday', exercise: 'Speed Work / Intervals', duration: '40 mins', intensity: 'High' },
                { day: 'Wednesday', exercise: 'Strength Training', duration: '45 mins', intensity: 'Medium' },
                { day: 'Thursday', exercise: 'Long Duration Cardio', duration: '60+ mins', intensity: 'Low-Medium' },
                { day: 'Friday', exercise: 'Cross Training', duration: '45 mins', intensity: 'Medium' },
                { day: 'Saturday', exercise: 'Active Recovery', duration: '30 mins', intensity: 'Low' },
                { day: 'Sunday', exercise: 'Rest Day', duration: 'Rest', intensity: 'Rest' }
            ]
        }
    ]
};

function initWorkoutManagementPage(container) {
    const workoutForm = container.querySelector('#workoutForm');
    if (workoutForm) {
        workoutForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            const schedule = days.map(day => ({
                day: day,
                exercise: document.getElementById(`schedule${day}Exercise`).value,
                duration: document.getElementById(`schedule${day}Duration`).value,
                intensity: document.getElementById(`schedule${day}Intensity`).value
            }));

            let workoutList = JSON.parse(localStorage.getItem('workoutPlans')) || [];
            const newPlan = {
                id: 'custom-' + Date.now(),
                name: document.getElementById('planName').value,
                goal: document.getElementById('planGoal').value,
                duration: document.getElementById('planDuration').value,
                intensity: document.getElementById('planIntensity').value,
                description: document.getElementById('planDescription').value,
                schedule: schedule
            };

            workoutList.push(newPlan);
            localStorage.setItem('workoutPlans', JSON.stringify(workoutList));

            if (window.location.pathname.includes('manage-workouts.html')) {
                window.location.reload();
            } else {
                window.dispatchEvent(new CustomEvent('navigate', { detail: 'manage-workouts' }));
            }
        });
    }

    const plansListContainer = container.querySelector('#plansList');
    if (plansListContainer) {
        let customWorkoutList = JSON.parse(localStorage.getItem('workoutPlans')) || [];
        // Combine default and custom plans
        let allPlans = [];
        for (const goal in WORKOUT_PLANS) {
            allPlans = allPlans.concat(WORKOUT_PLANS[goal]);
        }
        allPlans = allPlans.concat(customWorkoutList);

        if (allPlans.length === 0) {
            plansListContainer.innerHTML = '<p class="no-data">No workout plans available.</p>';
        } else {
            plansListContainer.innerHTML = '';
            allPlans.forEach((plan, index) => {
                const isCustom = customWorkoutList.some(p => p.id === plan.id);
                const customIndex = customWorkoutList.findIndex(p => p.id === plan.id);
                const planCard = document.createElement('div');
                planCard.className = 'plan-item card';
                planCard.innerHTML = `
                    <h3>${plan.name}${isCustom ? ' (Custom)' : ''}</h3>
                    <p><strong>Goal:</strong> ${plan.goal}</p>
                    <p><strong>Duration:</strong> ${plan.duration}</p>
                    <p>${plan.description}</p>
                    ${isCustom ? `<div style="display: flex; gap: 0.5rem;"><button class="btn btn-secondary" onclick="editWorkoutPlan('${plan.id}')">Edit</button><button class="btn btn-danger" onclick="deleteWorkoutPlan(${customIndex})">Delete</button></div>` : '<p><em>Default plan</em></p>'}
                `;
                plansListContainer.appendChild(planCard);
            });
        }
    }
}

function createWorkoutManagementPage() {
    // Check if user is admin
    if (!isAdminUser()) {
        const container = document.createElement('div');
        container.className = 'workout-management-container';
        container.innerHTML = `
            <div class="page-header">
                <h1>Manage Workout Plans</h1>
            </div>
            <div style="padding: 2rem; text-align: center;">
                <p style="color: red; font-weight: bold;">Access Denied: You must be logged in as an admin to manage workout plans.</p>
            </div>
        `;
        return container;
    }

    const container = document.createElement('div');
    container.className = 'workout-management-container';

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    container.innerHTML = `
        <div class="page-header">
            <h1>Manage Workout Plans</h1>
        </div>

        <div class="management-section">
            <h2>Create New Program</h2>
            <form id="workoutForm" class="management-form">
                <div class="grid grid-2">
                    <div class="form-group">
                        <label for="planName">Program Name:</label>
                        <input type="text" id="planName" name="planName" placeholder="e.g. Advanced Shred" required>
                    </div>

                    <div class="form-group">
                        <label for="planGoal">Fitness Goal (Category):</label>
                        <select id="planGoal" name="planGoal" required>
                            <option value="weight-loss">Weight Loss</option>
                            <option value="muscle-gain">Muscle Gain</option>
                            <option value="endurance">Endurance</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>

                <div class="grid grid-2">
                    <div class="form-group">
                        <label for="planDuration">Duration:</label>
                        <input type="text" id="planDuration" name="planDuration" placeholder="e.g., 12 weeks" required>
                    </div>
                     <div class="form-group">
                        <label for="planIntensity">Overall Intensity:</label>
                        <select id="planIntensity" name="planIntensity" required>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Very High">Very High</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label for="planDescription">Program Description:</label>
                    <textarea id="planDescription" name="planDescription" rows="3" required></textarea>
                </div>

                <h3>Daily Schedule</h3>
                <div class="schedule-inputs">
                    ${days.map(day => `
                        <div class="day-input-group card" style="padding: 1rem; margin-bottom: 1rem;">
                            <h4>${day}</h4>
                            <div class="grid grid-3">
                                <div class="form-group">
                                    <label>Exercise Focus</label>
                                    <input type="text" id="schedule${day}Exercise" placeholder="e.g. Cardio" required>
                                </div>
                                <div class="form-group">
                                    <label>Duration</label>
                                    <input type="text" id="schedule${day}Duration" placeholder="e.g. 45 mins" required>
                                </div>
                                <div class="form-group">
                                    <label>Intensity</label>
                                    <select id="schedule${day}Intensity">
                                        <option value="Low">Low</option>
                                        <option value="Medium" selected>Medium</option>
                                        <option value="High">High</option>
                                        <option value="Rest">Rest</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <button type="submit" class="btn btn-primary btn-lg" style="margin-top: 1rem;">Create Program</button>
            </form>
        </div>

        <div class="plans-list">
            <h2>Current Workout Plans</h2>
            <div id="plansList"></div>
        </div>
    `;

    setTimeout(() => initWorkoutManagementPage(container), 0);

    return container;
}


function editWorkoutPlan(planId) {
    if (!isAdminUser()) {
        alert('You must be logged in as an admin to edit workout plans.');
        return;
    }

    let workoutList = JSON.parse(localStorage.getItem('workoutPlans')) || [];
    const plan = workoutList.find(p => p.id === planId);

    if (!plan) return;

    const newName = prompt('Enter new plan name:', plan.name);
    if (newName === null) return;

    const newDuration = prompt('Enter new duration:', plan.duration);
    if (newDuration === null) return;

    const newDescription = prompt('Enter new description:', plan.description);
    if (newDescription === null) return;

    plan.name = newName;
    plan.duration = newDuration;
    plan.description = newDescription;

    localStorage.setItem('workoutPlans', JSON.stringify(workoutList));
    window.dispatchEvent(new CustomEvent('navigate', { detail: 'manage-workouts' }));
}

function deleteWorkoutPlan(index) {
    if (!isAdminUser()) {
        alert('You must be logged in as an admin to delete workout plans.');
        return;
    }

    if (!confirm('Are you sure you want to delete this plan?')) return;

    let workoutList = JSON.parse(localStorage.getItem('workoutPlans')) || [];
    workoutList.splice(index, 1);
    localStorage.setItem('workoutPlans', JSON.stringify(workoutList));

    window.dispatchEvent(new CustomEvent('navigate', { detail: 'manage-workouts' }));
}
