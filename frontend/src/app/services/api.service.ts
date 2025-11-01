import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) { }

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: token ? `Bearer ${token}` : '' });
  }

  login(data: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, data);
  }

  register(data: { username: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, data);
  }

  forgotPassword(email: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/reset-password-direct`, { email, newPassword });
  }

  getVehicles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/vehicles`, { headers: this.authHeaders() });
  }

  createVehicle(vehicle: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/vehicles`, vehicle, { headers: this.authHeaders() });
  }

  updateVehicle(id: string, vehicle: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/vehicles/${id}`, vehicle, { headers: this.authHeaders() });
  }

  deleteVehicle(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/vehicles/${id}`, { headers: this.authHeaders() });
  }

  createReservation(data: { userId: string; vehicleId: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/reservations`, data, { headers: this.authHeaders() });
  }

  releaseReservation(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/reservations/${id}`, { headers: this.authHeaders() });
  }

  getUserReservations(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reservations/user/${userId}`, { headers: this.authHeaders() });
  }

  // Busca veículo pelo modelo (name) - busca todos e filtra no frontend
  findVehicleByModel(model: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/vehicles`, { headers: this.authHeaders() });
  }

  // Cria um veículo a partir dos dados do carro JSON
  createVehicleFromCar(car: { name: string; year: string; type: string; engine: string; size: string }): Observable<any> {
    // Gera uma placa fictícia baseada no nome para garantir unicidade
    const licensePlate = this.generateLicensePlate(car.name);
    
    // Valida e converte o ano
    const year = parseInt(car.year, 10);
    if (isNaN(year)) {
      throw new Error('Ano do veículo inválido');
    }
    
    const vehicle = {
      make: car.name.split(' ')[0] || 'Unknown', // Primeira palavra do nome como marca
      model: car.name,
      year: year,
      color: 'Não especificado',
      licensePlate: licensePlate
    };

    return this.createVehicle(vehicle);
  }

  private generateLicensePlate(name: string): string {
    // Gera uma placa fictícia baseada no nome com timestamp para garantir unicidade
    const normalized = name.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 3);
    const timestamp = Date.now().toString().slice(-4); // Últimos 4 dígitos do timestamp
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    return `${normalized}-${timestamp}${random}`;
  }
}
