import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FilterService } from '../../services/filter.service';

@Component({
  selector: 'app-filter-results',
  templateUrl: './filter-results.component.html',
  styleUrl: './filter-results.component.css'
})
export class FilterResultsComponent implements OnInit {
  filteredCars: Array<{ name: string; year: string; type: string; engine: string; size: string }> = [];

  constructor(
    private filterService: FilterService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get filtered results from service
    this.filteredCars = this.filterService.getFilterResults();
    
    // If no results, redirect back to filter
    if (!this.filteredCars || this.filteredCars.length === 0) {
      this.router.navigate(['/filter']);
    }
  }

  goBackToFilter(): void {
    this.router.navigate(['/filter']);
  }
}

