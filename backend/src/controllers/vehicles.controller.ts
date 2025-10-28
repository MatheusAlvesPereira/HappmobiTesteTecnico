import { Request, Response } from 'express';
import { Vehicle } from '../models/vehicle.model';
export async function createVehicle(req: Request, res: Response) { const vehicle = await Vehicle.create(req.body); res.status(201).json(vehicle); }
export async function updateVehicle(req: Request, res: Response) { const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true }); if (!vehicle) return res.status(404).json({ message: 'Not found' }); res.json(vehicle); }
export async function deleteVehicle(req: Request, res: Response) { const vehicle = await Vehicle.findByIdAndDelete(req.params.id); if (!vehicle) return res.status(404).json({ message: 'Not found' }); res.status(204).send(); }
export async function listVehicles(req: Request, res: Response) { const vehicles = await Vehicle.find(); res.json(vehicles); }

