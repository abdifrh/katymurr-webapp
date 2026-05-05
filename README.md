# Katy Murr WebApp

Application web full-stack pour `katymurr.com` (coaching, interpretation, writing) avec un frontend React/Vite et une API Express connectee a Supabase.

## 1. Stack technique

- Frontend: React 18 + TypeScript + Vite
- Backend: Node.js + Express
- Base de donnees: Supabase (PostgreSQL)
- Outils: ESLint, TailwindCSS, concurrently

## 2. Architecture du projet

```text
WebApp/
|-- client/                  # Frontend React
|   |-- public/
|   |-- src/
|   |-- package.json
|   `-- ...
|-- server/                  # API Express + logique metier
|   |-- routes/
|   |-- middleware/
|   |-- data/
|   |-- scripts/
|   |-- sql/
|   |-- package.json
|   `-- index.js
|-- package.json             # Scripts racine (orchestration)
|-- render.yaml              # Config Render
`-- vercel.json              # Config Vercel
```

## 3. Prerequis

- Node.js 18+ (recommande: Node 20 LTS)
- npm 9+
- Un projet Supabase actif

Verification rapide:

```bash
node -v
npm -v
```

## 4. Installation

Depuis la racine du projet:

```bash
npm run install:all
```

Cette commande installe:

- les dependances racine
- les dependances backend (`server/`)
- les dependances frontend (`client/`)

## 5. Configuration des variables d'environnement

Le backend lit les variables dans `server/.env`.

Exemple minimal:

```env
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_KEY=YOUR_SUPABASE_SERVICE_ROLE_OR_ANON_KEY
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Notes:

- `SUPABASE_URL` et `SUPABASE_KEY` sont obligatoires (sinon le serveur s'arrete au demarrage).
- En local, le frontend tourne par defaut sur `http://localhost:5173`.
- `CLIENT_URL` permet d'autoriser le domaine frontend via CORS.

## 6. Lancer le projet en local

Depuis la racine:

```bash
npm run dev
```

Cela lance en parallele:

- API Express: `http://localhost:3001`
- Frontend Vite: `http://localhost:5173`

Healthcheck API:

```text
GET http://localhost:3001/api/health
```

## 7. Scripts disponibles

### Racine

- `npm run dev`: lance frontend + backend
- `npm run dev:server`: lance uniquement le backend
- `npm run dev:client`: lance uniquement le frontend
- `npm run build`: build du frontend
- `npm run start`: lance le backend en mode start
- `npm run install:all`: installe toutes les dependances

### Frontend (`client/`)

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`

### Backend (`server/`)

- `npm run dev`
- `npm run start`


## 8. Build et production

### Build frontend

```bash
npm run build
```

Le build est genere dans `client/dist/`.

### Demarrage backend

```bash
npm run start
```

## 9. Deploiement

Le repo contient deja:

- `render.yaml` (pipeline/deploiement Render)
- `vercel.json` (regles de deploiement Vercel)

Strategie classique:

- Frontend deploye sur Vercel
- Backend deploye sur Render
- Variables d'environnement configurees sur chaque plateforme

## 10. Publication sur GitHub

Exemple de premiere publication:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<user>/<repo>.git
git push -u origin main
```

Avant de push:

- verifier que `node_modules/` n'est pas versionne
- verifier que `server/.env` n'est pas commit
- verifier le contenu de `.gitignore`

## 11. Bonnes pratiques

- Ne jamais commiter de secrets (`.env`, cles Supabase privees).
- Garder les scripts SQL dates et nommes clairement.
- Tester `npm run dev` et `npm run build` avant push.
- Faire des commits petits et explicites.

## 12. Depannage rapide

- Erreur `Missing Supabase credentials`: verifier `server/.env`.
- Erreur CORS en local: verifier `CLIENT_URL` et l'URL frontend.
- Frontend vide/apercu casse: relancer un build propre et verifier les imports dans `client/src`.

---

Projet maintenu pour le site `katymurr.com`.