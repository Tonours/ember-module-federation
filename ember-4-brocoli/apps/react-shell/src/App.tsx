import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useSearchParams,
  useParams,
} from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import { MainLayout } from './layouts/MainLayout';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ProfileWrapper } from './components/ProfileWrapper';
import { BlogArticleWrapper } from './components/BlogArticleWrapper';
import { Spinner } from '@packages/ui';
import { ErrorBoundary } from './components/ErrorBoundary';

// Lazy load EditArticle from MFE
const EditArticle = lazy(() => import('blogArticle/EditArticle'));

function BlogCategoryIframe() {
  const { slug } = useParams<{ slug: string }>();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState<number>(800);
  const navigate = useNavigate();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Use same origin for iframe validation in production (Docker)
      // Falls back to env var for dev with different ports
      const allowedOrigin = process.env.ALLOWED_IFRAME_ORIGIN || window.location.origin;
      if (event.origin !== allowedOrigin) return;

      if (event.data?.type === 'NAVIGATE' && event.data?.payload?.path) {
        navigate(event.data.payload.path);
      }
      if (event.data?.type === 'RESIZE' && event.data?.payload?.height) {
        setIframeHeight(event.data.payload.height);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [navigate]);

  // Use relative path for production, env var for dev
  const emberBaseUrl = process.env.EMBER_APP_URL || `${window.location.origin}/ember`;
  const iframeSrc = `${emberBaseUrl}/blog/category/${slug}`;

  return (
    <div className="p-4">
      <iframe
        ref={iframeRef}
        src={iframeSrc}
        className="w-full border-0 rounded-lg shadow-md"
        style={{ height: `${iframeHeight}px` }}
        title="Blog Category - Ember Application"
      />
    </div>
  );
}

function BlogTagIframe() {
  const { slug } = useParams<{ slug: string }>();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState<number>(800);
  const navigate = useNavigate();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Use same origin for iframe validation in production (Docker)
      // Falls back to env var for dev with different ports
      const allowedOrigin = process.env.ALLOWED_IFRAME_ORIGIN || window.location.origin;
      if (event.origin !== allowedOrigin) return;

      if (event.data?.type === 'NAVIGATE' && event.data?.payload?.path) {
        navigate(event.data.payload.path);
      }
      if (event.data?.type === 'RESIZE' && event.data?.payload?.height) {
        setIframeHeight(event.data.payload.height);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [navigate]);

  // Use relative path for production, env var for dev
  const emberBaseUrl = process.env.EMBER_APP_URL || `${window.location.origin}/ember`;
  const iframeSrc = `${emberBaseUrl}/blog/tag/${slug}`;

  return (
    <div className="p-4">
      <iframe
        ref={iframeRef}
        src={iframeSrc}
        className="w-full border-0 rounded-lg shadow-md"
        style={{ height: `${iframeHeight}px` }}
        title="Blog Tag - Ember Application"
      />
    </div>
  );
}

function AppRoutes() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState<number>(800);

  // Build iframe URL only once on mount with initial search params
  const iframeSrc = React.useMemo(() => {
    // Use relative path for production, env var for dev
    const emberBaseUrl = process.env.EMBER_APP_URL || `${window.location.origin}/ember`;
    const base = `${emberBaseUrl}/blog`;
    const params = searchParams.toString();
    return params ? `${base}?${params}` : base;
  }, []); // Empty deps - only compute on mount

  useEffect(() => {
    // Listen for messages from Ember iframe
    const handleMessage = (event: MessageEvent) => {
      // Security: validate origin from environment
      // Use same origin for iframe validation in production (Docker)
      // Falls back to env var for dev with different ports
      const allowedOrigin = process.env.ALLOWED_IFRAME_ORIGIN || window.location.origin;
      if (event.origin !== allowedOrigin) {
        // Silently ignore messages from other origins (e.g., React DevTools)
        // Don't log to avoid console spam
        return;
      }

      // Handle navigation messages
      if (
        event.data?.type === 'NAVIGATE' &&
        event.data?.payload?.path &&
        typeof event.data.payload.path === 'string'
      ) {
        navigate(event.data.payload.path);
      }

      // Handle resize messages
      if (
        event.data?.type === 'RESIZE' &&
        event.data?.payload?.height &&
        typeof event.data.payload.height === 'number'
      ) {
        setIframeHeight(event.data.payload.height);
      }

      // Handle query params updates
      if (
        event.data?.type === 'UPDATE_QUERY_PARAMS' &&
        event.data?.payload?.params &&
        typeof event.data.payload.params === 'object'
      ) {
        const params = event.data.payload.params;
        const newSearchParams = new URLSearchParams();

        // Add all params that have values
        Object.entries(params).forEach(([key, value]) => {
          if (value) {
            newSearchParams.set(key, value as string);
          }
        });

        setSearchParams(newSearchParams);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [navigate, setSearchParams]);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />

        {/* Public blog routes */}
        <Route path="blog">
          {/* Blog list - Ember iframe */}
          <Route
            index
            element={
              <div className="p-4">
                <iframe
                  ref={iframeRef}
                  src={iframeSrc}
                  className="w-full border-0"
                  style={{ height: `${iframeHeight}px` }}
                  title="Blog - Ember Application"
                />
              </div>
            }
          />
          {/* Blog category - Ember iframe */}
          <Route path="category/:slug" element={<BlogCategoryIframe />} />
          {/* Blog tag - Ember iframe */}
          <Route path="tag/:slug" element={<BlogTagIframe />} />
          {/* Blog article detail - React MFE */}
          <Route
            path=":articleId"
            element={
              <ErrorBoundary>
                <BlogArticleWrapper />
              </ErrorBoundary>
            }
          />
        </Route>

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="profile/*"
            element={
              <ErrorBoundary>
                <ProfileWrapper />
              </ErrorBoundary>
            }
          />
          {/* Protected blog edit route */}
          <Route
            path="blog/:articleId/edit"
            element={
              <ErrorBoundary>
                <Suspense
                  fallback={
                    <div className="flex justify-center p-8">
                      <Spinner size="lg" />
                    </div>
                  }
                >
                  <EditArticle />
                </Suspense>
              </ErrorBoundary>
            }
          />
        </Route>
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
