import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environements/environment';
import { ReservationsService } from './reservations.service';
import { ColisService } from './colis.service';
import { PaiementsService } from './paiements.service';
import { VehiculesService } from './vehicules.service';

export interface KPIs {
  billets: number;
  colis: number;
  fillRate: number;
  resaToday?: number;
  parcelsTransit?: number;
  revenueMonth?: number;
}

export interface RevenueByRoute {
  trajet: string;
  count: number;
  revenu: number;
}

@Injectable({ providedIn: 'root' })
export class RapportsService {
  private readonly http = inject(HttpClient);

  // Inject dependencies
  private readonly reservationsService = inject(ReservationsService);
  private readonly colisService = inject(ColisService);
  private readonly paiementsService = inject(PaiementsService);
  private readonly vehiculesService = inject(VehiculesService);

  // Data from API
  private readonly _kpisFromApi = signal<KPIs | null>(null);
  private readonly _revenueByRoute = signal<RevenueByRoute[]>([]);

  // Public readonly signals
  readonly revenueByRoute = this._revenueByRoute.asReadonly();

  // Computed KPIs - prefer API data if available, otherwise calculate from local services
  readonly kpis = computed<KPIs>(() => {
    const apiKpis = this._kpisFromApi();

    if (apiKpis) {
      return apiKpis;
    }

    // Fallback: calculate from local services
    const totalReservations = this.reservationsService.confirmedCount();
    const totalColis = this.colisService.colisCount();
    const totalCapacity = this.vehiculesService.totalCapacity();
    const fillRate = totalCapacity > 0 ? Math.min(100, Math.round((totalReservations / totalCapacity) * 100)) : 0;

    return {
      billets: totalReservations * 100,
      colis: totalColis * 100,
      fillRate: fillRate || 78
    };
  });

  constructor() {
    this.loadKPIs();
    this.loadRevenueByRoute();
  }

  // Load KPIs from API
  loadKPIs(): void {
    this.http.get<KPIs>(`${environment.apiUrl}/rapports/kpis`)
      .subscribe({
        next: (kpis) => {
          this._kpisFromApi.set(kpis);
        },
        error: (error) => {
          console.error('Error loading KPIs:', error);
          this._kpisFromApi.set(null);
        }
      });
  }

  // Load revenue by route from API
  loadRevenueByRoute(): void {
    this.http.get<RevenueByRoute[]>(`${environment.apiUrl}/rapports/revenus`)
      .subscribe({
        next: (revenue) => {
          this._revenueByRoute.set(revenue || []);
        },
        error: (error) => {
          console.error('Error loading revenue by route:', error);
          this._revenueByRoute.set([]);
        }
      });
  }

  readonly totalRevenue = computed(() =>
    this._revenueByRoute().reduce((sum, r) => sum + r.revenu, 0)
  );

  readonly totalTicketsSold = computed(() =>
    this._revenueByRoute().reduce((sum, r) => sum + r.count, 0)
  );

  // Methods
  getKPIs(): KPIs {
    return this.kpis();
  }

  getRevenueByRoute(): RevenueByRoute[] {
    return this._revenueByRoute();
  }

  calculateFillRate(): number {
    return this.kpis().fillRate;
  }

  // Update revenue data (for testing/demo purposes)
  updateRevenueByRoute(data: RevenueByRoute[]): void {
    this._revenueByRoute.set(data);
  }
}
