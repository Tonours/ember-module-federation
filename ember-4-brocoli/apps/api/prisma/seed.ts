import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.articleTag.deleteMany();
  await prisma.article.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  console.log('📝 Creating users...');
  const users = await Promise.all([
    prisma.user.create({
      data: {
        id: 'user-1',
        name: 'Alice Johnson',
        email: 'alice@example.com',
        password: await bcrypt.hash('password123', 10),
      },
    }),
    prisma.user.create({
      data: {
        id: 'user-2',
        name: 'Bob Smith',
        email: 'bob@example.com',
        password: await bcrypt.hash('password123', 10),
      },
    }),
    prisma.user.create({
      data: {
        id: 'user-3',
        name: 'Charlie Brown',
        email: 'charlie@example.com',
        password: await bcrypt.hash('password123', 10),
      },
    }),
    prisma.user.create({
      data: {
        id: 'user-4',
        name: 'Diana Prince',
        email: 'diana@example.com',
        password: await bcrypt.hash('password123', 10),
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create categories
  console.log('🏷️  Creating categories...');
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Frontend',
        slug: 'frontend',
        color: '#3b82f6', // blue
      },
    }),
    prisma.category.create({
      data: {
        name: 'Backend',
        slug: 'backend',
        color: '#10b981', // green
      },
    }),
    prisma.category.create({
      data: {
        name: 'DevOps',
        slug: 'devops',
        color: '#f59e0b', // orange
      },
    }),
    prisma.category.create({
      data: {
        name: 'Architecture',
        slug: 'architecture',
        color: '#8b5cf6', // purple
      },
    }),
    prisma.category.create({
      data: {
        name: 'Performance',
        slug: 'performance',
        color: '#ef4444', // red
      },
    }),
    prisma.category.create({
      data: {
        name: 'Security',
        slug: 'security',
        color: '#dc2626', // dark red
      },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // Create tags
  console.log('🔖 Creating tags...');
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: 'React', slug: 'react' } }),
    prisma.tag.create({ data: { name: 'TypeScript', slug: 'typescript' } }),
    prisma.tag.create({ data: { name: 'Webpack', slug: 'webpack' } }),
    prisma.tag.create({ data: { name: 'Vite', slug: 'vite' } }),
    prisma.tag.create({ data: { name: 'Ember', slug: 'ember' } }),
    prisma.tag.create({ data: { name: 'Module Federation', slug: 'module-federation' } }),
    prisma.tag.create({ data: { name: 'CSS', slug: 'css' } }),
    prisma.tag.create({ data: { name: 'Testing', slug: 'testing' } }),
    prisma.tag.create({ data: { name: 'GraphQL', slug: 'graphql' } }),
    prisma.tag.create({ data: { name: 'REST', slug: 'rest' } }),
    prisma.tag.create({ data: { name: 'Docker', slug: 'docker' } }),
    prisma.tag.create({ data: { name: 'Accessibility', slug: 'accessibility' } }),
    prisma.tag.create({ data: { name: 'WebAssembly', slug: 'webassembly' } }),
    prisma.tag.create({ data: { name: 'PWA', slug: 'pwa' } }),
    prisma.tag.create({ data: { name: 'Monorepo', slug: 'monorepo' } }),
  ]);

  console.log(`✅ Created ${tags.length} tags`);

  // Helper to get category and tags by slug
  const getCat = (slug: string) => categories.find((c) => c.slug === slug)!.id;
  const getTag = (slug: string) => tags.find((t) => t.slug === slug)!.id;

  // Create articles with categories and tags
  console.log('📚 Creating articles...');
  const articlesData = [
    {
      id: '1',
      title: 'Getting Started with Module Federation',
      content:
        'Module Federation is a powerful feature in Webpack 5 that allows multiple separate builds to form a single application. This article explores the fundamentals and best practices.\n\nModule Federation enables multiple independent builds to work together as a single application. Each build can expose and consume code from other builds, creating a powerful micro-frontend architecture.\n\nKey benefits include:\n- Independent deployments\n- Team autonomy\n- Technology agnosticism\n- Improved scalability\n\nThis approach is perfect for large-scale applications where different teams need to work independently while maintaining a cohesive user experience.',
      authorId: 'user-1',
      categoryId: getCat('architecture'),
      tagSlugs: ['webpack', 'module-federation', 'react'],
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      title: 'Building Micro-Frontends with Vite',
      content:
        'Learn how to build scalable micro-frontend architecture using Vite and Module Federation plugin. We cover setup, configuration, and deployment strategies.\n\nVite offers exceptional developer experience with lightning-fast hot module replacement and optimized builds. Combined with Module Federation, it becomes a powerful tool for building micro-frontends.\n\nIn this comprehensive guide, we explore:\n- Setting up Vite with Module Federation\n- Configuring shared dependencies\n- Managing remote modules\n- Production deployment strategies\n\nThe combination of Vite and Module Federation provides the perfect balance between developer experience and production performance.',
      authorId: 'user-2',
      categoryId: getCat('architecture'),
      tagSlugs: ['vite', 'module-federation', 'react'],
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20'),
    },
    {
      id: '3',
      title: 'Integrating Ember with React',
      content:
        'A comprehensive guide on integrating legacy Ember applications with modern React micro-frontends. We explore iframe integration and postMessage communication.\n\nMany organizations have substantial investments in Ember applications that continue to deliver value. Rather than a costly rewrite, a gradual migration strategy using micro-frontends can be more practical.\n\nThis guide covers:\n- Embedding Ember in iframes\n- PostMessage communication patterns\n- State synchronization\n- Progressive migration strategies\n- Best practices for hybrid architectures\n\nBy following these patterns, you can modernize your application incrementally while maintaining business continuity.',
      authorId: 'user-1',
      categoryId: getCat('architecture'),
      tagSlugs: ['ember', 'react', 'module-federation'],
      createdAt: new Date('2024-01-25'),
      updatedAt: new Date('2024-01-25'),
    },
    {
      id: '4',
      title: 'TypeScript Best Practices for Large Applications',
      content:
        "Découvrez les meilleures pratiques TypeScript pour gérer efficacement de grandes applications. Du strict mode aux types avancés, en passant par l'organisation du code.",
      authorId: 'user-3',
      categoryId: getCat('frontend'),
      tagSlugs: ['typescript'],
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-01'),
    },
    {
      id: '5',
      title: 'React Server Components: The Future of React',
      content:
        "Explorez les React Server Components et comment ils révolutionnent le développement d'applications React en permettant le rendu côté serveur de manière granulaire.",
      authorId: 'user-2',
      categoryId: getCat('frontend'),
      tagSlugs: ['react'],
      createdAt: new Date('2024-02-05'),
      updatedAt: new Date('2024-02-05'),
    },
    {
      id: '6',
      title: 'Optimizing Bundle Size in Modern Web Apps',
      content:
        'Techniques avancées pour réduire la taille de vos bundles JavaScript. Code splitting, tree shaking, et lazy loading expliqués en détail.',
      authorId: 'user-1',
      categoryId: getCat('performance'),
      tagSlugs: ['webpack', 'vite'],
      createdAt: new Date('2024-02-10'),
      updatedAt: new Date('2024-02-10'),
    },
    {
      id: '7',
      title: 'CSS-in-JS vs Tailwind: Making the Right Choice',
      content:
        "Comparaison approfondie entre CSS-in-JS et Tailwind CSS. Quand utiliser l'un plutôt que l'autre ? Avantages et inconvénients de chaque approche.",
      authorId: 'user-4',
      categoryId: getCat('frontend'),
      tagSlugs: ['css', 'react'],
      createdAt: new Date('2024-02-15'),
      updatedAt: new Date('2024-02-15'),
    },
    {
      id: '8',
      title: 'State Management in 2024: Redux vs Zustand',
      content:
        "Une analyse comparative des solutions de gestion d'état modernes. Redux Toolkit, Zustand, Jotai : comment choisir la bonne solution pour votre projet.",
      authorId: 'user-2',
      categoryId: getCat('frontend'),
      tagSlugs: ['react', 'typescript'],
      createdAt: new Date('2024-02-20'),
      updatedAt: new Date('2024-02-20'),
    },
    {
      id: '9',
      title: 'Testing Strategies for Micro-Frontends',
      content:
        "Comment tester efficacement une architecture micro-frontend ? Tests unitaires, d'intégration et end-to-end pour des applications distribuées.",
      authorId: 'user-3',
      categoryId: getCat('architecture'),
      tagSlugs: ['testing', 'module-federation'],
      createdAt: new Date('2024-02-25'),
      updatedAt: new Date('2024-02-25'),
    },
    {
      id: '10',
      title: 'GraphQL vs REST: A 2024 Perspective',
      content:
        "REST et GraphQL en 2024 : quelle architecture API choisir ? Analyse des cas d'usage, performance, et écosystème de chaque approche.",
      authorId: 'user-1',
      categoryId: getCat('backend'),
      tagSlugs: ['graphql', 'rest'],
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-03-01'),
    },
    {
      id: '11',
      title: 'Monorepos with npm Workspaces',
      content:
        "Guide complet sur l'utilisation des npm workspaces pour gérer des monorepos. Configuration, scripts, et bonnes pratiques pour une productivité maximale.",
      authorId: 'user-4',
      categoryId: getCat('devops'),
      tagSlugs: ['monorepo'],
      createdAt: new Date('2024-03-05'),
      updatedAt: new Date('2024-03-05'),
    },
    {
      id: '12',
      title: 'Web Vitals: Measuring Real User Performance',
      content:
        'Comprendre et optimiser les Core Web Vitals. LCP, FID, CLS : comment améliorer ces métriques pour une meilleure expérience utilisateur.',
      authorId: 'user-2',
      categoryId: getCat('performance'),
      tagSlugs: ['react'],
      createdAt: new Date('2024-03-10'),
      updatedAt: new Date('2024-03-10'),
    },
    {
      id: '13',
      title: 'Progressive Web Apps in 2024',
      content:
        'Les PWAs ont-elles encore du sens en 2024 ? Service workers, manifests, et stratégies de cache pour des applications web modernes.',
      authorId: 'user-3',
      categoryId: getCat('frontend'),
      tagSlugs: ['pwa'],
      createdAt: new Date('2024-03-15'),
      updatedAt: new Date('2024-03-15'),
    },
    {
      id: '14',
      title: 'Docker for Frontend Developers',
      content:
        'Introduction à Docker pour les développeurs frontend. Containerisation de vos applications, multi-stage builds, et déploiement simplifié.',
      authorId: 'user-1',
      categoryId: getCat('devops'),
      tagSlugs: ['docker'],
      createdAt: new Date('2024-03-20'),
      updatedAt: new Date('2024-03-20'),
    },
    {
      id: '15',
      title: 'Accessibility: Building Inclusive Web Apps',
      content:
        "Guide pratique pour rendre vos applications web accessibles. ARIA, navigation au clavier, lecteurs d'écran, et tests d'accessibilité.",
      authorId: 'user-4',
      categoryId: getCat('frontend'),
      tagSlugs: ['accessibility'],
      createdAt: new Date('2024-03-25'),
      updatedAt: new Date('2024-03-25'),
    },
    {
      id: '16',
      title: 'WebAssembly: When and Why to Use It',
      content:
        "WebAssembly démystifié. Cas d'usage pratiques, langages supportés, et intégration avec JavaScript pour des performances optimales.",
      authorId: 'user-2',
      categoryId: getCat('performance'),
      tagSlugs: ['webassembly'],
      createdAt: new Date('2024-04-01'),
      updatedAt: new Date('2024-04-01'),
    },
    {
      id: '17',
      title: 'Security Best Practices for SPAs',
      content:
        "Sécuriser vos Single Page Applications. XSS, CSRF, authentification JWT, et gestion sécurisée des tokens : tout ce qu'il faut savoir.",
      authorId: 'user-3',
      categoryId: getCat('security'),
      tagSlugs: ['react', 'typescript'],
      createdAt: new Date('2024-04-05'),
      updatedAt: new Date('2024-04-05'),
    },
    {
      id: '18',
      title: 'CI/CD Pipelines for Frontend Projects',
      content:
        'Automatiser le déploiement de vos applications frontend. GitHub Actions, tests automatisés, et déploiement continu expliqués étape par étape.',
      authorId: 'user-1',
      categoryId: getCat('devops'),
      tagSlugs: ['docker', 'testing'],
      createdAt: new Date('2024-04-10'),
      updatedAt: new Date('2024-04-10'),
    },
    {
      id: '19',
      title: 'Edge Computing and the Future of Web Apps',
      content:
        "Comment l'edge computing transforme le développement web. Cloudflare Workers, Vercel Edge Functions, et architectures distribuées.",
      authorId: 'user-4',
      categoryId: getCat('architecture'),
      tagSlugs: ['typescript'],
      createdAt: new Date('2024-04-15'),
      updatedAt: new Date('2024-04-15'),
    },
    {
      id: '20',
      title: 'Design Systems: From Theory to Practice',
      content:
        'Construire et maintenir un design system efficace. Composants, tokens de design, documentation, et gouvernance pour des équipes produit scalables.',
      authorId: 'user-2',
      categoryId: getCat('frontend'),
      tagSlugs: ['react', 'css'],
      createdAt: new Date('2024-04-20'),
      updatedAt: new Date('2024-04-20'),
    },
  ];

  for (const articleData of articlesData) {
    const { tagSlugs, ...articleFields } = articleData;

    const article = await prisma.article.create({
      data: articleFields,
    });

    // Create ArticleTag entries
    for (const tagSlug of tagSlugs) {
      await prisma.articleTag.create({
        data: {
          articleId: article.id,
          tagId: getTag(tagSlug),
        },
      });
    }
  }

  console.log(`✅ Created ${articlesData.length} articles with tags`);
  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
