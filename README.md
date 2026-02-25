<p align="center">
  <img src="https://img.icons8.com/3d-fluency/94/dumbbell.png" alt="FitTracker Logo" width="80"/>
</p>

<h1 align="center">🏋️ FitTrack Pro</h1>

<p align="center">
  <em>A full-stack fitness tracking platform built with modern DevOps practices</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React"/>
  <img src="https://img.shields.io/badge/Spring_Boot-3.2-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot"/>
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Jenkins-CI/CD-D24939?style=for-the-badge&logo=jenkins&logoColor=white" alt="Jenkins"/>
  <img src="https://img.shields.io/badge/Ansible-Deployment-EE0000?style=for-the-badge&logo=ansible&logoColor=white" alt="Ansible"/>
  <img src="https://img.shields.io/badge/Kubernetes-Orchestration-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white" alt="Kubernetes"/>
  <img src="https://img.shields.io/badge/AWS_EC2-Production-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white" alt="AWS"/>
</p>

---

## 📖 About

**FitTrack Pro** is a comprehensive, production-grade fitness tracking web application designed and built as a final year project. It demonstrates full-stack development expertise combined with enterprise-level DevOps practices — from writing code to deploying it on AWS EC2 through a fully automated CI/CD pipeline.

Users can track workouts, set fitness goals, monitor progress with analytics charts, upload progress photos, compete on leaderboards, and earn achievement badges — all wrapped in a sleek, glassmorphism-inspired UI.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **JWT Authentication** | Secure signup/login with role-based access (User & Admin) |
| 🏠 **Interactive Dashboard** | Real-time stats, weekly progress bar charts, calorie tracking |
| 💪 **Exercise Library** | Browse, search, and filter exercises by muscle group & equipment |
| 📝 **Workout Logging** | Log workouts with sets, reps, weight, and auto-calculated calories |
| 🎯 **Goal Tracking** | Set and track fitness goals with progress indicators |
| 📸 **Progress Photos** | Upload and compare transformation photos via Cloudinary |
| 🏆 **Leaderboard** | Compete with other users based on workout performance |
| 🥇 **Gamification** | Earn badges and achievements as you hit milestones |
| 🧮 **Fitness Calculators** | BMI, calorie, and other health calculators |
| 👨‍💼 **Admin Panel** | User management dashboard with audit logging |
| 📊 **Audit Logs** | Track all system actions for accountability |
| 👤 **User Profiles** | Customizable profiles with avatar support |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** + Vite 7 | UI framework & build tool |
| **Tailwind CSS** | Utility-first styling with glassmorphism design |
| **Framer Motion** | Smooth page transitions & micro-animations |
| **Recharts** | Interactive data visualization (bar charts, trends) |
| **Lucide React** | Beautiful, consistent iconography |
| **Axios** | API communication with interceptors |
| **React Hot Toast** | Elegant notification system |
| **React Router v7** | Client-side routing with protected routes |

### Backend
| Technology | Purpose |
|---|---|
| **Spring Boot 3.2** | REST API framework (Java 21) |
| **Spring Security** | Authentication & authorization with JWT |
| **MongoDB Atlas** | Cloud-hosted NoSQL database |
| **Cloudinary** | Image upload & transformation (progress photos) |
| **Maven** | Dependency management & build tool |
| **Swagger/OpenAPI** | API documentation |

### DevOps & Infrastructure
| Technology | Purpose |
|---|---|
| **Docker** | Containerization (multi-stage builds) |
| **Docker Compose** | Multi-container orchestration |
| **Jenkins** | CI/CD pipeline automation |
| **Ansible** | Automated deployment to EC2 |
| **Kubernetes** | Container orchestration (manifests included) |
| **AWS EC2** | Production cloud hosting |
| **Nginx** | Reverse proxy & SPA serving |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        AWS EC2 Instance                      │
│                                                              │
│  ┌──────────────────┐        ┌──────────────────────────┐   │
│  │  Nginx Container │  :80   │  Spring Boot Container   │   │
│  │  (React SPA)     │───────▶│  (REST API)        :8080 │   │
│  │                  │        │                          │   │
│  └──────────────────┘        └────────┬─────────────────┘   │
│                                       │                      │
└───────────────────────────────────────┼──────────────────────┘
                                        │
                        ┌───────────────▼──────────────┐
                        │      MongoDB Atlas           │
                        │      (Cloud Database)        │
                        └──────────────────────────────┘
```

---

## 🚀 CI/CD Pipeline

The project uses a **Jenkins pipeline** that automates the entire build-test-deploy lifecycle:

```
  Checkout ──▶ Unit Tests ──▶ Build Backend ──▶ Build Frontend
                                                      │
                                                      ▼
              Deploy to EC2 ◀── Docker Push ◀── Docker Build
              (via Ansible)
```

| Stage | Description |
|---|---|
| **Checkout** | Pulls latest code from GitHub |
| **Unit Tests** | Runs Maven test suite |
| **Build Backend** | Packages Spring Boot JAR |
| **Build Frontend** | Installs dependencies & runs `vite build` |
| **Docker Build & Push** | Builds images and pushes to Docker Hub |
| **Deploy with Ansible** | SSHs into EC2, pulls images, restarts containers |

---

## 📁 Project Structure

```
fitness-tracker/
│
├── fitness-tracker-frontend/      # React Frontend
│   ├── src/
│   │   ├── components/            # Reusable UI components (Navbar, Sidebar, Modals)
│   │   ├── contexts/              # Auth context (JWT state management)
│   │   ├── pages/                 # 13 page components (Dashboard, Workouts, Goals...)
│   │   ├── services/              # API service layer (Axios)
│   │   └── assets/                # Static assets
│   ├── Dockerfile                 # Nginx-based production image
│   ├── nginx.conf                 # SPA routing configuration
│   └── package.json
│
├── fitness-tracker-backend/       # Spring Boot Backend
│   └── src/main/java/com/fitnesstracker/
│       ├── auth/                  # JWT authentication & security
│       ├── workout/               # Workout CRUD & calorie calculation
│       ├── exercise/              # Exercise library management
│       ├── goal/                  # Fitness goal tracking
│       ├── gamification/          # Badges & achievement system
│       ├── dashboard/             # Stats aggregation
│       ├── user/                  # User profile management
│       ├── admin/                 # Admin panel operations
│       ├── audit/                 # Audit log tracking
│       └── config/                # Swagger, CORS, Cloudinary config
│
├── ansible/                       # Deployment Automation
│   ├── playbook.yml               # EC2 deployment playbook
│   └── inventory.ini              # Host configuration
│
├── k8s/                           # Kubernetes Manifests
│   ├── backend.yaml               # Backend deployment & service
│   ├── frontend.yaml              # Frontend deployment & service
│   └── secrets.yaml               # Kubernetes secrets
│
├── Jenkinsfile                    # CI/CD pipeline definition
├── docker-compose.yml             # Local multi-container setup
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites

- **Node.js** ≥ 18
- **Java** 21 (JDK)
- **Maven** ≥ 3.9
- **Docker** & Docker Compose
- **MongoDB** (local or Atlas connection string)

### 1. Clone the Repository

```bash
git clone https://github.com/QuantumEmpress/-fitness-tracker.git
cd -fitness-tracker
```

### 2. Backend Setup

```bash
cd fitness-tracker-backend
mvn clean install -DskipTests
mvn spring-boot:run
```
> The API will start on `http://localhost:8080`

### 3. Frontend Setup

```bash
cd fitness-tracker-frontend
npm install --legacy-peer-deps
npm run dev
```
> The app will start on `http://localhost:5173`

### 4. Docker Compose (Full Stack)

```bash
docker-compose up --build
```
> Frontend: `http://localhost:80` · Backend: `http://localhost:8080`

---

## 🔑 API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Register new user | ❌ |
| `POST` | `/api/auth/signin` | Login & get JWT | ❌ |
| `GET` | `/api/user/profile` | Get current user profile | ✅ |
| `PUT` | `/api/user/profile` | Update profile | ✅ |
| `GET` | `/api/exercises` | List all exercises | ✅ |
| `POST` | `/api/workouts` | Log a workout | ✅ |
| `GET` | `/api/workouts` | Get user workouts | ✅ |
| `POST` | `/api/goals` | Create a goal | ✅ |
| `GET` | `/api/goals` | Get user goals | ✅ |
| `GET` | `/api/dashboard/stats` | Dashboard statistics | ✅ |
| `GET` | `/api/leaderboard` | Get leaderboard | ✅ |
| `GET` | `/api/badges` | Get user badges | ✅ |
| `POST` | `/api/progress-photos` | Upload progress photo | ✅ |
| `GET` | `/api/admin/users` | Admin: List all users | 🔒 |
| `GET` | `/api/audit-logs` | Admin: View audit logs | 🔒 |

> ✅ = Requires JWT &nbsp;&nbsp; 🔒 = Requires Admin Role

---

## 🌐 Deployment

### Production (AWS EC2)

The app is deployed to AWS EC2 via the Jenkins pipeline:

1. **Push to `main`** branch triggers the pipeline
2. Jenkins builds & tests the application
3. Docker images are built and pushed to **Docker Hub**
4. Ansible connects to EC2 and deploys the new containers

### Kubernetes (Optional)

```bash
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml
```

---

## 🎨 UI Highlights

- **Glassmorphism Design** — Frosted glass cards with backdrop blur effects
- **Gradient Color Palette** — Violet-to-fuchsia gradients throughout
- **Smooth Animations** — Page transitions and hover effects via Framer Motion
- **Skeleton Loading** — Custom skeleton screens for all data-heavy pages
- **Fully Responsive** — Adaptive layout from mobile to desktop
- **Dark Accents** — Elegant contrast with light mesh backgrounds

---

## 👩‍💻 Author

**Okafor Omalicha**

- GitHub: [@QuantumEmpress](https://github.com/QuantumEmpress)

---

## 📄 License

This project was built as a **Final Year Project** for academic purposes.

---

<p align="center">
  Built with ❤️ and a lot of ☕
</p>
