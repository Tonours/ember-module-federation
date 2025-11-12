/**
 * JSON:API specification types
 * https://jsonapi.org/format/
 */

export interface JsonApiResource<T = Record<string, unknown>> {
  id: string;
  type: string;
  attributes: T;
  relationships?: Record<string, JsonApiRelationship>;
  links?: JsonApiLinks;
  meta?: Record<string, unknown>;
}

export interface JsonApiRelationship {
  data?: JsonApiResourceIdentifier | JsonApiResourceIdentifier[];
  links?: JsonApiLinks;
  meta?: Record<string, unknown>;
}

export interface JsonApiResourceIdentifier {
  id: string;
  type: string;
  meta?: Record<string, unknown>;
}

export interface JsonApiLinks {
  self?: string;
  related?: string;
  first?: string;
  last?: string;
  prev?: string;
  next?: string;
}

export interface JsonApiResponse<T = Record<string, unknown>> {
  data: JsonApiResource<T> | JsonApiResource<T>[] | null;
  included?: JsonApiResource[];
  meta?: Record<string, unknown>;
  links?: JsonApiLinks;
  errors?: JsonApiError[];
}

export interface JsonApiError {
  id?: string;
  status?: string;
  code?: string;
  title?: string;
  detail?: string;
  source?: {
    pointer?: string;
    parameter?: string;
  };
  meta?: Record<string, unknown>;
}

export interface JsonApiPagination {
  page?: {
    number?: number;
    size?: number;
    offset?: number;
    limit?: number;
  };
  sort?: string;
  filter?: Record<string, string | number | boolean>;
}
