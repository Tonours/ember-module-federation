// API Client
export { ApiClient, type ApiClientConfig } from './api/client';
export { ArticlesApi } from './api/articles';
export { AuthApi } from './api/auth';

// Types - JSON:API
export type {
  JsonApiResource,
  JsonApiRelationship,
  JsonApiResourceIdentifier,
  JsonApiLinks,
  JsonApiResponse,
  JsonApiError,
  JsonApiPagination,
} from './types/jsonapi';

// Types - Article
export type {
  Article,
  CreateArticlePayload,
  UpdateArticlePayload,
  ArticleFilters,
} from './types/article';

// Types - Auth
export type {
  User,
  LoginCredentials,
  RegisterPayload,
  AuthResponse,
  RefreshTokenResponse,
} from './types/auth';
