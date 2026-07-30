import React from 'react';
import ReactDOM from 'react-dom/client';
import Navbar from './components/Navbar.jsx';
import WorkoutPlans from './components/WorkoutPlans.jsx';
import AnnouncementBoard from './components/AnnouncementBoard.jsx';
import WorkoutTips from './components/WorkoutTips.jsx';
import DietPlans from './components/DietPlans.jsx';
import AuthPanel from './components/AuthPanel.jsx';
import './index.css';

function mount(rootId, element) {
    const rootNode = document.getElementById(rootId);
    if (!rootNode) {
        return;
    }

    ReactDOM.createRoot(rootNode).render(
        <React.StrictMode>{element}</React.StrictMode>
    );
}

function mountNavbar() {
    const rootNode = document.getElementById('navbarRoot');
    if (!rootNode) {
        return;
    }

    const role = rootNode.getAttribute('data-role') || 'member';
    const currentPage = rootNode.getAttribute('data-current-page') || '';

    ReactDOM.createRoot(rootNode).render(
        <React.StrictMode>
            <Navbar role={role} currentPage={currentPage} />
        </React.StrictMode>
    );
}

mountNavbar();
mount('workoutContent', <WorkoutPlans />);
mount('announcementRoot', <AnnouncementBoard />);
mount('tipsRoot', <WorkoutTips />);
mount('dietRoot', <DietPlans />);

const authRoot = document.getElementById('authRoot');
if (authRoot) {
    const authMode = authRoot.getAttribute('data-auth-mode') || 'member-login';
    mount('authRoot', <AuthPanel mode={authMode} />);
}
