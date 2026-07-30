import React, { useMemo, useState } from 'react';

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function readUsers(key) {
    try {
        return JSON.parse(localStorage.getItem(key)) || [];
    } catch {
        return [];
    }
}

function writeUsers(key, users) {
    localStorage.setItem(key, JSON.stringify(users));
}

function getModeConfig(mode) {
    const map = {
        'member-login': {
            title: 'Member Login',
            submitLabel: 'Login',
            role: 'member',
            accountKey: 'users',
            isSignup: false,
            links: [
                { href: 'signup.html', text: 'Create account' },
                { href: 'admin-login.html', text: 'Admin login' }
            ]
        },
        'member-signup': {
            title: 'Create Member Account',
            submitLabel: 'Sign Up',
            role: 'member',
            accountKey: 'users',
            isSignup: true,
            links: [{ href: 'login.html', text: 'Already registered? Login' }]
        },
        'admin-login': {
            title: 'Admin Login',
            submitLabel: 'Login',
            role: 'admin',
            accountKey: 'admins',
            isSignup: false,
            links: [
                { href: 'admin-signup.html', text: 'Create admin account' },
                { href: 'login.html', text: 'Member login' }
            ]
        },
        'admin-signup': {
            title: 'Create Admin Account',
            submitLabel: 'Sign Up',
            role: 'admin',
            accountKey: 'admins',
            isSignup: true,
            links: [{ href: 'admin-login.html', text: 'Already admin? Login' }]
        }
    };

    return map[mode] || map['member-login'];
}

function AuthPanel({ mode }) {
    const config = useMemo(() => getModeConfig(mode), [mode]);
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState({ text: '', type: '' });

    function updateField(field, value) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    function showError(text) {
        setMessage({ text, type: 'error' });
    }

    function showSuccess(text) {
        setMessage({ text, type: 'success' });
    }

    function handleSignup() {
        const name = form.name.trim();
        const email = form.email.trim().toLowerCase();
        const password = form.password;
        const confirmPassword = form.confirmPassword;

        if (!name || !email || !password || !confirmPassword) {
            showError('Please fill in all fields.');
            return;
        }

        if (!isValidEmail(email)) {
            showError('Enter a valid email address.');
            return;
        }

        if (password.length < 6) {
            showError('Password must be at least 6 characters.');
            return;
        }

        if (password !== confirmPassword) {
            showError('Passwords do not match.');
            return;
        }

        const existing = readUsers(config.accountKey);
        if (existing.some((user) => user.email === email)) {
            showError('Account already exists for this email.');
            return;
        }

        const newUser = { id: Date.now(), name, email, password };
        writeUsers(config.accountKey, [...existing, newUser]);
        showSuccess('Account created. Redirecting to login...');

        window.setTimeout(() => {
            window.location.href = config.role === 'admin' ? 'admin-login.html' : 'login.html';
        }, 700);
    }

    function handleLogin() {
        const email = form.email.trim().toLowerCase();
        const password = form.password;

        if (!email || !password) {
            showError('Please fill in all fields.');
            return;
        }

        if (!isValidEmail(email)) {
            showError('Enter a valid email address.');
            return;
        }

        const users = readUsers(config.accountKey);
        const user = users.find((item) => item.email === email && item.password === password);

        if (!user) {
            showError('Invalid email or password.');
            return;
        }

        if (window.app && typeof window.app.setUser === 'function') {
            window.app.setUser({ id: user.id, email: user.email, name: user.name }, config.role);
            return;
        }

        localStorage.setItem('currentUser', JSON.stringify({ id: user.id, email: user.email, name: user.name }));
        localStorage.setItem('currentRole', config.role);
        window.location.href = config.role === 'admin' ? '../admin/dashboard.html' : '../member-dashboard/dashboard.html';
    }

    function handleSubmit(event) {
        event.preventDefault();
        if (config.isSignup) {
            handleSignup();
            return;
        }
        handleLogin();
    }

    return (
        <div className="auth-shell">
            <form className="auth-card fade-in" onSubmit={handleSubmit}>
                <header className="auth-header">
                    <p className="auth-kicker">GymFit</p>
                    <h1>{config.title}</h1>
                </header>

                {message.text ? (
                    <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`}>
                        {message.text}
                    </div>
                ) : null}

                {config.isSignup ? (
                    <div className="form-group">
                        <label htmlFor="authName">Full Name</label>
                        <input
                            id="authName"
                            type="text"
                            value={form.name}
                            onChange={(event) => updateField('name', event.target.value)}
                            placeholder="Your full name"
                        />
                    </div>
                ) : null}

                <div className="form-group">
                    <label htmlFor="authEmail">Email</label>
                    <input
                        id="authEmail"
                        type="email"
                        value={form.email}
                        onChange={(event) => updateField('email', event.target.value)}
                        placeholder="you@example.com"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="authPassword">Password</label>
                    <input
                        id="authPassword"
                        type="password"
                        value={form.password}
                        onChange={(event) => updateField('password', event.target.value)}
                        placeholder="Enter password"
                    />
                </div>

                {config.isSignup ? (
                    <div className="form-group">
                        <label htmlFor="authConfirmPassword">Confirm Password</label>
                        <input
                            id="authConfirmPassword"
                            type="password"
                            value={form.confirmPassword}
                            onChange={(event) => updateField('confirmPassword', event.target.value)}
                            placeholder="Confirm password"
                        />
                    </div>
                ) : null}

                <button type="submit" className="btn btn-primary btn-block">{config.submitLabel}</button>

                <footer className="auth-links">
                    {config.links.map((link) => (
                        <p key={link.href}>
                            <a href={link.href}>{link.text}</a>
                        </p>
                    ))}
                </footer>
            </form>
        </div>
    );
}

export default AuthPanel;
