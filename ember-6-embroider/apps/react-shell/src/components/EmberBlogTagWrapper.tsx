import { useParams } from 'react-router';
import { EmberBlogApp } from './EmberBlogApp';

export function EmberBlogTagWrapper() {
  const { slug } = useParams<{ slug: string }>();

  if (!slug) {
    return <div className="p-4 text-red-600">Tag slug is missing</div>;
  }

  return <EmberBlogApp initialRoute={`/tag/${slug}`} />;
}
