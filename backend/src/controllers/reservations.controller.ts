import { Request, Response } from 'express';
import { Reservation } from '../models/reservation.model';
import { Vehicle } from '../models/vehicle.model';

export async function createReservation(req: Request, res: Response) {
  try {
    const { userId, vehicleId } = req.body;
    
    if (!userId || !vehicleId) {
      return res.status(400).json({ message: 'userId e vehicleId são obrigatórios' });
    }

    // Verifica se o veículo existe
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Veículo não encontrado' });
    }

    const existingForVehicle = await Reservation.findOne({ vehicleId, status: 'reserved' });
    if (existingForVehicle) {
      return res.status(400).json({ message: 'Veículo já está reservado' });
    }
    
    const existingForUser = await Reservation.findOne({ userId, status: 'reserved' });
    if (existingForUser) {
      return res.status(400).json({ message: 'Você já possui uma reserva ativa' });
    }
    
    const reservation = await Reservation.create({ userId, vehicleId, status: 'reserved' });
    await Vehicle.findByIdAndUpdate(vehicleId, { isReserved: true, reservedBy: userId });
    
    res.status(201).json(reservation);
  } catch (error: any) {
    console.error('Error creating reservation:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message || 'Dados inválidos' });
    }
    res.status(500).json({ message: 'Erro ao criar reserva. Tente novamente.' });
  }
}
export async function releaseReservation(req: Request, res: Response) {
  const { id } = req.params;
  const reservation = await Reservation.findById(id);
  if (!reservation) return res.status(404).json({ message: 'Not found' });
  reservation.status = 'released';
  await reservation.save();
  await Vehicle.findByIdAndUpdate(reservation.vehicleId, { isReserved: false, reservedBy: null });
  res.status(204).send();
}
export async function listUserReservations(req: Request, res: Response) {
  const { userId } = req.params;
  const reservations = await Reservation.find({ userId });
  res.json(reservations);
}

