import type { ApiClient } from './client';
import type { Article, CreateArticlePayload, UpdateArticlePayload, ArticleFilters } from '../types/article';
import type { JsonApiResource, JsonApiPagination } from '../types/jsonapi';

export class ArticlesApi {
  constructor(private client: ApiClient) {}

  async getAll(filters?: ArticleFilters, pagination?: JsonApiPagination): Promise<Article[]> {
    const params: JsonApiPagination = {
      ...pagination,
      filter: filters as Record<string, string | number | boolean>,
    };

    const response = await this.client.get<Article>('/articles', params);

    if (Array.isArray(response.data)) {
      return response.data.map(resource => this.deserialize(resource));
    }

    return [];
  }

  async getById(id: string): Promise<Article> {
    const response = await this.client.get<Article>(`/articles/${id}`);

    if (!response.data || Array.isArray(response.data)) {
      throw new Error('Article not found');
    }

    return this.deserialize(response.data);
  }

  async create(payload: CreateArticlePayload): Promise<Article> {
    const body = {
      data: {
        type: 'articles',
        attributes: payload,
      },
    };

    const response = await this.client.post<Article>('/articles', body);

    if (!response.data || Array.isArray(response.data)) {
      throw new Error('Failed to create article');
    }

    return this.deserialize(response.data);
  }

  async update(id: string, payload: UpdateArticlePayload): Promise<Article> {
    const body = {
      data: {
        type: 'articles',
        id,
        attributes: payload,
      },
    };

    const response = await this.client.patch<Article>(`/articles/${id}`, body);

    if (!response.data || Array.isArray(response.data)) {
      throw new Error('Failed to update article');
    }

    return this.deserialize(response.data);
  }

  async delete(id: string): Promise<void> {
    await this.client.delete(`/articles/${id}`);
  }

  private deserialize(resource: JsonApiResource<Article>): Article {
    return {
      ...resource.attributes,
      id: resource.id,
    };
  }
}
