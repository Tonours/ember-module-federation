import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { config } from '../config/env.js';

const prisma = new PrismaClient();

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
});

const updatePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(6),
});

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({
        errors: [
          {
            status: '401',
            title: 'Unauthorized',
            detail: 'Access token is required',
          },
        ],
      });
    }

    const decoded = jwt.verify(token, config.jwtSecret) as { userId: string };
    const { name, email } = updateProfileSchema.parse(req.body);

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser && existingUser.id !== decoded.userId) {
        return res.status(400).json({
          errors: [
            {
              status: '400',
              title: 'Bad Request',
              detail: 'Email already in use',
            },
          ],
        });
      }
    }

    const user = await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
      },
    });

    // Generate new access token with updated info
    // @ts-expect-error - JWT expiresIn type mismatch with string
    const newAccessToken = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
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

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        errors: [
          {
            status: '401',
            title: 'Unauthorized',
            detail: 'Invalid access token',
          },
        ],
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

export const updatePassword = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({
        errors: [
          {
            status: '401',
            title: 'Unauthorized',
            detail: 'Access token is required',
          },
        ],
      });
    }

    const decoded = jwt.verify(token, config.jwtSecret) as { userId: string };
    const { currentPassword, newPassword } = updatePasswordSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(404).json({
        errors: [
          {
            status: '404',
            title: 'Not Found',
            detail: 'User not found',
          },
        ],
      });
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password);

    if (!isValid) {
      return res.status(401).json({
        errors: [
          {
            status: '401',
            title: 'Unauthorized',
            detail: 'Current password is incorrect',
          },
        ],
      });
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: decoded.userId },
      data: { password: hashedPassword },
    });

    return res.json({ success: true });
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

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        errors: [
          {
            status: '401',
            title: 'Unauthorized',
            detail: 'Invalid access token',
          },
        ],
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
