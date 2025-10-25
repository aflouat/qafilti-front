import { Injectable, signal, computed, inject } from '@angular/core';
import { ReservationsService } from './reservations.service';
import { ColisService } from './colis.service';
import { PaiementsService } from './paiements.service';
import { VehiculesService } from './vehicules.service';

export interface KPIs {
  billets: number;
  colis: number;
  fillRate: number;
}

export interface RevenueByRoute {
  trajet: string;
  count: number;
  revenu: number;
}

@Injectable({ providedIn: 'root' })
export class RapportsService {
  // Inject dependencies
  private readonly reservationsService = inject(ReservationsService);
  private readonly colisService = inject(ColisService);
  private readonly paiementsService = inject(PaiementsService);
  private readonly vehiculesService = inject(VehiculesService);

  // Mock data for revenue by route (in a real app, this would be calculated from actual data)
  private readonly _revenueByRoute = signal<RevenueByRoute[]>([
    { trajet: 'Casa → Rabat', count: 120, revenu: 1440 },
    { trajet: 'Rabat → Fès', count: 80, revenu: 1440 },
    { trajet: 'Casa → Marrakech', count: 95, revenu: 1900 },
  ]);

  // Public readonly signals
  readonly revenueByRoute = this._revenueByRoute.asReadonly();

  // Computed KPIs from other services
  readonly kpis = computed<KPIs>(() => {
    const totalReservations = this.reservationsService.confirmedCount();
    const totalColis = this.colisService.colisCount();
    const totalCapacity = this.vehiculesService.totalCapacity();

    // Mock fill rate calculation (in reality, would need more complex logic)
    const fillRate = totalCapacity > 0 ? Math.min(100, Math.round((totalReservations / totalCapacity) * 100)) : 0;

    return {
      billets: totalReservations * 100, // Mock: assume 100 tickets sold per reservation
      colis: totalColis * 100, // Mock: assume 100 parcels per colis record
      fillRate: fillRate || 78 // Use calculated or fallback to 78%
    };
  });

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
