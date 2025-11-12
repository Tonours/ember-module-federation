import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

interface EmberBlogAppProps {
  /**
   * Route path within Ember app (e.g., '/', '/category/tech', '/tag/javascript')
   * This is passed as initialURL to Ember Router
   */
  initialRoute?: string;
}

export function EmberBlogApp({ initialRoute = '/' }: EmberBlogAppProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const emberInstanceRef = useRef<any>(null);
  const cssLinksRef = useRef<HTMLLinkElement[]>([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    let mounted = true;

    async function mountEmberApp() {
      if (!containerRef.current) return;

      try {
        setIsLoading(true);
        setError(null);

        // Polyfill window.require for Ember (ESM build doesn't need AMD loader)
        if (!window.require) {
          (window as any).require = (window as any).require || function(moduleName: string) {
            console.warn('[require polyfill] Module requested:', moduleName);
            return {};
          };
          (window as any).requirejs = (window as any).require;
          (window as any).define = (window as any).define || function() {};
          (window as any).define.amd = true;
        }

        const emberBaseUrl = process.env.EMBER_APP_URL || window.location.origin + '/ember-app';

        // Inject Ember CSS if not already present
        const cssUrls = [
          `${emberBaseUrl}/@embroider/virtual/vendor.css`,
          `${emberBaseUrl}/@embroider/virtual/app.css`,
        ];

        cssLinksRef.current = [];
        cssUrls.forEach((cssUrl) => {
          if (!document.querySelector(`link[href="${cssUrl}"]`)) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = cssUrl;
            document.head.appendChild(link);
            cssLinksRef.current.push(link);
          }
        });

        // Load Vite ESM remote (Webpack can't load ESM via Module Federation)
        const remoteUrl = `${emberBaseUrl}/remoteEntry.js`;
        const remoteModule = await import(/* webpackIgnore: true */ remoteUrl);

        // Initialize remote if needed
        if (remoteModule.init) {
          await remoteModule.init({});
        }

        // Get mount function from exposed module
        const mountModuleFactory = await remoteModule.get('./BlogApp');
        const mountModule = await mountModuleFactory();
        const { mount } = mountModule;

        if (!mount) {
          throw new Error('mount function not found in module');
        }

        if (!mounted) return;

        // Get query params for filters
        const categoryParam = searchParams.get('category') || undefined;
        const tagParam = searchParams.get('tag') || undefined;

        // Mount Ember app with navigation callbacks
        const instance = await mount(containerRef.current, {
          initialRoute,
          queryParams: {
            category: categoryParam,
            tag: tagParam,
          },
          onNavigateToArticle: (articleId: string) => {
            navigate(`/blog/article/${articleId}`);
          },
          onNavigateToCategory: (slug: string) => {
            navigate(`/blog/category/${slug}`);
          },
          onNavigateToTag: (slug: string) => {
            navigate(`/blog/tag/${slug}`);
          },
          onNavigateToBlog: () => {
            navigate('/blog');
          },
          onFilterChange: (filters: { category?: string; tag?: string }) => {
            // Update URL directly without triggering React Router re-render
            const newParams = new URLSearchParams();
            if (filters.category) newParams.set('category', filters.category);
            if (filters.tag) newParams.set('tag', filters.tag);

            const newUrl = newParams.toString()
              ? `${window.location.pathname}?${newParams.toString()}`
              : window.location.pathname;

            window.history.pushState({}, '', newUrl);
          },
        });

        if (!mounted) return;

        emberInstanceRef.current = instance;
        setIsLoading(false);
      } catch (err) {
        console.error('[EmberBlogApp] Failed to mount:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Unknown error');
          setIsLoading(false);
        }
      }
    }

    mountEmberApp();

    return () => {
      mounted = false;

      if (emberInstanceRef.current?.unmount) {
        emberInstanceRef.current.unmount().catch((err: Error) => {
          console.error('[EmberBlogApp] Failed to unmount:', err);
        });
        emberInstanceRef.current = null;
      }

      cssLinksRef.current.forEach((link) => {
        link.parentNode?.removeChild(link);
      });
      cssLinksRef.current = [];
    };
  }, [navigate, initialRoute]);

  return (
    <div style={{ minHeight: '400px', position: 'relative' }}>
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <h3 className="text-red-800 font-semibold">Error loading Ember Blog</h3>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      )}

      {isLoading && !error && (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading blog...</span>
        </div>
      )}

      <div
        ref={containerRef}
        className="ember-blog-container"
        style={{ display: isLoading || error ? 'none' : 'block' }}
      />
    </div>
  );
}
