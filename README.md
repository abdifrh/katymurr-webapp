# Katy Murr WebApp

FR: Application full-stack pour `katymurr.com` (coaching, interpreting, writing), avec frontend React/Vite et API Express connectee a Supabase.  
EN: Full-stack web app for `katymurr.com` (coaching, interpreting, writing), with a React/Vite frontend and an Express API connected to Supabase.

## FR - Guide complet

### 1. Stack technique

- Frontend: React 18 + TypeScript + Vite
- Backend: Node.js + Express
- Base de donnees: Supabase (PostgreSQL)
- Outils: ESLint, TailwindCSS, concurrently

### 2. Structure du projet

```text
WebApp/
|-- client/                  # Frontend React
|-- server/                  # API Express
|-- package.json             # Scripts racine
|-- render.yaml              # Config Render (backend)
`-- vercel.json              # Config Vercel (frontend)
```

### 3. Prerequis

- Node.js 18+ (recommande: Node 20 LTS)
- npm 9+
- Un projet Supabase actif

Verification:

```bash
node -v
npm -v
```

### 4. Installation locale

Depuis la racine:

```bash
npm run install:all
```

### 5. Variables d'environnement (backend)

Creer `server/.env`:

```env
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_KEY=YOUR_SUPABASE_KEY
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

`SUPABASE_URL` et `SUPABASE_KEY` sont obligatoires.

### 6. Lancer en local

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- API: `http://localhost:3001`
- Healthcheck: `GET http://localhost:3001/api/health`

### 7. Build production

```bash
npm run build
```

Le frontend compile dans `client/dist`.

### 8. Deploiement web recommande (Vercel + Render)

#### 8.1 Backend sur Render

1. Creer un service Web Render connecte au repo.
2. Render detecte `render.yaml` automatiquement (Blueprint) ou configurer manuellement:
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Health Check Path: `/api/health`
3. Ajouter les variables:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `NODE_ENV=production`
   - `CLIENT_URL=https://<votre-frontend-vercel>.vercel.app`
4. Deployer et noter l'URL backend, ex: `https://katymurr-api.onrender.com`.

#### 8.2 Frontend sur Vercel

1. Importer le repo dans Vercel.
2. Configurer:
   - Framework: Vite
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Le fichier `vercel.json` gere la redirection `/api/*` vers Render.
4. Deployer et recuperer l'URL frontend.

#### 8.3 Liaison finale

1. Mettre a jour `CLIENT_URL` sur Render avec l'URL Vercel finale.
2. Verifier:
   - Frontend charge correctement.
   - Requetes `/api/*` passent via Vercel vers Render.
   - `GET /api/health` repond OK.

### 9. Option hebergement VPS (alternative)

1. Builder le frontend: `npm run build` puis servir `client/dist` via Nginx.
2. Lancer le backend `server/index.js` avec PM2/systemd.
3. Configurer un reverse proxy:
   - `https://votredomaine.com` -> frontend statique
   - `https://votredomaine.com/api` -> backend Node
4. Definir les memes variables d'environnement backend que ci-dessus.

### 10. Scripts utiles

- Racine: `npm run dev`, `npm run build`, `npm run start`, `npm run install:all`
- Frontend (`client/`): `npm run dev`, `npm run build`, `npm run preview`, `npm run lint`
- Backend (`server/`): `npm run dev`, `npm run start`

---

## EN - Complete Guide

### 1. Tech stack

- Frontend: React 18 + TypeScript + Vite
- Backend: Node.js + Express
- Database: Supabase (PostgreSQL)
- Tooling: ESLint, TailwindCSS, concurrently

### 2. Project structure

```text
WebApp/
|-- client/                  # React frontend
|-- server/                  # Express API
|-- package.json             # Root scripts
|-- render.yaml              # Render config (backend)
`-- vercel.json              # Vercel config (frontend)
```

### 3. Prerequisites

- Node.js 18+ (recommended: Node 20 LTS)
- npm 9+
- An active Supabase project

Check:

```bash
node -v
npm -v
```

### 4. Local installation

From the repository root:

```bash
npm run install:all
```

### 5. Environment variables (backend)

Create `server/.env`:

```env
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_KEY=YOUR_SUPABASE_KEY
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

`SUPABASE_URL` and `SUPABASE_KEY` are required.

### 6. Run locally

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- API: `http://localhost:3001`
- Health check: `GET http://localhost:3001/api/health`

### 7. Production build

```bash
npm run build
```

The frontend output is generated in `client/dist`.

### 8. Recommended web hosting deployment (Vercel + Render)

#### 8.1 Deploy backend on Render

1. Create a Render Web Service connected to this repository.
2. Use `render.yaml` (Blueprint) or configure manually:
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Health Check Path: `/api/health`
3. Add environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `NODE_ENV=production`
   - `CLIENT_URL=https://<your-vercel-frontend>.vercel.app`
4. Deploy and keep the backend URL, e.g. `https://katymurr-api.onrender.com`.

#### 8.2 Deploy frontend on Vercel

1. Import the repository in Vercel.
2. Configure:
   - Framework: Vite
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. `vercel.json` rewrites `/api/*` to the Render backend.
4. Deploy and get your frontend URL.

#### 8.3 Final wiring

1. Update Render `CLIENT_URL` with the final Vercel URL.
2. Verify:
   - Frontend loads correctly.
   - `/api/*` calls are proxied from Vercel to Render.
   - `GET /api/health` returns OK.

### 9. VPS hosting option (alternative)

1. Build frontend (`npm run build`) and serve `client/dist` with Nginx.
2. Run backend `server/index.js` with PM2/systemd.
3. Configure reverse proxy:
   - `https://yourdomain.com` -> static frontend
   - `https://yourdomain.com/api` -> Node backend
4. Set the same backend environment variables listed above.

### 10. Useful scripts

- Root: `npm run dev`, `npm run build`, `npm run start`, `npm run install:all`
- Frontend (`client/`): `npm run dev`, `npm run build`, `npm run preview`, `npm run lint`
- Backend (`server/`): `npm run dev`, `npm run start`

---

Security reminder: never commit secrets (`server/.env`, private Supabase keys).
