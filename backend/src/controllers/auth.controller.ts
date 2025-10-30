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

    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedUsername = String(username).trim();

    const hashed = await bcrypt.hash(password, 10);
    const user: any = await User.create({ username: normalizedUsername, email: normalizedEmail, password: hashed });
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
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const passwordcenrypt = await bcrypt.compare(password, user.password);

  if (!passwordcenrypt) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
  
  res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
}

export async function resetPasswordDirect(req: Request, res: Response) {
  try {
    const { email, newPassword } = req.body as { email?: string; newPassword?: string };

    if (!email || !newPassword) {
      return res.status(400).json({ message: 'email and newPassword are required' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    console.log('Payload:', req.body);
    console.log('User found:', user);

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}

