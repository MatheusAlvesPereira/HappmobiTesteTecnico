import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
export function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'Token required' });
  const parts = header.split(' ');
  const token = parts.length === 2 ? parts[1] : undefined;
  if (!token) return res.status(401).json({ message: 'Token required' });
  try {
    const secret = (process.env.JWT_SECRET || 'secret') as string;
    const payload = jwt.verify(token, secret) as any;
    // @ts-ignore
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

