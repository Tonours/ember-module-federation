import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { config } from '../config/env.js';

const prisma = new PrismaClient();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        errors: [
          {
            status: '400',
            title: 'Bad Request',
            detail: 'Email already registered',
          },
        ],
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // @ts-expect-error - JWT expiresIn type mismatch with string
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    // @ts-expect-error - JWT expiresIn type mismatch with string
    const refreshToken = jwt.sign({ userId: user.id }, config.jwtSecret, {
      expiresIn: config.jwtRefreshExpiresIn,
    });

    // Set httpOnly cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return res.status(201).json({
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

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        errors: [
          {
            status: '401',
            title: 'Unauthorized',
            detail: 'Invalid email or password',
          },
        ],
      });
    }

    // @ts-expect-error - JWT expiresIn type mismatch with string
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    // @ts-expect-error - JWT expiresIn type mismatch with string
    const refreshToken = jwt.sign({ userId: user.id }, config.jwtSecret, {
      expiresIn: config.jwtRefreshExpiresIn,
    });

    // Set httpOnly cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
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

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(400).json({
        errors: [
          {
            status: '400',
            title: 'Bad Request',
            detail: 'Refresh token is required',
          },
        ],
      });
    }

    const decoded = jwt.verify(token, config.jwtSecret) as { userId: string };

    // Get user data for new access token
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(401).json({
        errors: [
          {
            status: '401',
            title: 'Unauthorized',
            detail: 'User not found',
          },
        ],
      });
    }

    // @ts-expect-error - JWT expiresIn type mismatch with string
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    // @ts-expect-error - JWT expiresIn type mismatch with string
    const newRefreshToken = jwt.sign({ userId: decoded.userId }, config.jwtSecret, {
      expiresIn: config.jwtRefreshExpiresIn,
    });

    // Set httpOnly cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return res.json({ success: true });
  } catch (error) {
    return res.status(401).json({
      errors: [
        {
          status: '401',
          title: 'Unauthorized',
          detail: 'Invalid or expired refresh token',
        },
      ],
    });
  }
};

export const logout = async (_req: Request, res: Response) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  return res.json({ success: true });
};

export const me = async (req: Request, res: Response) => {
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

    const decoded = jwt.verify(token, config.jwtSecret) as {
      userId: string;
      email: string;
      name: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(401).json({
        errors: [
          {
            status: '401',
            title: 'Unauthorized',
            detail: 'User not found',
          },
        ],
      });
    }

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    return res.status(401).json({
      errors: [
        {
          status: '401',
          title: 'Unauthorized',
          detail: 'Invalid or expired access token',
        },
      ],
    });
  }
};
