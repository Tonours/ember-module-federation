import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ENV from 'ember-app/config/environment';

export default class BlogCategoryRoute extends Route {
  @service navigation;


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

  async model(params) {
    try {
      const slug = params.slug;

      // Fetch category by slug
      const categoriesResponse = await fetch(this.getApiUrl('/categories'));
      if (!categoriesResponse.ok) {
        throw new Error('Failed to fetch categories');
      }
      const categoriesData = await categoriesResponse.json();
      const category = categoriesData.data.find(
        (cat) => cat.attributes.slug === slug
      );

      if (!category) {
        throw new Error('Category not found');
      }

      // Fetch articles filtered by this category
      const url = new URL(this.getApiUrl('/articles'));
      url.searchParams.append('filter[category]', slug);

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }
      const jsonApiData = await response.json();

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

      return {
        category: {
          id: category.id,
          name: category.attributes.name,
          slug: category.attributes.slug,
          color: category.attributes.color,
        },
        articles,
      };
    } catch (error) {
      console.error('Error fetching data:', error);
      return {
        category: null,
        articles: [],
      };
    }
  }
}
