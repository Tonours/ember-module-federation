import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const serializeTag = (tag: any) => ({
  id: tag.id,
  type: 'tags',
  attributes: {
    name: tag.name,
    slug: tag.slug,
    createdAt: tag.createdAt,
    updatedAt: tag.updatedAt,
  },
  links: {
    self: `/api/tags/${tag.id}`,
  },
});

export const getTags = async (_req: Request, res: Response) => {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { name: 'asc' },
    });

    return res.json({
      data: tags.map(serializeTag),
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

export const getTagById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const tag = await prisma.tag.findUnique({
      where: { id },
    });

    if (!tag) {
      return res.status(404).json({
        errors: [
          {
            status: '404',
            title: 'Not Found',
            detail: `Tag with id ${id} not found`,
          },
        ],
      });
    }

    return res.json({
      data: serializeTag(tag),
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
