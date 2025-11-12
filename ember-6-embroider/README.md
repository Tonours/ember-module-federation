# Ember 6 + Embroider + Module Federation

POC d'architecture Module Federation mixte avec Ember 6 (Embroider + Vite) et React.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│   React Shell (Host) - Port 3000                    │
│   - Module Federation Host                          │
│   - React Router pour navigation globale            │
│   - Consomme 3 remotes via Module Federation        │
└──────────────┬──────────────────────────────────────┘
               │
               ├─── Module Federation ────┐
               │                           │
     ┌─────────▼────────┐     ┌───────────▼──────────┐
     │  React MFE       │     │  React MFE           │
     │  mf-profile      │     │  mf-blog-article     │
     │  Port: 3001      │     │  Port: 3002          │
     └──────────────────┘     └──────────────────────┘
               │
     ┌─────────▼────────────────────┐
     │  Ember 6 MFE (NOUVEAU!)      │
     │  ember-blog                  │
     │  Port: 4200                  │
     │  - Embroider + Vite          │
     │  - Module Federation         │
     │  - Routes: /blog/*           │
     └──────────────────────────────┘
```

## ✨ Différences clés avec ember-4-brocoli

| Aspect | ember-4-brocoli | ember-6-embroider |
|--------|----------------|-------------------|
| **Ember version** | Ember 4.12 | Ember 6.8 |
| **Build tool** | Broccoli | Embroider + Vite |
| **Intégration** | iframe + postMessage | Module Federation |
| **Communication** | postMessage events | Callbacks React |
| **Routing** | Séparé (iframe) | Intégré (MF) |
| **Performance** | 2 apps séparées | 1 app avec lazy loading |

## 🚀 Démarrage rapide

### Prérequis

- Node.js >= 20
- npm >= 9
- Docker & Docker Compose (pour production)

### Installation

```bash
# Cloner et installer
cd ember-6-embroider
npm install

# Copier .env
cp .env.example .env

# Démarrer la base de données
cd /Users/aguimard/work/ember-module-federation
docker-compose -f docker-compose-ember6.yml up -d postgres

# Générer Prisma client
cd ember-6-embroider
npm run prisma:generate

# Pousser le schéma DB
npm run prisma:push

# Seed la base (optionnel)
npm run prisma:seed
```

### Développement

```bash
# Démarrer tous les services
npm run dev:all

# Ou démarrer individuellement:
npm run dev:api          # API: http://localhost:3333
npm run dev:ember        # Ember MFE: http://localhost:4200
npm run dev:shell        # React Shell: http://localhost:3000
```

**URLs de développement:**
- React Shell (Host): http://localhost:3000
- API: http://localhost:3333
- Ember Blog MFE: http://localhost:4200
- Profile MFE: http://localhost:3001
- Blog Article MFE: http://localhost:3002

### Production (Docker)

```bash
# Build et démarrer tous les services (depuis la racine du monorepo)
cd /Users/aguimard/work/ember-module-federation
docker-compose -f docker-compose-ember6.yml up --build

# Ou en arrière-plan
docker-compose -f docker-compose-ember6.yml up -d --build
```

## 📂 Structure du projet

```
ember-6-embroider/
├── apps/
│   ├── api/                 # Express API + Prisma
│   ├── ember-app/           # Ember 6 MFE (blog)
│   │   ├── app/
│   │   │   ├── mount.js     # Point d'entrée Module Federation
│   │   │   ├── routes/blog/ # Routes blog (index, category, tag)
│   │   │   └── services/
│   │   │       └── navigation.js  # Service pour navigation React
│   │   ├── vite.config.mjs  # Config Vite + Module Federation
│   │   └── Dockerfile
│   ├── mf-profile/          # React MFE (profile)
│   ├── mf-blog-article/     # React MFE (article detail)
│   └── react-shell/         # React Shell (host)
│       ├── src/
│       │   └── components/
│       │       └── EmberBlogApp.tsx  # Wrapper Ember MFE
│       └── webpack.config.js
├── packages/
│   ├── ui/                  # Composants React partagés
│   └── data/                # API clients + types
├── ../docker-compose-ember6.yml  # Docker Compose (à la racine du monorepo)
├── package.json             # Nx monorepo root
└── nx.json                  # Nx configuration
```

## 🔑 Points clés de l'implémentation

### 1. Ember MFE avec Module Federation (Vite)

**vite.config.mjs:**
```js
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    // ... Embroider plugins
    federation({
      name: 'emberBlog',
      filename: 'remoteEntry.js',
      exposes: {
        './BlogApp': './app/mount.js',
      },
    }),
  ],
});
```

**app/mount.js:**
```js
export async function mount(containerElement, options) {
  // Monte l'application Ember dans un conteneur React
  // Configure le callback de navigation vers React Router
}
```

### 2. Wrapper React pour Ember MFE

**EmberBlogApp.tsx:**
```tsx
export function EmberBlogApp() {
  useEffect(() => {
    // Import dynamique du remote Ember
    const { mount } = await import('emberBlog/BlogApp');

    // Monte Ember avec callback navigation
    await mount(containerRef.current, {
      onNavigateToArticle: (id) => navigate(`/article/${id}`),
    });
  }, []);

  return <div ref={containerRef} />;
}
```

### 3. Configuration webpack du Shell

**webpack.config.js:**
```js
new ModuleFederationPlugin({
  name: 'shell',
  remotes: {
    emberBlog: 'emberBlog@http://localhost:4200/remoteEntry.js',
    profile: 'profile@/mf-profile/remoteEntry.js',
    blogArticle: 'blogArticle@/mf-blog/remoteEntry.js',
  },
  shared: {
    react: { singleton: true, eager: true },
    'react-dom': { singleton: true, eager: true },
  },
});
```

## 🧪 Tests

```bash
# Lint all apps
npm run lint

# Run tests
npm run test

# Test build
npm run build
```

## 📦 Déploiement

### Avec Docker Compose

Le `docker-compose-ember6.yml` (situé à la racine du monorepo) configure:
- PostgreSQL 16
- 5 services Nginx (API, 2 React MFEs, 1 Ember MFE, 1 React Shell)
- Réseaux et volumes

### Variables d'environnement

Voir `.env.example` pour toutes les variables disponibles.

**Importantes:**
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret pour JWT tokens
- `CORS_ORIGIN`: Origin autorisée pour CORS
- `*_REMOTE_URL`: URLs des remotes Module Federation

## 🐛 Troubleshooting

### Ember MFE ne charge pas

1. Vérifier que le serveur Ember tourne sur port 4200
2. Vérifier CORS dans nginx.conf
3. Vérifier remoteEntry.js accessible: http://localhost:4200/remoteEntry.js

### Erreurs de navigation

Le service `navigation.js` dans Ember doit recevoir le callback depuis React.
Vérifier que `EmberBlogApp` passe bien `onNavigateToArticle`.

### Build Vite échoue

Ember 6 requiert Node >= 20. Vérifier votre version:
```bash
node --version
```

## 📚 Documentation additionnelle

- [Embroider Docs](https://github.com/embroider-build/embroider)
- [Module Federation](https://module-federation.io/)
- [@originjs/vite-plugin-federation](https://github.com/originjs/vite-plugin-federation)
- [Ember 6 Release Notes](https://github.com/emberjs/ember.js/releases)

## 🎯 Prochaines étapes

- [ ] Tests E2E pour navigation Ember ↔ React
- [ ] Performance benchmarking vs iframe
- [ ] HMR pour Ember MFE
- [ ] TypeScript types pour Module Federation
- [ ] Production deployment guide

## 📝 Notes

**Avantages Module Federation vs iframe:**
✅ Meilleure intégration navigation
✅ Partage de contexte possible
✅ Moins d'overhead mémoire
✅ Chargement lazy plus granulaire

**Défis rencontrés:**
⚠️ Ember runtime volumineux (complet chargé)
⚠️ Vite + Module Federation moins mature que webpack
⚠️ Types TypeScript entre Ember et React
⚠️ Lifecycle Ember dans environnement React

## 📄 Licence

MIT
