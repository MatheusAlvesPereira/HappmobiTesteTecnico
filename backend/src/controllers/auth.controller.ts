import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';

export async function register(req: Request, res: Response) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'username, email and password are required' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user: any = await User.create({ username, email, password: hashed });
    return res.status(201).json({ id: user._id, username, email });
  } catch (error: any) {
    if (error && error.code === 11000) {
      // Mongo duplicate key error
      const conflictField = Object.keys(error.keyPattern || {})[0] || 'field';
      return res.status(409).json({ message: `${conflictField} already exists` });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.password);

  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
  
  res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
}

