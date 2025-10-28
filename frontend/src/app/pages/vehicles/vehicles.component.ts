import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.css'
})
export class VehiclesComponent implements OnInit {
  vehicles: any[] = [];
  constructor(private api: ApiService) {}
  ngOnInit(): void {
    this.api.getVehicles().subscribe({ next: v => this.vehicles = v });
  }
}
