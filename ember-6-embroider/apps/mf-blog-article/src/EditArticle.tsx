import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, CardTitle, CardHeader, Button, Spinner } from '@packages/ui';
import { ApiClient, ArticlesApi, type Article } from '@packages/data';

export function EditArticle() {
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchArticle = async () => {
      if (!articleId) {
        setError('Article ID is missing');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const apiUrl = process.env.API_URL || `${window.location.origin}/api`;
        const apiClient = new ApiClient({
          baseUrl: apiUrl,
        });
        const articlesApi = new ArticlesApi(apiClient);
        const data = await articlesApi.getById(articleId);

        setArticle(data);
        setTitle(data.title);
        setContent(data.content);
      } catch (err) {
        console.error('Error fetching article:', err);
        setError(err instanceof Error ? err.message : 'Failed to load article');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [articleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleId) return;

    setSaving(true);
    setError(null);

    try {
      const apiUrl = process.env.API_URL || '/api';
      const response = await fetch(`${apiUrl}/articles/${articleId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          data: {
            type: 'articles',
            id: articleId,
            attributes: {
              title,
              content,
            },
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors?.[0]?.detail || 'Failed to update article');
      }

      navigate(`/blog/${articleId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update article');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/blog/${articleId}`);
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
          <Button variant="primary" onClick={() => navigate('/blog')} className="mt-4">
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
          <Button variant="primary" onClick={() => navigate('/blog')} className="mt-4">
            ← Retour à la liste
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Button variant="outline" onClick={handleCancel} className="mb-6">
        ← Cancel
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Edit Article</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              minLength={3}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              minLength={10}
              rows={15}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button type="button" variant="outline" onClick={handleCancel} disabled={saving}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default EditArticle;
