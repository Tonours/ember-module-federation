import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const serializeCategory = (category: any) => ({
  id: category.id,
  type: 'categories',
  attributes: {
    name: category.name,
    slug: category.slug,
    color: category.color,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  },
  links: {
    self: `/api/categories/${category.id}`,
  },
});

export const getCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });

    return res.json({
      data: categories.map(serializeCategory),
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

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return res.status(404).json({
        errors: [
          {
            status: '404',
            title: 'Not Found',
            detail: `Category with id ${id} not found`,
          },
        ],
      });
    }

    return res.json({
      data: serializeCategory(category),
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
