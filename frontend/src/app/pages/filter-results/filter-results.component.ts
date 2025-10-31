import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FilterService } from '../../services/filter.service';

@Component({
  selector: 'app-filter-results',
  templateUrl: './filter-results.component.html',
  styleUrl: './filter-results.component.css'
})
export class FilterResultsComponent implements OnInit {
  filteredCars: Array<{ name: string; year: string; type: string; engine: string; size: string; image?: string }> = [];

  constructor(
    private filterService: FilterService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get filtered results from service
    const results = this.filterService.getFilterResults();
    
    // If no results, redirect back to filter
    if (!results || results.length === 0) {
      this.router.navigate(['/filter']);
      return;
    }

    // Map images to filtered cars based on car name
    this.filteredCars = results.map(car => {
      const imageName = this.normalizeCarName(car.name);
      const imagePath = `/Carros/${imageName}.png`;
      
      return {
        ...car,
        image: imagePath
      };
    });
  }

  /**
   * Normaliza o nome do carro para corresponder ao nome do arquivo de imagem
   * Exemplo: "Ford Ká" → "Ford ka", "Tiggo 8" → "Tiggo-8", "Partner" → "Partner"
   */
  private normalizeCarName(name: string): string {
    // Primeiro remove acentos
    let normalized = name
      .normalize('NFD')                    // Separa caracteres e seus acentos
      .replace(/[\u0300-\u036f]/g, '')      // Remove acentos/diacríticos
      .trim();                               // Remove espaços extras

    // Casos especiais conhecidos
    if (normalized.toLowerCase() === 'ford ka') {
      return 'Ford ka'; // Mantém espaço para Ford Ka
    }

    // Para outros casos, substitui espaços por hífen
    normalized = normalized.replace(/\s+/g, '-');
    
    return normalized;
  }

  getCarImage(car: any): string {
    // Tenta a imagem mapeada, se não existir usa fallback
    return car.image || '/Carros/Imagem 26.png'; // Fallback image
  }

  onImageError(event: any, car: any): void {
    // Se a imagem falhar ao carregar, tenta alternativas
    const img = event.target as HTMLImageElement;
    const currentSrc = img.src;
    
    // Se já tentou com hífen, tenta com espaço (e vice-versa)
    if (currentSrc.includes('Ford-ka')) {
      img.src = '/Carros/Ford ka.png';
    } else if (currentSrc.includes('Ford ka')) {
      img.src = '/Carros/Ford-ka.png';
    } else {
      // Fallback genérico
      img.src = '/Carros/Imagem 26.png';
    }
  }

  goBackToFilter(): void {
    this.router.navigate(['/filter']);
  }
}

