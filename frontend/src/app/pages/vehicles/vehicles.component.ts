import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.css'
})
export class VehiclesComponent implements OnInit, OnDestroy {
  vehicles: any[] = [];
  filtered: any[] = [];
  reservations: any[] = [];
  recentReservations: any[] = []; // Últimas reservas do usuário
  query: string = '';
  availability: 'all' | 'available' | 'reserved' = 'all';
  private routerSubscription?: Subscription;
  
  constructor(
    private api: ApiService, 
    private router: Router,
    private auth: AuthService
  ) {
    // Recarrega reservas quando volta para esta página
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        if (event.url === '/vehicles') {
          this.loadUserReservations();
          this.loadVehicles();
        }
      });
  }

  ActivateFilter(){
    this.router.navigate(['/filter']);
  }

  ngOnInit(): void {
    this.loadVehicles();
    this.loadUserReservations();
  }

  loadVehicles(): void {
    this.api.getVehicles().subscribe({ 
      next: v => { 
        this.vehicles = v; 
        this.applyFilters();
        // Processa reservas após carregar veículos
        if (this.reservations.length > 0) {
          this.processReservations();
        }
      } 
    });
  }

  loadUserReservations(): void {
    const userId = this.auth.getUserId();
    if (!userId) return;

    this.api.getUserReservations(userId).subscribe({
      next: (reservations) => {
        this.reservations = reservations || [];
        this.processReservations();
      },
      error: (err) => {
        console.error('Error loading reservations:', err);
      }
    });
  }

  private processReservations(): void {
    // Aguarda os veículos carregarem antes de processar
    if (this.vehicles.length === 0) {
      // Se os veículos ainda não carregaram, tenta novamente após um delay
      setTimeout(() => this.processReservations(), 500);
      return;
    }

    // Filtra apenas reservas ativas (status: 'reserved')
    this.recentReservations = this.reservations
      .filter(r => r.status === 'reserved')
      .slice(0, 5) // Mostra até 5 últimas reservas
      .map(reservation => {
        // Extrai o vehicleId (pode vir como objeto ou string)
        const vehicleId = reservation.vehicleId?._id || reservation.vehicleId?.id || reservation.vehicleId;
        
        // Busca o veículo correspondente
        const vehicle = this.vehicles.find(v => {
          const vId = v._id || v.id;
          return vId === vehicleId || vId === String(vehicleId);
        });
        
        return {
          ...reservation,
          vehicle: vehicle
        };
      });
  }

  applyFilters(): void {
    const q = this.query.trim().toLowerCase();
    this.filtered = this.vehicles.filter(v => {
      const matchesQuery = !q || `${v.make} ${v.model} ${v.licensePlate}`.toLowerCase().includes(q);
      const matchesAvail = this.availability === 'all' || (this.availability === 'available' ? !v.isReserved : !!v.isReserved);
      return matchesQuery && matchesAvail;
    });
    
    // Recarrega reservas para atualizar veículos nas reservas
    if (this.recentReservations.length > 0) {
      this.updateReservationsWithVehicles();
    }
  }

  private updateReservationsWithVehicles(): void {
    this.recentReservations = this.recentReservations.map(reservation => {
      const vehicle = this.vehicles.find(v => 
        (v._id || v.id) === (reservation.vehicleId?._id || reservation.vehicleId)
      );
      return {
        ...reservation,
        vehicle: vehicle
      };
    });
  }

  /**
   * Normaliza o nome do carro para corresponder ao nome do arquivo de imagem
   * Exemplo: "Ford Ká" → "Ford ka", "Tiggo 8" → "Tiggo-8", "Partner" → "Partner"
   */
  normalizeCarName(name: string): string {
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

  getVehicleImage(model: string): string {
    if (!model) {
      return '/Carros/Imagem 26.png'; // Fallback image
    }
    
    const imageName = this.normalizeCarName(model);
    return `/Carros/${imageName}.png`;
  }

  onReservationImageError(event: any): void {
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

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}
