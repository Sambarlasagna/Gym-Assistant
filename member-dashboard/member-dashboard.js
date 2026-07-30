// Member Dashboard Module

// Mock membership data for dashboard display
const MEMBERSHIP_DATA = {
    1: { type: 'Premium', status: 'Active', startDate: '2023-01-15', expiryDate: '2025-01-15', daysLeft: 345 },
    2: { type: 'Standard', status: 'Active', startDate: '2023-06-20', expiryDate: '2025-06-20', daysLeft: 502 },
    3: { type: 'Basic', status: 'Expired', startDate: '2022-01-10', expiryDate: '2024-01-10', daysLeft: 0 }
};

// Function to initialize member dashboard
function initMemberDashboard(user, container) {
    const dashboardContent = container.querySelector('#dashboardContent') || container;
    const membership = MEMBERSHIP_DATA[user.id] || MEMBERSHIP_DATA[1];

    dashboardContent.innerHTML = `
        <div class="dashboard-header">
            <h1>Welcome, ${user.name}!</h1>
            <p>Your fitness journey starts here</p>
        </div>

        <div class="membership-status card">
            <div class="card-title">Membership Status</div>
            <div class="membership-details">
                <div class="detail-row">
                    <span>Type:</span>
                    <strong>${membership.type}</strong>
                </div>
                <div class="detail-row">
                    <span>Status:</span>
                    <span class="badge badge-${membership.status === 'Active' ? 'success' : 'danger'}">
                        ${membership.status}
                    </span>
                </div>
                <div class="detail-row">
                    <span>Started:</span>
                    <strong>${membership.startDate}</strong>
                </div>
                <div class="detail-row">
                    <span>Expires:</span>
                    <strong>${membership.expiryDate}</strong>
                </div>
                ${membership.status === 'Active' ? `
                    <div class="detail-row">
                        <span>Days Left:</span>
                        <strong class="text-success">${membership.daysLeft} days</strong>
                    </div>
                ` : ''}
            </div>
        </div>

        <div class="quick-actions">
            <h2>Quick Actions</h2>
            <div class="grid grid-3">
                <div class="action-card card" onclick="window.dispatchEvent(new CustomEvent('navigate', { detail: 'workout' }))">
                    <div class="action-icon">FIT</div>
                    <h3>View Workout Plan</h3>
                    <p>Check your personalized workout routine</p>
                </div>

                <div class="action-card card" onclick="window.dispatchEvent(new CustomEvent('navigate', { detail: 'diet' }))">
                    <div class="action-icon">NUTR</div>
                    <h3>View Diet Plan</h3>
                    <p>Follow your customized nutrition plan</p>
                </div>

                <div class="action-card card" onclick="window.dispatchEvent(new CustomEvent('navigate', { detail: 'announcements' }))">
                    <div class="action-icon">NEWS</div>
                    <h3>Announcements</h3>
                    <p>Check latest gym updates</p>
                </div>

                <div class="action-card card" onclick="alert('Feature coming soon!')">
                    <div class="action-icon">PRO</div>
                    <h3>Progress Tracker</h3>
                    <p>Track your fitness progress</p>
                </div>
            </div>
        </div>
    `;
}

// Create member dashboard (Legacy support)
function createMemberDashboard(user) {
    const container = document.createElement('div');
    container.className = 'dashboard-container';

    setTimeout(() => initMemberDashboard(user, container), 0);

    return container;
}
