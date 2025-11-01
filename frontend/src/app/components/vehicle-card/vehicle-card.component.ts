import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-vehicle-card',
  templateUrl: './vehicle-card.component.html',
  styleUrl: './vehicle-card.component.css'
})
export class VehicleCardComponent {
  @Input() vehicle: any;

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

  getVehicleImage(): string {
    if (!this.vehicle?.model) {
      return '/Carros/Imagem 26.png'; // Fallback image
    }
    
    const imageName = this.normalizeCarName(this.vehicle.model);
    return `/Carros/${imageName}.png`;
  }

  onImageError(event: any): void {
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
}
