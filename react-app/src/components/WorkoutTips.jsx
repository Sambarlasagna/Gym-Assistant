import React, { useState } from 'react';

const TIPS = [
    { title: 'Hydrate Early', tip: 'Start your day with water and keep intake steady through sessions.' },
    { title: 'Warm Up Properly', tip: 'Use 5-10 minutes of dynamic prep before lifting or running.' },
    { title: 'Track Progress', tip: 'Log reps, loads, and recovery notes every workout.' },
    { title: 'Sleep Matters', tip: 'Recovery quality drives performance gains.' }
];

function WorkoutTips() {
    const [currentTip, setCurrentTip] = useState(0);
    const tip = TIPS[currentTip];

    function nextTip() {
        setCurrentTip((prev) => (prev + 1) % TIPS.length);
    }

    function prevTip() {
        setCurrentTip((prev) => (prev - 1 + TIPS.length) % TIPS.length);
    }

    return (
        <div className="tips-widget card">
            <div className="card-title">Coaching Notes</div>
            <div className="tip-content">
                <h3>{tip.title}</h3>
                <p>{tip.tip}</p>
            </div>
            <div className="tips-actions">
                <button className="btn btn-secondary" onClick={prevTip}>Prev</button>
                <span>{currentTip + 1} / {TIPS.length}</span>
                <button className="btn btn-secondary" onClick={nextTip}>Next</button>
            </div>
        </div>
    );
}

export default WorkoutTips;
