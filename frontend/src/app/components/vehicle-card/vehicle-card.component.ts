import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-vehicle-card',
  templateUrl: './vehicle-card.component.html',
  styleUrl: './vehicle-card.component.css'
})
export class VehicleCardComponent {
  @Input() vehicle: any;
}
