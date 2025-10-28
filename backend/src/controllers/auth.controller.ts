import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
export async function register(req: Request, res: Response) {
  const { username, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hashed });
  res.status(201).json({ id: user._id, username, email });
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

