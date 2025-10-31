import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface FilterData {
  selectedEngines: string[];
  selectedTypes: string[];
  selectedSizes: string[];
}

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private filterResultsSubject = new BehaviorSubject<any[]>([]);
  public filterResults$ = this.filterResultsSubject.asObservable();

  setFilterResults(results: any[]): void {
    this.filterResultsSubject.next(results);
  }

  getFilterResults(): any[] {
    return this.filterResultsSubject.value;
  }
}

