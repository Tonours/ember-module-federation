import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import { MainLayout } from './layouts/MainLayout';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ProfileWrapper } from './components/ProfileWrapper';
import { BlogArticleWrapper } from './components/BlogArticleWrapper';
import { EmberBlogApp } from './components/EmberBlogApp';
import { EmberBlogCategoryWrapper } from './components/EmberBlogCategoryWrapper';
import { EmberBlogTagWrapper } from './components/EmberBlogTagWrapper';
import { Spinner } from '@packages/ui';
import { ErrorBoundary } from './components/ErrorBoundary';

// Lazy load EditArticle from MFE
const EditArticle = lazy(() => import('blogArticle/EditArticle'));

function AppRoutes() {

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />

        {/* Public blog routes - Ember MFE via Module Federation */}
        <Route path="blog" element={<EmberBlogApp initialRoute="/" />} />
        <Route path="blog/category/:slug" element={<EmberBlogCategoryWrapper />} />
        <Route path="blog/tag/:slug" element={<EmberBlogTagWrapper />} />
        {/* Blog article detail - React MFE */}
        <Route
          path="blog/article/:articleId"
          element={
            <ErrorBoundary>
              <BlogArticleWrapper />
            </ErrorBoundary>
          }
        />

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
