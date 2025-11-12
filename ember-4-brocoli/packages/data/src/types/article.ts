export interface Article {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateArticlePayload {
  title: string;
  content: string;
}

export interface UpdateArticlePayload {
  title?: string;
  content?: string;
}

export interface ArticleFilters {
  authorId?: string;
  search?: string;
}
