import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.css'
})
export class VehiclesComponent implements OnInit {
  vehicles: any[] = [];
  filtered: any[] = [];
  query: string = '';
  availability: 'all' | 'available' | 'reserved' = 'all';
  
  constructor(private api: ApiService, private router: Router) {}

  ActivateFilter(){
    this.router.navigate(['/filter']);
  }

  ngOnInit(): void {
    this.api.getVehicles().subscribe({ next: v => { this.vehicles = v; this.applyFilters(); } });
  }

  applyFilters(): void {
    const q = this.query.trim().toLowerCase();
    this.filtered = this.vehicles.filter(v => {
      const matchesQuery = !q || `${v.make} ${v.model} ${v.licensePlate}`.toLowerCase().includes(q);
      const matchesAvail = this.availability === 'all' || (this.availability === 'available' ? !v.isReserved : !!v.isReserved);
      return matchesQuery && matchesAvail;
    });
  }
}
