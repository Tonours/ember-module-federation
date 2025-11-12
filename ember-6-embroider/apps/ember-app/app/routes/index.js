import Route from '@ember/routing/route';
import ENV from 'ember-app/config/environment';

export default class BlogIndexRoute extends Route {
  // Helper to build absolute API URL
  // If ENV.APP.API_URL is absolute (starts with http), use it
  // Otherwise, construct absolute URL using window.location.origin
  getApiUrl(path) {
    const apiBaseUrl = ENV.APP.API_URL;
    if (apiBaseUrl.startsWith('http')) {
      return `${apiBaseUrl}${path}`;
    }
    // Relative URL - construct absolute URL
    return `${window.location.origin}${apiBaseUrl}${path}`;
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    const months = [
      'Janvier',
      'Février',
      'Mars',
      'Avril',
      'Mai',
      'Juin',
      'Juillet',
      'Août',
      'Septembre',
      'Octobre',
      'Novembre',
      'Décembre',
    ];
    const day = date.getDate().toString().padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }

  truncate(text, length = 150) {
    if (!text) return '';
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  }

  queryParams = {
    category: {
      refreshModel: true,
    },
    tag: {
      refreshModel: true,
    },
  };

  async model(params) {
    try {
      // Build URL with filters (using slugs)
      const url = new URL(this.getApiUrl('/articles'));
      if (params.category) {
        url.searchParams.append('filter[category]', params.category);
      }
      if (params.tag) {
        url.searchParams.append('filter[tag]', params.tag);
      }

      // Fetch articles
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }
      const jsonApiData = await response.json();

      // Fetch all categories for filters
      const categoriesResponse = await fetch(this.getApiUrl('/categories'));
      const categoriesData = categoriesResponse.ok ? await categoriesResponse.json() : { data: [] };

      // Fetch all tags for filters
      const tagsResponse = await fetch(this.getApiUrl('/tags'));
      const tagsData = tagsResponse.ok ? await tagsResponse.json() : { data: [] };

      // Parse articles
      const articles = jsonApiData.data.map((resource) => ({
        id: resource.id,
        title: resource.attributes.title,
        content: resource.attributes.content,
        authorId: resource.attributes.authorId,
        createdAt: resource.attributes.createdAt,
        updatedAt: resource.attributes.updatedAt,
        formattedDate: this.formatDate(resource.attributes.createdAt),
        excerpt: this.truncate(resource.attributes.content, 150),
        category: resource.attributes.category,
        tags: resource.attributes.tags || [],
      }));

      // Parse categories
      const categories = categoriesData.data.map((resource) => ({
        id: resource.id,
        name: resource.attributes.name,
        slug: resource.attributes.slug,
        color: resource.attributes.color,
      }));

      // Parse tags
      const tags = tagsData.data.map((resource) => ({
        id: resource.id,
        name: resource.attributes.name,
        slug: resource.attributes.slug,
      }));

      return {
        articles,
        categories,
        tags,
      };
    } catch (error) {
      console.error('Error fetching data:', error);
      return {
        articles: [],
        categories: [],
        tags: [],
      };
    }
  }
}
