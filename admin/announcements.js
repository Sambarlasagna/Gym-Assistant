// Announcements Module

// Check if current user is admin
function isAdminUser() {
    const role = localStorage.getItem('currentRole');
    return role === 'admin';
}

// Dummy announcements
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

// Create announcements management page for admin
function createAnnouncementsAdminPage() {
    // Check if user is admin
    if (!isAdminUser()) {
        const container = document.createElement('div');
        container.className = 'announcements-admin-container';
        container.innerHTML = `
            <div class="page-header">
                <h1>Manage Announcements</h1>
            </div>
            <div style="padding: 2rem; text-align: center;">
                <p style="color: red; font-weight: bold;">Access Denied: You must be logged in as an admin to manage announcements.</p>
            </div>
        `;
        return container;
    }

    const container = document.createElement('div');
    container.className = 'announcements-admin-container';

    let announcements = JSON.parse(localStorage.getItem('announcements')) || DUMMY_ANNOUNCEMENTS;

    container.innerHTML = `
        <div class="page-header">
            <h1>Manage Announcements</h1>
        </div>

        <div class="management-section">
            <h2>Post New Announcement</h2>
            <form id="announcementForm" class="management-form">
                <div class="form-group">
                    <label for="announcementTitle">Title:</label>
                    <input type="text" id="announcementTitle" name="announcementTitle" required>
                </div>

                <div class="form-group">
                    <label for="announcementContent">Content:</label>
                    <textarea id="announcementContent" name="announcementContent" rows="5" required></textarea>
                </div>

                <div class="form-group">
                    <label for="announcementImportance">Importance Level:</label>
                    <select id="announcementImportance" name="announcementImportance" required>
                        <option value="low">Low</option>
                        <option value="medium" selected>Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>

                <button type="submit" class="btn btn-primary">Post Announcement</button>
            </form>
        </div>

        <div class="announcements-list-admin">
            <h2>Current Announcements (${announcements.length})</h2>
            <div id="announcementsListAdmin"></div>
        </div>
    `;

    // Display announcements
    const announcementsList = container.querySelector('#announcementsListAdmin');
    if (announcements.length === 0) {
        announcementsList.innerHTML = '<p class="no-data">No announcements yet. Create one above!</p>';
    } else {
        announcements.slice().reverse().forEach((announcement, index) => {
            const announcementCard = document.createElement('div');
            announcementCard.className = 'announcement-item card';
            announcementCard.innerHTML = `
                <div class="announcement-header">
                    <div>
                        <h4>${announcement.title}</h4>
                        <span class="importance-badge importance-${announcement.importance}">
                            ${announcement.importance.toUpperCase()}
                        </span>
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-secondary btn-small" onclick="editAnnouncement('${announcement.id}')">Edit</button>
                        <button class="btn btn-danger btn-small" onclick="deleteAnnouncement('${announcement.id}')">Delete</button>
                    </div>
                </div>
                <p>${announcement.content}</p>
                <small>Posted on: ${announcement.date}</small>
            `;
            announcementsList.appendChild(announcementCard);
        });
    }

    // Handle form submission
    container.querySelector('#announcementForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const today = new Date().toISOString().split('T')[0];

        const newAnnouncement = {
            id: Date.now().toString(),
            title: document.getElementById('announcementTitle').value,
            content: document.getElementById('announcementContent').value,
            importance: document.getElementById('announcementImportance').value,
            date: today
        };

        announcements.push(newAnnouncement);
        localStorage.setItem('announcements', JSON.stringify(announcements));

        alert('Announcement posted successfully!');
        window.dispatchEvent(new CustomEvent('navigate', { detail: 'announcements-admin' }));
    });

    return container;
}

// Edit announcement
function editAnnouncement(id) {
    if (!isAdminUser()) {
        alert('You must be logged in as an admin to edit announcements.');
        return;
    }

    let announcements = JSON.parse(localStorage.getItem('announcements')) || [];
    const announcement = announcements.find(a => a.id.toString() === id.toString());

    if (!announcement) return;

    const title = prompt('Enter new title:', announcement.title);
    if (title === null) return;

    const content = prompt('Enter new content:', announcement.content);
    if (content === null) return;

    const importance = prompt('Enter importance level (low/medium/high):', announcement.importance);
    if (importance === null || !['low', 'medium', 'high'].includes(importance)) {
        alert('Invalid importance level. Please enter low, medium, or high.');
        return;
    }

    announcement.title = title;
    announcement.content = content;
    announcement.importance = importance;

    localStorage.setItem('announcements', JSON.stringify(announcements));
    alert('Announcement updated successfully!');
    window.dispatchEvent(new CustomEvent('navigate', { detail: 'announcements-admin' }));
}

// Delete announcement
function deleteAnnouncement(id) {
    if (!isAdminUser()) {
        alert('You must be logged in as an admin to delete announcements.');
        return;
    }

    if (!confirm('Are you sure you want to delete this announcement?')) return;

    let announcements = JSON.parse(localStorage.getItem('announcements')) || [];
    announcements = announcements.filter(a => a.id.toString() !== id.toString());
    localStorage.setItem('announcements', JSON.stringify(announcements));

    alert('Announcement deleted successfully!');
    window.dispatchEvent(new CustomEvent('navigate', { detail: 'announcements-admin' }));
}
