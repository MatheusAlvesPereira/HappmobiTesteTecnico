import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FilterService } from '../services/filter.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent implements OnInit {
  // Full list of cars loaded from public/carros.json
  cars: Array<{ name: string; year: string; type: string; engine: string; size: string }>=[];

  // Unique options derived from cars
  engineOptions: string[] = [];
  typeOptions: string[] = [];
  sizeOptions: string[] = [];

  // Selected filters
  selectedEngines = new Set<string>();
  selectedTypes = new Set<string>();
  selectedSizes = new Set<string>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private filterService: FilterService
  ) {}

  ngOnInit(): void {
    // Fetch cars from the public folder root
    this.http.get<any[]>('/carros.json').subscribe((data) => {
      this.cars = Array.isArray(data) ? data : [];
      
      // Extract unique options from cars
      this.engineOptions = Array.from(new Set(this.cars.map((c) => c.engine))).sort();
      this.typeOptions = Array.from(new Set(this.cars.map((c) => c.type))).sort();
      this.sizeOptions = Array.from(new Set(this.cars.map((c) => c.size))).sort();
    });
  }

  onEngineToggle(engine: string, target: EventTarget | null): void {
    const isChecked = (target as HTMLInputElement)?.checked === true;
    if (isChecked) {
      this.selectedEngines.add(engine);
    } else {
      this.selectedEngines.delete(engine);
    }
  }

  onTypeToggle(type: string, target: EventTarget | null): void {
    const isChecked = (target as HTMLInputElement)?.checked === true;
    if (isChecked) {
      this.selectedTypes.add(type);
    } else {
      this.selectedTypes.delete(type);
    }
  }

  onSizeToggle(size: string, target: EventTarget | null): void {
    const isChecked = (target as HTMLInputElement)?.checked === true;
    if (isChecked) {
      this.selectedSizes.add(size);
    } else {
      this.selectedSizes.delete(size);
    }
  }

  applyFilters(): void {
    // Apply all filters and get filtered results
    let filtered = [...this.cars];

    // Filter by engine
    if (this.selectedEngines.size > 0) {
      filtered = filtered.filter((c) => this.selectedEngines.has(c.engine));
    }

    // Filter by type (carroceria)
    if (this.selectedTypes.size > 0) {
      filtered = filtered.filter((c) => this.selectedTypes.has(c.type));
    }

    // Filter by size (lugares)
    if (this.selectedSizes.size > 0) {
      filtered = filtered.filter((c) => this.selectedSizes.has(c.size));
    }

    // Save results to service and navigate
    this.filterService.setFilterResults(filtered);
    this.router.navigate(['/filter-results']);
  }

  clearFilters(): void {
    this.selectedEngines.clear();
    this.selectedTypes.clear();
    this.selectedSizes.clear();
    
    // Reset all checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
    checkboxes.forEach(checkbox => checkbox.checked = false);
  }
}
