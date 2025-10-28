import { Request, Response } from 'express';
import { User } from '../models/user.model';
import { Vehicle } from '../models/vehicle.model';
export async function createUser(req: Request, res: Response) { const user = await User.create(req.body); res.status(201).json(user); }
export async function updateUser(req: Request, res: Response) { const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }); if (!user) return res.status(404).json({ message: 'Not found' }); res.json(user); }
export async function deleteUser(req: Request, res: Response) { const user = await User.findByIdAndDelete(req.params.id); if (!user) return res.status(404).json({ message: 'Not found' }); res.status(204).send(); }
export async function getUserById(req: Request, res: Response) { const user = await User.findById(req.params.id); if (!user) return res.status(404).json({ message: 'Not found' }); res.json(user); }
export async function listUsers(req: Request, res: Response) { const users = await User.find(); res.json(users); }
export async function listUserVehicles(req: Request, res: Response) { const vehicles = await Vehicle.find({ reservedBy: req.params.id }); res.json(vehicles); }

