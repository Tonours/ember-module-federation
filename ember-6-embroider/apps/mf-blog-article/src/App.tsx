import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, CardTitle, CardHeader, Button, Spinner } from '@packages/ui';
import { ApiClient, ArticlesApi, type Article } from '@packages/data';
import './index.css';

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

interface AppProps {
  user?: User | null;
  onDelete?: () => void;
  onEdit?: (articleId: string) => void;
}

function App({ user, onDelete, onEdit }: AppProps = {}) {
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!articleId) {
        setError('Article ID is missing');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const apiUrl = process.env.API_URL || `${window.location.origin}/api`;
        const apiClient = new ApiClient({
          baseUrl: apiUrl,
        });
        const articlesApi = new ArticlesApi(apiClient);
        const data = await articlesApi.getById(articleId);

        setArticle(data);
      } catch (err) {
        console.error('Error fetching article:', err);
        setError(err instanceof Error ? err.message : 'Failed to load article');

        // Fallback to mock data for demo
        const mockArticles = [
          {
            id: '1',
            title: 'Getting Started with Module Federation',
            content: 'Module Federation is a powerful feature in Webpack 5 that allows multiple separate builds to form a single application. This article explores the fundamentals and best practices.\n\nModule Federation enables multiple independent builds to work together as a single application. Each build can expose and consume code from other builds, creating a powerful micro-frontend architecture.\n\nKey benefits include:\n- Independent deployments\n- Team autonomy\n- Technology agnosticism\n- Improved scalability\n\nThis approach is perfect for large-scale applications where different teams need to work independently while maintaining a cohesive user experience.',
            authorId: 'user-1',
            createdAt: new Date('2024-01-15').toISOString(),
            updatedAt: new Date('2024-01-15').toISOString(),
          },
          {
            id: '2',
            title: 'Building Micro-Frontends with Vite',
            content: 'Learn how to build scalable micro-frontend architecture using Vite and Module Federation plugin. We cover setup, configuration, and deployment strategies.\n\nVite offers exceptional developer experience with lightning-fast hot module replacement and optimized builds. Combined with Module Federation, it becomes a powerful tool for building micro-frontends.\n\nIn this comprehensive guide, we explore:\n- Setting up Vite with Module Federation\n- Configuring shared dependencies\n- Managing remote modules\n- Production deployment strategies\n\nThe combination of Vite and Module Federation provides the perfect balance between developer experience and production performance.',
            authorId: 'user-2',
            createdAt: new Date('2024-01-20').toISOString(),
            updatedAt: new Date('2024-01-20').toISOString(),
          },
          {
            id: '3',
            title: 'Integrating Ember with React',
            content: 'A comprehensive guide on integrating legacy Ember applications with modern React micro-frontends. We explore iframe integration and postMessage communication.\n\nMany organizations have substantial investments in Ember applications that continue to deliver value. Rather than a costly rewrite, a gradual migration strategy using micro-frontends can be more practical.\n\nThis guide covers:\n- Embedding Ember in iframes\n- PostMessage communication patterns\n- State synchronization\n- Progressive migration strategies\n- Best practices for hybrid architectures\n\nBy following these patterns, you can modernize your application incrementally while maintaining business continuity.',
            authorId: 'user-1',
            createdAt: new Date('2024-01-25').toISOString(),
            updatedAt: new Date('2024-01-25').toISOString(),
          },
        ];

        const mockArticle = mockArticles.find(a => a.id === articleId);
        if (mockArticle) {
          setArticle(mockArticle);
          setError(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [articleId]);

  const handleBack = () => {
    navigate('/blog');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error && !article) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-900 mb-2">Error</h2>
          <p className="text-red-700">{error}</p>
          <Button variant="primary" onClick={handleBack} className="mt-4">
            ← Retour à la liste
          </Button>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Article not found</h2>
          <Button variant="primary" onClick={handleBack} className="mt-4">
            ← Retour à la liste
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Button variant="outline" onClick={handleBack} className="mb-6">
        ← Retour à la liste
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{article.title}</CardTitle>
        </CardHeader>
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm text-gray-500 pb-4 border-b">
            <span>Par l'auteur #{article.authorId}</span>
            <span>{new Date(article.createdAt).toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </div>

          {(article.category || (article.tags && article.tags.length > 0)) && (
            <div className="flex flex-wrap gap-2 pb-4">
              {article.category && (
                <button
                  onClick={() => navigate(`/blog/category/${article.category.slug}`)}
                  className="px-3 py-1 rounded-full text-xs font-medium text-white cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: article.category.color }}
                >
                  {article.category.name}
                </button>
              )}
              {article.tags && article.tags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => navigate(`/blog/tag/${tag.slug}`)}
                  className="px-3 py-1 rounded-full text-xs font-medium text-white bg-gray-600 cursor-pointer hover:opacity-80 transition-opacity"
                >
                  {tag.name}
                </button>
              ))}
            </div>
          )}

          <div className="prose max-w-none">
            {article.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-gray-700 leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          {user && article && user.id === article.authorId && (
            <div className="pt-6 border-t">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit && articleId && onEdit(articleId)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setShowDeleteModal(true)}
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Confirm Delete</h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this article? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={async () => {
                  if (!articleId) return;
                  setDeleting(true);
                  try {
                    const apiUrl = process.env.API_URL || '/api';
                    const response = await fetch(`${apiUrl}/articles/${articleId}`, {
                      method: 'DELETE',
                      credentials: 'include',
                    });

                    if (!response.ok) {
                      const errorData = await response.json();
                      throw new Error(errorData.errors?.[0]?.detail || 'Failed to delete article');
                    }

                    setShowDeleteModal(false);
                    if (onDelete) {
                      onDelete();
                    } else {
                      navigate('/blog');
                    }
                  } catch (err) {
                    console.error('Error deleting article:', err);
                    setError(err instanceof Error ? err.message : 'Failed to delete article');
                    setShowDeleteModal(false);
                  } finally {
                    setDeleting(false);
                  }
                }}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
        <p className="text-sm text-green-800">
          <strong>🚀 Module Federation Remote:</strong> Cette vue détaillée de l'article est chargée depuis le MFE React tournant sur le port 3002
        </p>
      </div>
    </div>
  );
}

export default App;
