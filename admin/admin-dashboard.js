// Admin Module - Contains Admin Dashboard and Management View logic

// Create admin dashboard
function createAdminDashboard() {
    const container = document.createElement('div');
    container.className = 'admin-dashboard-container';

    // Get dummy statistics
    const stats = {
        totalMembers: 1245,
        activeMembers: 1089,
        inactiveMembers: 156,
        newThisMonth: 47
    };

    // Get recent announcements from localStorage
    const DUMMY_ANNOUNCEMENTS = [
        {
            id: 1,
            title: 'New Equipment Arrived',
            content: 'We have received new state-of-the-art cardio equipment including 5 new treadmills and elliptical machines.',
            date: '2024-01-20',
            importance: 'high'
        },
        {
            id: 2,
            title: 'Gym Maintenance',
            content: 'The gym will be closed on January 25th for routine maintenance and deep cleaning. We apologize for the inconvenience.',
            date: '2024-01-18',
            importance: 'high'
        },
        {
            id: 3,
            title: 'New Group Classes',
            content: 'We are excited to announce new group classes including HIIT, Pilates, and Boxing. Join now!',
            date: '2024-01-15',
            importance: 'medium'
        },
        {
            id: 4,
            title: 'Membership Renewal',
            content: 'Don\'t forget to renew your membership before the expiry date to continue enjoying our facilities.',
            date: '2024-01-12',
            importance: 'medium'
        }
    ];
    const announcements = JSON.parse(localStorage.getItem('announcements')) || DUMMY_ANNOUNCEMENTS;

    container.innerHTML = `
        <div class="dashboard-header">
            <h1>Admin Dashboard</h1>
            <p>Manage gym members, plans, and announcements</p>
        </div>

        <div class="stats-grid grid grid-3">
            <div class="stat-card card">
                <div class="stat-icon">👥</div>
                <h3>Total Members</h3>
                <div class="stat-value">${stats.totalMembers}</div>
            </div>

            <div class="stat-card card">
                <div class="stat-icon">✓</div>
                <h3>Active Members</h3>
                <div class="stat-value">${stats.activeMembers}</div>
            </div>

            <div class="stat-card card">
                <div class="stat-icon">✗</div>
                <h3>Inactive Members</h3>
                <div class="stat-value">${stats.inactiveMembers}</div>
            </div>

            <div class="stat-card card">
                <div class="stat-icon">+</div>
                <h3>New This Month</h3>
                <div class="stat-value">${stats.newThisMonth}</div>
            </div>
        </div>

        <div class="admin-actions">
            <h2>Management Actions</h2>
            <div class="grid grid-3">
                <div class="action-card card" onclick="window.dispatchEvent(new CustomEvent('navigate', { detail: 'manage-workouts' }))">
                    <div class="action-icon">⚡</div>
                    <h3>Manage Workouts</h3>
                    <p>Create and update workout plans</p>
                </div>

                <div class="action-card card" onclick="window.dispatchEvent(new CustomEvent('navigate', { detail: 'manage-diet' }))">
                    <div class="action-icon">🍽</div>
                    <h3>Manage Diet Plans</h3>
                    <p>Create and update diet plans</p>
                </div>

                <div class="action-card card" onclick="window.dispatchEvent(new CustomEvent('navigate', { detail: 'announcements-admin' }))">
                    <div class="action-icon">📢</div>
                    <h3>Manage Announcements</h3>
                    <p>Post and manage announcements</p>
                </div>
            </div>
        </div>

        <div class="recent-announcements">
            <h2>Recent Announcements (${announcements.length})</h2>
            <div id="announcementsList"></div>
        </div>
    `;

    // Display announcements
    const announcementsList = container.querySelector('#announcementsList');
    if (announcements.length === 0) {
        announcementsList.innerHTML = '<p class="no-data">No announcements yet. Create one!</p>';
    } else {
        announcements.slice(-5).reverse().forEach(announcement => {
            const announcementCard = document.createElement('div');
            announcementCard.className = `announcement-item card importance-${announcement.importance}`;
            announcementCard.innerHTML = `
                <div class="announcement-header">
                    <h4>${announcement.title}</h4>
                    <span class="importance-badge importance-${announcement.importance}">
                        ${announcement.importance.toUpperCase()}
                    </span>
                </div>
                <p>${announcement.content}</p>
                <small>Posted on: ${announcement.date}</small>
            `;
            announcementsList.appendChild(announcementCard);
        });
    }

    return container;
}
