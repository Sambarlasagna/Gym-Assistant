import React from 'react';

const MEMBER_LINKS = [
    { href: '../member-dashboard/dashboard.html', label: 'Dashboard', key: 'dashboard' },
    { href: '../workout-diet/workouts.html', label: 'Workouts', key: 'workouts' },
    { href: '../workout-diet/diet.html', label: 'Diet Plans', key: 'diet' },
    { href: '../member-dashboard/announcements.html', label: 'Announcements', key: 'announcements' }
];

const ADMIN_LINKS = [
    { href: '../admin/dashboard.html', label: 'Dashboard', key: 'dashboard' },
    { href: '../workout-diet/manage-workouts.html', label: 'Workouts', key: 'manage-workouts' },
    { href: '../workout-diet/manage-diet.html', label: 'Diet Plans', key: 'manage-diet' },
    { href: '../admin/announcements-admin.html', label: 'Announcements', key: 'announcements-admin' }
];

function readCurrentUserName(role) {
    try {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        return user?.name || user?.email || (role === 'admin' ? 'Admin' : 'Member');
    } catch {
        return role === 'admin' ? 'Admin' : 'Member';
    }
}

function getLinks(role) {
    return role === 'admin' ? ADMIN_LINKS : MEMBER_LINKS;
}

function Navbar({ role = 'member', currentPage = '' }) {
    const userName = readCurrentUserName(role);
    const links = getLinks(role);

    function handleLogout() {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('currentRole');
        window.location.href = '../auth/login.html';
    }

    return (
        <nav>
            <div className="logo">GymFit</div>
            <ul className="nav-links" id="navLinks">
                {links.map((link) => (
                    <li key={link.key}>
                        <a href={link.href} aria-current={currentPage === link.key ? 'page' : undefined}>
                            {link.label}
                        </a>
                    </li>
                ))}
            </ul>
            <div className="user-info">
                <span id="userNameDisplay">{userName}</span>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
        </nav>
    );
}

export default Navbar;
