# 🎯 Grand Pilatus Campaign Management App

Ein Fullstack-Projekt mit **Angular 19** (Frontend SPA) und **Node.js + Express + MongoDB** (Backend API).
Mit JWT-Auth Tokens, Swagger-Dokumentation und Docker-Setup (für MongoDB).
Ausserdem wird Jest genutzt für automatisierte API-Tests.

---

## 🏛 Project Structure

The project is structured as a monorepo containing both the Angular Client and the Express Server.

```
Root/
├── grandpilatus-client/   # Angular 19 SPA
│   ├── src/app/core/      # Singleton services, guards, interceptors (Core Module)
│   ├── src/app/features/  # Business features (Dashboard, Campaigns, etc.)
│   └── src/app/shared/    # Shared models & utilities
└── grandpilatus-server/   # Node.js Express API
    ├── src/controllers/   # Request handlers
    ├── src/models/        # Mongoose/DB models
    └── src/routes/        # API route definitions
```

---

## 🚀 Tech Stack

### Frontend (Client SPA)
- **Angular 19 + TypeScript** — SPA Frontend
- **Angular Material** — Für die Komponenten
- **Reactive Forms** — Validierung & komplexe Formular-Flows  
- **Chart.js** — einfache Diagramme für Metriken und das Reporting
- **JWT Auth** — `HttpInterceptor` hängt Token automatisch an API-Requests  

### Backend (Server App)
- **Node.js 20 + Express 4 + TypeScript** — leichtgewichtig und verständlich  
- **MongoDB + Mongoose** — schema-on-write, schnelle Iteration für Kampagnen-Daten  
- **JWT (Access + Refresh)** via `passport-jwt` oder Custom Middleware — Schutz für Admin-Endpunkte  
- **OpenAPI 3 (Swagger)** — `swagger-jsdoc` + `swagger-ui-express` für API-Doku  
- **Validation for type safety etc:** [zod](https://github.com/colinhacks/zod) — präzise und knappe Schemas
- **Testing:** Jest für API Tests, automatisiertes reporting mit jest-html-reporter unter `/reports`
- **Tooling:** ESLint + Prettier, dotenv, CORS, ts-node-dev für lokale Entwicklung  
- **Containerization:** Docker Compose für MongoDB

---

## 📦 Setup & Run

### Needed tools
 - Node.js v19 oder neuer
 - npm
 - Docker Desktop

### 1. Start MongoDB with Docker Compose 
```bash
docker compose up -d mongo
```

### 2. Run Backend (Server App) and seed the database
Zuerst das Repository klonen und den Backend-Server starten:

```bash
git clone https://github.com/Karikon/TA_GrandPilatus.git
cd TA_GrandPilatus
cd grandpilatus-server
npm install
npm run seed
npm run dev
```

- API läuft unter: [http://localhost:4000](http://localhost:4000)  
- Swagger-Doku: [http://localhost:4000/api-docs](http://localhost:4000/api-docs)  

### 3. Run Frontend (Client SPA)
Nun das Frontend starten:

```bash
cd ../grandpilatus-client
npm install
npm start
```
- Frontend läuft unter: [http://localhost:4200](http://localhost:4200)  

### 4. Create Admin Account (via Swagger)
- Unter: [http://localhost:4000/api-docs](http://localhost:4000/api-docs) einen Account erstellen bei `Auth` -> `/auth/register`

> **Note:** Falls man via Swagger die API testen möchte, muss man noch `/auth/login` mit dem erstellten Account nutzen und den **accessToken** oben rechts bei `Authorize` hinterlegen. (Nur den Token, ohne "Bearer"). Der Token ist 15min gültig.

---

## ✅ Test Setup
Automated JEST-API tests which loads an in-memory mongodb.

```bash
cd grandpilatus-server
npm test
```

- `tests/utils/testServer.ts`: spins up the app against mongodb-memory-server, handles cleanup between specs.
- `tests/utils/auth.ts`: provides helpers to register/login test users.
- `tests/auth.e2e.spec.ts`: covers registration/login paths.
- `tests/api.e2e.spec.ts`: drives the authenticated flows for all core features.
