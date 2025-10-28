import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.css'
})
export class ReservationsComponent implements OnInit {
  reservations: any[] = [];
  constructor(private api: ApiService) {}
  ngOnInit(): void {
    const userId = this.extractUserId();
    if (userId) this.api.getUserReservations(userId).subscribe({ next: r => this.reservations = r });
  }
  private extractUserId(): string | null {
    return null;
  }
}
