import { Request, Response } from 'express';
import { Vehicle } from '../models/vehicle.model';

export async function createVehicle(req: Request, res: Response) {
  try {
    const vehicle = await Vehicle.create(req.body);
    res.status(201).json(vehicle);
  } catch (error: any) {
    console.error('Error creating vehicle:', error);
    if (error.code === 11000) {
      // Duplicate key error (unique constraint violation)
      return res.status(400).json({ message: 'Placa já cadastrada. Tente novamente.' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message || 'Dados inválidos' });
    }
    res.status(500).json({ message: 'Erro ao criar veículo. Tente novamente.' });
  }
}
export async function updateVehicle(req: Request, res: Response) { const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true }); if (!vehicle) return res.status(404).json({ message: 'Not found' }); res.json(vehicle); }
export async function deleteVehicle(req: Request, res: Response) { const vehicle = await Vehicle.findByIdAndDelete(req.params.id); if (!vehicle) return res.status(404).json({ message: 'Not found' }); res.status(204).send(); }
export async function listVehicles(req: Request, res: Response) { const vehicles = await Vehicle.find(); res.json(vehicles); }

