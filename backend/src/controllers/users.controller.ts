import { Request, Response } from 'express';
import { User } from '../models/user.model';
import { Vehicle } from '../models/vehicle.model';

export async function createUser(req: Request, res: Response) {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ id: user._id, username: user.username, email: user.email });
  } catch (error: any) {
    console.error('Error creating user:', error);
    if (error.code === 11000) {
      const conflictField = Object.keys(error.keyPattern || {})[0] || 'field';
      return res.status(409).json({ message: `${conflictField} already exists` });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message || 'Dados inválidos' });
    }
    res.status(500).json({ message: 'Erro ao criar usuário. Tente novamente.' });
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
    res.json({ id: user._id, username: user.username, email: user.email });
  } catch (error: any) {
    console.error('Error updating user:', error);
    if (error.code === 11000) {
      const conflictField = Object.keys(error.keyPattern || {})[0] || 'field';
      return res.status(409).json({ message: `${conflictField} already exists` });
    }
    res.status(500).json({ message: 'Erro ao atualizar usuário. Tente novamente.' });
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Erro ao deletar usuário. Tente novamente.' });
  }
}

export async function getUserById(req: Request, res: Response) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
    res.json({ id: user._id, username: user.username, email: user.email });
  } catch (error: any) {
    console.error('Error getting user:', error);
    res.status(500).json({ message: 'Erro ao buscar usuário. Tente novamente.' });
  }
}

export async function listUsers(req: Request, res: Response) {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error: any) {
    console.error('Error listing users:', error);
    res.status(500).json({ message: 'Erro ao listar usuários. Tente novamente.' });
  }
}

export async function listUserVehicles(req: Request, res: Response) {
  try {
    const vehicles = await Vehicle.find({ reservedBy: req.params.id });
    res.json(vehicles);
  } catch (error: any) {
    console.error('Error listing user vehicles:', error);
    res.status(500).json({ message: 'Erro ao listar veículos do usuário. Tente novamente.' });
  }
}

