import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FilterService } from '../../services/filter.service';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-filter-results',
  templateUrl: './filter-results.component.html',
  styleUrl: './filter-results.component.css'
})
export class FilterResultsComponent implements OnInit {
  filteredCars: Array<{ name: string; year: string; type: string; engine: string; size: string; image?: string; isReserved?: boolean; vehicleId?: string }> = [];
  reserving: { [key: string]: boolean } = {}; // Track which car is being reserved

  constructor(
    private filterService: FilterService,
    private router: Router,
    private api: ApiService,
    private auth: AuthService
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

  async reserveCar(car: any): Promise<void> {
    const userId = this.auth.getUserId();
    if (!userId) {
      alert('Você precisa estar logado para reservar um carro.');
      this.router.navigate(['/login']);
      return;
    }

    // Marca como reservando
    this.reserving[car.name] = true;

    try {
      let vehicleId = car.vehicleId;

      // Se não tem vehicleId, precisa encontrar ou criar o veículo
      if (!vehicleId) {
        // Primeiro tenta encontrar um veículo existente pelo modelo
        this.api.findVehicleByModel(car.name).subscribe({
          next: (vehicles) => {
            // Filtra veículos pelo modelo
            const matchingVehicle = vehicles.find(v => v.model === car.name);
            if (matchingVehicle) {
              vehicleId = matchingVehicle._id || matchingVehicle.id;
              this.performReservation(car, userId, vehicleId);
            } else {
              // Se não encontrou, cria um novo veículo
              this.api.createVehicleFromCar(car).subscribe({
                next: (newVehicle) => {
                  vehicleId = newVehicle._id || newVehicle.id;
                  this.performReservation(car, userId, vehicleId);
                },
                error: (err) => {
                  console.error('Error creating vehicle:', err);
                  const errorMessage = err.error?.message || 'Erro ao criar veículo. Tente novamente.';
                  alert(errorMessage);
                  this.reserving[car.name] = false;
                }
              });
            }
          },
          error: (err) => {
            // Se não conseguiu buscar, tenta criar direto
            this.api.createVehicleFromCar(car).subscribe({
              next: (newVehicle) => {
                vehicleId = newVehicle._id || newVehicle.id;
                this.performReservation(car, userId, vehicleId);
              },
              error: (createErr) => {
                console.error('Error creating vehicle:', createErr);
                const errorMessage = createErr.error?.message || 'Erro ao criar veículo. Tente novamente.';
                alert(errorMessage);
                this.reserving[car.name] = false;
              }
            });
          }
        });
      } else {
        // Já tem vehicleId, pode reservar direto
        this.performReservation(car, userId, vehicleId);
      }
    } catch (error) {
      console.error('Error reserving car:', error);
      alert('Erro ao reservar carro. Tente novamente.');
      this.reserving[car.name] = false;
    }
  }

  private performReservation(car: any, userId: string, vehicleId: string): void {
    this.api.createReservation({ userId, vehicleId }).subscribe({
      next: (reservation) => {
        // Atualiza o estado do carro
        const carIndex = this.filteredCars.findIndex(c => c.name === car.name);
        if (carIndex >= 0) {
          this.filteredCars[carIndex].isReserved = true;
          this.filteredCars[carIndex].vehicleId = vehicleId;
        }
        this.reserving[car.name] = false;
        alert('Carro reservado com sucesso!');
        
        // Notifica o FilterService para atualizar outros componentes se necessário
        // Pode redirecionar para veículos para ver a reserva
        const shouldGoToVehicles = confirm('Carro reservado! Deseja ver suas reservas?');
        if (shouldGoToVehicles) {
          this.router.navigate(['/vehicles']);
        }
      },
      error: (err) => {
        console.error('Error creating reservation:', err);
        const errorMessage = err.error?.message || 'Erro ao reservar carro. Tente novamente.';
        alert(errorMessage);
        this.reserving[car.name] = false;
      }
    });
  }

  goBackToFilter(): void {
    this.router.navigate(['/filter']);
  }
}

