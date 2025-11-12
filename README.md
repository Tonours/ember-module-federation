# Module Federation POC - Ember + React

Ce repository contient deux POC démontrant différentes approches pour intégrer Ember et React via Module Federation.

## Structure du repository

```
ember-module-federation/
├── ember-4-brocoli/       # POC Ember 4 + React avec iframe
└── ember-6-embroider/     # POC Ember 6 + React avec Module Federation natif
```

## Deux approches disponibles

### Approche 1 : Ember 4 + React (iframe)

**Dossier :** `ember-4-brocoli/`

Architecture React Shell avec MFE React et Ember 4 intégré via iframe + postMessage.

**Avantages :**
- Pas de migration Ember requise
- Risque faible
- Timeline courte (2-4 semaines)

**Compromis :**
- Communication via postMessage
- UX iframe (acceptable si bien implémentée)

**Technologies :**
- React 18 + Vite + Module Federation
- Ember 4.12 + Broccoli
- iframe + postMessage pour intégration

---

### Approche 2 : Ember 6 + Embroider (Module Federation)

**Dossier :** `ember-6-embroider/`

Architecture React Shell avec MFE React et Ember 6 tous intégrés via Module Federation.

**Avantages :**
- Module Federation natif partout
- UX optimale
- Meilleure intégration navigation

**Contraintes :**
- Requiert migration Ember 4→6
- Timeline longue (6-12 mois pour production)
- Risque plus élevé

**Technologies :**
- React 18 + Vite/Webpack + Module Federation
- Ember 6.8 + Embroider + Vite
- @originjs/vite-plugin-federation

---

## Démarrage rapide

### Option A : POC Ember 4 (iframe)

```bash
cd ember-4-brocoli
npm install
npm run dev:all
```

Voir [ember-4-brocoli/README.md](./ember-4-brocoli/README.md) pour la documentation complète.

### Option B : POC Ember 6 (Module Federation)

```bash
cd ember-6-embroider
npm install
cp .env.example .env

# Setup base de données
cd ..
docker-compose -f docker-compose-ember6.yml up -d postgres
cd ember-6-embroider
npm run prisma:generate
npm run prisma:push

# Démarrer
npm run dev:all
```

Voir [ember-6-embroider/README.md](./ember-6-embroider/README.md) pour la documentation complète.

---

## Comparaison technique

| Critère | Ember 4 (iframe) | Ember 6 (MF) |
|---------|------------------|--------------|
| **Migration Ember** | Non requise | Requiert Ember 4→6 |
| **Build system** | Broccoli | Embroider + Vite |
| **Intégration** | iframe + postMessage | Module Federation |
| **Communication** | Events postMessage | Callbacks React |
| **Routing** | Séparé | Intégré |
| **Timeline prod** | 2-4 semaines | 6-12 mois |
| **Risque** | Faible | Élevé |
| **Performance** | Bonne | Optimale |

---

## Recommandation

**Pour la majorité des cas : Commencer par Ember 4 (iframe)**

Raison : validation rapide, risque minimal, pas de migration Ember requise.

**Ember 6 (MF) si :**
- Migration Ember 4→6 déjà planifiée
- UX critique
- Budget confortable

---

## Stack technique

**Frontend commun :**
- React 18
- Vite
- React Router v6
- Tailwind CSS
- TypeScript

**Backend (ember-6-embroider uniquement) :**
- Node.js + Express
- Prisma + PostgreSQL/SQLite
- JWT Auth
- JSON:API format

---

## Objectif final

Les deux approches visent la même architecture finale :

```
React Host (Shell)
├── React MFE #1
├── React MFE #2
├── React MFE #N
└── (Ember progressivement retiré)
```

**Ember 4** : Chemin progressif, low-risk, ROI rapide
**Ember 6** : Chemin direct, high-risk, UX optimale

---

## Licence

MIT
