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

  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, data);
    }

  register(data: { username: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, data);
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
}
