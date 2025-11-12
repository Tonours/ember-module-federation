# Module Federation POC - React + Ember 4

Ce projet démontre une architecture de micro-frontends utilisant Module Federation avec React et Ember 4.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React Shell (Host)                        │
│                    http://localhost:3000                     │
│                                                              │
│  ┌────────────────┐  ┌──────────────────┐  ┌─────────────┐│
│  │ Profile MFE    │  │ Blog Article MFE │  │  Ember 4    ││
│  │  (Remote)      │  │    (Remote)      │  │  (iframe)   ││
│  │  Port 3001     │  │    Port 3002     │  │  Port 4200  ││
│  └────────────────┘  └──────────────────┘  └─────────────┘│
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   REST API      │
                    │  (JSON:API)     │
                    │   Port 3333     │
                    └─────────────────┘
```

## Structure du Projet

```
.
├── apps/
│   ├── react-shell/                    # Application hôte React (Module Federation Host)
│   ├── remote-module-federation-profile/   # MFE Profile (Remote)
│   ├── remote-module-federation-blog-article/ # MFE Blog Articles (Remote)
│   ├── ember-4/                        # Application Ember 4 legacy
│   └── api/                            # API REST avec authentification JWT
├── packages/
│   ├── ui/                             # Composants UI partagés (React + Tailwind)
│   └── data/                           # Clients API et types TypeScript partagés
├── package.json                        # Configuration npm workspaces
└── tsconfig.base.json                  # Configuration TypeScript partagée
```

## Prérequis

- Node.js >= 18.0.0
- npm >= 9.0.0

## Installation

### 1. Installer toutes les dépendances

À la racine du projet:

```bash
npm install
```

### 2. Setup de la base de données (API)

```bash
cd apps/api
npx prisma generate
npx prisma db push
cd ../..
```

## Démarrage

### Option 1: Démarrer toutes les applications (Recommandé)

```bash
npm run dev:all
```

Cela démarre:
- React Shell sur http://localhost:3000
- Profile MFE sur http://localhost:3001
- Blog Article MFE sur http://localhost:3002
- Ember 4 sur http://localhost:4200
- API REST sur http://localhost:3333

### Option 2: Démarrer individuellement

#### React Shell (Host)
```bash
npm run dev:shell
```

#### Profile MFE (Remote)
```bash
npm run dev:profile
```

#### Blog Article MFE (Remote)
```bash
npm run dev:blog
```

#### Ember 4
```bash
npm run dev:ember
```

#### API REST
```bash
npm run dev:api
```

## Accès aux Applications

- **React Shell**: http://localhost:3000
- **Profile MFE**: http://localhost:3001 (peut être ouvert indépendamment)
- **Blog Article MFE**: http://localhost:3002 (peut être ouvert indépendamment)
- **Ember 4**: http://localhost:4200 (peut être ouvert indépendamment)
- **API REST**: http://localhost:3333
  - Health check: http://localhost:3333/health

## API REST - Endpoints

Voir le fichier complet du README pour plus de détails sur les endpoints API (auth + articles avec format JSON:API).

## Technologies Utilisées

### Frontend
- **React 18** + **Vite** + **Module Federation** + **React Router v6** + **Tailwind CSS**
- **Ember 4.12** avec Broccoli

### Backend
- **Node.js** + **Express** + **Prisma** + **SQLite** + **JWT** + **Zod**

### Shared Packages
- **@packages/ui** - Composants React partagés
- **@packages/data** - Types TypeScript & API clients

## Scripts Disponibles

- `npm run dev:all` - Lance toutes les applications en parallèle
- `npm run build` - Build toutes les applications
- `npm run lint` - Lance ESLint
- `npm run type-check` - Vérifie les types TypeScript

## License

MIT
