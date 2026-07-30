import React, { useEffect, useState } from 'react';

const DEFAULT_ANNOUNCEMENTS = [
    {
        id: 1,
        title: 'New Equipment Arrived',
        content: 'We added new cardio and mobility equipment this week.',
        date: '2026-02-01',
        importance: 'high'
    },
    {
        id: 2,
        title: 'Updated Group Sessions',
        content: 'HIIT and mobility slots were updated for weekday evenings.',
        date: '2026-01-27',
        importance: 'medium'
    }
];

function AnnouncementBoard() {
    const [announcements, setAnnouncements] = useState([]);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const stored = localStorage.getItem('announcements');
        const data = stored ? JSON.parse(stored) : DEFAULT_ANNOUNCEMENTS;
        setAnnouncements(data.slice().reverse());
    }, []);

    const filtered = filter === 'all'
        ? announcements
        : announcements.filter((item) => item.importance === filter);

    return (
        <div className="announcements-container">
            <div className="page-header">
                <h1>Announcements</h1>
                <p>Latest updates from the gym team.</p>
            </div>

            <div className="goal-selector">
                <label htmlFor="importanceFilter">Filter by priority</label>
                <select
                    id="importanceFilter"
                    value={filter}
                    onChange={(event) => setFilter(event.target.value)}
                >
                    <option value="all">All</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                </select>
            </div>

            <div className="announcements-list">
                {filtered.length === 0 ? (
                    <p className="no-data">No announcements found.</p>
                ) : (
                    filtered.map((announcement) => (
                        <div key={announcement.id} className={`announcement-card card importance-${announcement.importance}`}>
                            <div className="announcement-header">
                                <h3>{announcement.title}</h3>
                                <span className={`importance-badge importance-${announcement.importance}`}>
                                    {announcement.importance.toUpperCase()}
                                </span>
                            </div>
                            <p className="announcement-content">{announcement.content}</p>
                            <div className="announcement-date">
                                <small>{announcement.date}</small>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default AnnouncementBoard;
