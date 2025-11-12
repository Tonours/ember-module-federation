import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ENV from 'ember-4/config/environment';

export default class BlogTagRoute extends Route {
  @service iframeBridge;

  disconnectHeightObserver = null;

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

  activate() {
    super.activate();
    this.disconnectHeightObserver = this.iframeBridge.observeHeight();
  }

  deactivate() {
    super.deactivate();
    if (this.disconnectHeightObserver) {
      this.disconnectHeightObserver();
      this.disconnectHeightObserver = null;
    }
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

      // Fetch tag by slug
      const tagsResponse = await fetch(this.getApiUrl('/tags'));
      if (!tagsResponse.ok) {
        throw new Error('Failed to fetch tags');
      }
      const tagsData = await tagsResponse.json();
      const tag = tagsData.data.find((t) => t.attributes.slug === slug);

      if (!tag) {
        throw new Error('Tag not found');
      }

      // Fetch articles filtered by this tag
      const url = new URL(this.getApiUrl('/articles'));
      url.searchParams.append('filter[tag]', slug);

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
        tag: {
          id: tag.id,
          name: tag.attributes.name,
          slug: tag.attributes.slug,
        },
        articles,
      };
    } catch (error) {
      console.error('Error fetching data:', error);
      return {
        tag: null,
        articles: [],
      };
    }
  }
}
