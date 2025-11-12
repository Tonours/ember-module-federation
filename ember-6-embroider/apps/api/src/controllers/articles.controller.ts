import type { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import type { AuthRequest } from '../middleware/auth.js';

const prisma = new PrismaClient();

const createArticleSchema = z.object({
  data: z.object({
    type: z.literal('articles'),
    attributes: z.object({
      title: z.string().min(3),
      content: z.string().min(10),
    }),
  }),
});

const updateArticleSchema = z.object({
  data: z.object({
    type: z.literal('articles'),
    id: z.string(),
    attributes: z.object({
      title: z.string().min(3).optional(),
      content: z.string().min(10).optional(),
    }),
  }),
});

const serializeArticle = (article: any) => ({
  id: article.id,
  type: 'articles',
  attributes: {
    title: article.title,
    content: article.content,
    authorId: article.authorId,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
    category: article.category ? {
      id: article.category.id,
      name: article.category.name,
      slug: article.category.slug,
      color: article.category.color,
    } : null,
    tags: article.tags ? article.tags.map((articleTag: any) => ({
      id: articleTag.tag.id,
      name: articleTag.tag.name,
      slug: articleTag.tag.slug,
    })) : [],
  },
  links: {
    self: `/api/articles/${article.id}`,
  },
});

export const getArticles = async (req: AuthRequest, res: Response) => {
  try {
    const { page, filter, sort } = req.query;

    const pageNumber = page && typeof page === 'object' && 'number' in page
      ? parseInt(page.number as string) || 1
      : 1;
    const pageSize = page && typeof page === 'object' && 'size' in page
      ? parseInt(page.size as string) || 10
      : 10;

    const where: any = {};

    if (filter && typeof filter === 'object') {
      if ('authorId' in filter) {
        where.authorId = filter.authorId;
      }

      // Support both ID and slug for category
      if ('categoryId' in filter) {
        where.categoryId = filter.categoryId;
      } else if ('category' in filter) {
        where.category = {
          slug: filter.category,
        };
      }

      // Support both ID and slug for tag
      if ('tagId' in filter) {
        where.tags = {
          some: {
            tagId: filter.tagId,
          },
        };
      } else if ('tag' in filter) {
        where.tags = {
          some: {
            tag: {
              slug: filter.tag,
            },
          },
        };
      }
    }

    const articles = await prisma.article.findMany({
      where,
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
      orderBy: sort === '-createdAt' ? { createdAt: 'desc' } : { createdAt: 'asc' },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    const total = await prisma.article.count({ where });

    return res.json({
      data: articles.map(serializeArticle),
      meta: {
        page: {
          number: pageNumber,
          size: pageSize,
          total: Math.ceil(total / pageSize),
        },
        total,
      },
      links: {
        self: `/api/articles?page[number]=${pageNumber}&page[size]=${pageSize}`,
        first: `/api/articles?page[number]=1&page[size]=${pageSize}`,
        last: `/api/articles?page[number]=${Math.ceil(total / pageSize)}&page[size]=${pageSize}`,
        ...(pageNumber > 1 && {
          prev: `/api/articles?page[number]=${pageNumber - 1}&page[size]=${pageSize}`,
        }),
        ...(pageNumber < Math.ceil(total / pageSize) && {
          next: `/api/articles?page[number]=${pageNumber + 1}&page[size]=${pageSize}`,
        }),
      },
    });
  } catch (error) {
    return res.status(500).json({
      errors: [
        {
          status: '500',
          title: 'Internal Server Error',
          detail: 'An unexpected error occurred',
        },
      ],
    });
  }
};

export const getArticleById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!article) {
      return res.status(404).json({
        errors: [
          {
            status: '404',
            title: 'Not Found',
            detail: `Article with id ${id} not found`,
          },
        ],
      });
    }

    return res.json({
      data: serializeArticle(article),
    });
  } catch (error) {
    return res.status(500).json({
      errors: [
        {
          status: '500',
          title: 'Internal Server Error',
          detail: 'An unexpected error occurred',
        },
      ],
    });
  }
};

export const createArticle = async (req: AuthRequest, res: Response) => {
  try {
    const { data } = createArticleSchema.parse(req.body);

    if (!req.userId) {
      return res.status(401).json({
        errors: [
          {
            status: '401',
            title: 'Unauthorized',
            detail: 'User ID not found in token',
          },
        ],
      });
    }

    const article = await prisma.article.create({
      data: {
        title: data.attributes.title,
        content: data.attributes.content,
        authorId: req.userId,
      },
    });

    return res.status(201).json({
      data: serializeArticle(article),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        errors: error.errors.map((err) => ({
          status: '400',
          title: 'Validation Error',
          detail: err.message,
          source: { pointer: `/data/attributes/${err.path.join('/')}` },
        })),
      });
    }

    return res.status(500).json({
      errors: [
        {
          status: '500',
          title: 'Internal Server Error',
          detail: 'An unexpected error occurred',
        },
      ],
    });
  }
};

export const updateArticle = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { data } = updateArticleSchema.parse(req.body);

    const article = await prisma.article.findUnique({
      where: { id },
    });

    if (!article) {
      return res.status(404).json({
        errors: [
          {
            status: '404',
            title: 'Not Found',
            detail: `Article with id ${id} not found`,
          },
        ],
      });
    }

    if (article.authorId !== req.userId) {
      return res.status(403).json({
        errors: [
          {
            status: '403',
            title: 'Forbidden',
            detail: 'You can only update your own articles',
          },
        ],
      });
    }

    const updatedArticle = await prisma.article.update({
      where: { id },
      data: {
        ...(data.attributes.title && { title: data.attributes.title }),
        ...(data.attributes.content && { content: data.attributes.content }),
      },
    });

    return res.json({
      data: serializeArticle(updatedArticle),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        errors: error.errors.map((err) => ({
          status: '400',
          title: 'Validation Error',
          detail: err.message,
          source: { pointer: `/data/attributes/${err.path.join('/')}` },
        })),
      });
    }

    return res.status(500).json({
      errors: [
        {
          status: '500',
          title: 'Internal Server Error',
          detail: 'An unexpected error occurred',
        },
      ],
    });
  }
};

export const deleteArticle = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const article = await prisma.article.findUnique({
      where: { id },
    });

    if (!article) {
      return res.status(404).json({
        errors: [
          {
            status: '404',
            title: 'Not Found',
            detail: `Article with id ${id} not found`,
          },
        ],
      });
    }

    if (article.authorId !== req.userId) {
      return res.status(403).json({
        errors: [
          {
            status: '403',
            title: 'Forbidden',
            detail: 'You can only delete your own articles',
          },
        ],
      });
    }

    await prisma.article.delete({
      where: { id },
    });

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({
      errors: [
        {
          status: '500',
          title: 'Internal Server Error',
          detail: 'An unexpected error occurred',
        },
      ],
    });
  }
};
