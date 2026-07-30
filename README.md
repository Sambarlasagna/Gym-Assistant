# 🏋️ Personalized Gym Assistant

> A full-featured gym management web application for members and administrators — built with HTML/CSS/JavaScript and React (Vite).

---

## 📌 Project Name & Overview

**Personalized Gym Assistant** is a client-side web application designed to streamline gym management for both members and administrators. It provides a role-based interface where gym members can view their personalized workout and diet plans, track membership status, and read announcements — while admins can create and manage those plans and publish updates.

The application is built using a hybrid stack: vanilla HTML/CSS/JavaScript for core pages and navigation, with a React + Vite bundle powering the dynamic workout and diet plan interfaces. All data is persisted using the browser's `localStorage`, making the app fully functional without a backend server.

---

## 🧩 Problem it Solves

Traditional gym management is fragmented — members rely on paper schedules, verbal instructions, or disconnected apps to track their workouts and diet. Admins struggle to push updates without reprinting materials or sending mass messages.

**Personalized Gym Assistant** solves this by:
- Giving members a **single, personalized dashboard** to view their workout plan, diet plan, and gym announcements
- Giving admins a **management panel** to create/update workout plans, diet plans, and publish announcements — all from a browser
- Eliminating the need for a backend or database for lightweight, demo/educational deployments

---

## 👥 Target Users (Personas)

### 🏃 Persona 1 — The Gym Member
- **Name:** Arjun, 24, college student
- **Goal:** Lose weight and build a consistent workout habit
- **Pain Point:** Doesn't know which exercises to do or how to eat right; relies on inconsistent advice from trainers
- **Needs:** A simple dashboard where he can see his current workout plan, diet plan, and gym updates after logging in

### 👩‍💼 Persona 2 — The Gym Admin / Trainer
- **Name:** Priya, 35, certified personal trainer managing 50+ members
- **Goal:** Assign and update workout/diet plans for different member categories without calling each member
- **Pain Point:** Managing paper-based plans is time-consuming and error-prone
- **Needs:** An admin panel to create categorized workout plans, publish diet plans, and post announcements visible to all members

---

## 🌟 Vision Statement

> To empower gym members with a personalized, always-accessible digital fitness companion, while giving trainers and administrators a simple tool to manage and communicate fitness plans — eliminating paper-based workflows and making personalized gym management accessible to everyone.

---

## 🎯 Key Features / Goals

| Feature | Description |
|---|---|
| 🔐 Role-based Auth | Separate login/signup flows for Members and Admins using localStorage |
| 📊 Member Dashboard | Personalized welcome screen with membership status and quick-action cards |
| 💪 Workout Plans | Goal-based plans (Weight Loss, Muscle Gain, Endurance) with day-by-day exercise tables |
| 🥗 Diet Plans | Nutrition plans aligned with fitness goals, managed by admins |
| 📢 Announcements | Admin publishes gym news/updates; members view them on their dashboard |
| 🛠️ Admin Panel | Admin dashboard to create/manage workout plans, diet plans, and announcements |
| 📱 Responsive Design | Mobile-friendly layout using CSS Grid and Flexbox |

---

## 📈 Success Metrics

| Metric | Target |
|---|---|
| Member login and dashboard load | < 2 seconds |
| Number of supported workout goal categories | ≥ 3 (Weight Loss, Muscle Gain, Endurance) |
| Admin able to publish a new plan | In < 5 clicks |
| App works without internet | ✅ (fully client-side) |
| Zero backend/server dependencies | ✅ (localStorage only) |
| Cross-browser compatibility | Chrome, Firefox, Edge |

---

## ⚙️ Assumptions & Constraints

### Assumptions
- Users have a modern browser (Chrome/Firefox/Edge) with JavaScript enabled
- The gym has a designated admin who manages the system
- Members self-register; no approval workflow is needed for this version
- Data does not need to persist across different devices or browsers

### Constraints
- **No backend/database**: All data is stored in `localStorage` — this means data is browser-local and not shareable across devices
- **No real authentication**: Passwords are stored in `localStorage` without hashing — this is a learning/demo project only and **not suitable for production**
- **Single-machine deployment**: Designed to run locally or on a static host (GitHub Pages, Netlify)
- **No payment integration**: Membership plans are mock data; no real billing is handled

---

## 🗂️ Repository Structure

```
Personalized_Gym_Assistant/
├── index.html                  # Entry point — redirects based on login state
├── assets/                     # Global CSS and shared JS utilities
│   ├── global.css
│   └── app.js
├── auth/                       # Login and Signup pages (member + admin)
│   ├── login.html
│   ├── signup.html
│   ├── admin-login.html
│   └── admin-signup.html
├── member-dashboard/           # Member dashboard view
│   ├── dashboard.html
│   ├── member-dashboard.js
│   └── announcements.html
├── admin/                      # Admin dashboard and management tools
│   ├── dashboard.html
│   ├── admin-dashboard.js
│   ├── announcements-admin.html
│   └── announcements.js
├── workout-diet/               # Workout and diet plan HTML shells + React mount points
│   ├── workouts.html
│   ├── diet.html
│   ├── manage-workouts.html
│   ├── manage-diet.html
│   └── dist/                   # Compiled React bundle (auto-generated)
├── react-app/                  # React + Vite source for Workout & Diet plan UI
│   ├── src/
│   │   ├── components/
│   │   │   ├── WorkoutPlans.jsx
│   │   │   ├── WorkoutTips.jsx
│   │   │   └── DietPlans.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── Dockerfile                  # Docker setup for local development
├── .gitignore
└── README.md
```

---

## 🌿 Branching Strategy

This project follows **GitHub Flow**:

1. `main` — Always deployable; represents the stable version of the app
2. Feature branches — Created from `main` for every new feature or fix
3. Pull Requests — All changes are merged into `main` via a PR after review

### Branch Naming Convention
```
feature/<short-description>    e.g. feature/admin-diet-panel
fix/<short-description>        e.g. fix/login-redirect-bug
chore/<short-description>      e.g. chore/update-gitignore
```

---

## 🚀 Quick Start – Local Development

### Option 1: Open directly in browser (no install needed)
```bash
# Clone the repo
git clone https://github.com/<your-username>/Personalized_Gym_Assistant.git
cd Personalized_Gym_Assistant

# Open index.html directly in your browser
# OR serve it with Node.js http-server:
npm start
# Visit http://localhost:8080
```

### Option 2: Docker (Recommended for consistent environment)
```bash
# Build the Docker image
docker build -t gym-assistant .

# Run the container
docker run -p 8080:80 gym-assistant

# Visit http://localhost:8080
```

### Option 3: React Dev Server (for editing React components)
```bash
cd react-app
npm install
npm run dev
# Visit http://localhost:5173

# After editing, rebuild the bundle:
npm run build
# This places the compiled output in workout-diet/dist/
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Core UI | HTML5, CSS3, Vanilla JavaScript |
| Component UI | React 18 + Vite 5 |
| State/Storage | Browser localStorage |
| Dev Server | http-server / Vite |
| Containerization | Docker + Nginx |
| Version Control | Git + GitHub |

---

## 📝 Notes

- This project uses **client-side storage only** and is intended for **learning and demonstration** purposes.
- No hardcoded credentials are included. All accounts are created through the signup pages.
- The React bundle must be rebuilt (`npm run build` inside `react-app/`) after any changes to React components.
