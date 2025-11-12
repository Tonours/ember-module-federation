import { useParams } from 'react-router';
import { EmberBlogApp } from './EmberBlogApp';

export function EmberBlogCategoryWrapper() {
  const { slug } = useParams<{ slug: string }>();

  if (!slug) {
    return <div className="p-4 text-red-600">Category slug is missing</div>;
  }

  return <EmberBlogApp initialRoute={`/category/${slug}`} />;
}
