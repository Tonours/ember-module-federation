import { useAuth } from '../contexts/AuthContext';
import { Suspense, lazy } from 'react';
import { Spinner } from '@packages/ui';
import { useNavigate } from 'react-router';

const BlogArticleApp = lazy(() => import('blogArticle/App'));

export function BlogArticleWrapper() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleDelete = async () => {
    // Navigate back to blog list after successful deletion
    navigate('/blog');
  };

  const handleEdit = (articleId: string) => {
    navigate(`/blog/${articleId}/edit`);
  };

  return (
    <Suspense fallback={<div className="flex justify-center p-8"><Spinner size="lg" /></div>}>
      <BlogArticleApp user={user} onDelete={handleDelete} onEdit={handleEdit} />
    </Suspense>
  );
}
