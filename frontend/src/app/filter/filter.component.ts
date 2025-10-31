import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent implements OnInit {
  // Full list of cars loaded from public/carros.json
  cars: Array<{ name: string; year: string; type: string; engine: string; size: string }>=[];

  // Unique engine options derived from cars
  engineOptions: string[] = [];

  // Selected engines from the checkbox group
  selectedEngines = new Set<string>();

  // Cars filtered by current selection
  filteredCars: Array<{ name: string; year: string; type: string; engine: string; size: string }>=[];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Fetch cars from the public folder root
    this.http.get<any[]>('/carros.json').subscribe((data) => {
      this.cars = Array.isArray(data) ? data : [];
      this.filteredCars = [...this.cars];
      this.engineOptions = Array.from(new Set(this.cars.map((c) => c.engine))).sort();
    });
  }

  onEngineToggle(engine: string, target: EventTarget | null): void {
    const isChecked = (target as HTMLInputElement)?.checked === true;
    if (isChecked) {
      this.selectedEngines.add(engine);
    } else {
      this.selectedEngines.delete(engine);
    }
    this.applyFilters();
  }

  private applyFilters(): void {
    if (this.selectedEngines.size === 0) {
      this.filteredCars = [...this.cars];
      return;
    }

    this.filteredCars = this.cars.filter((c) => this.selectedEngines.has(c.engine));
  }
}
