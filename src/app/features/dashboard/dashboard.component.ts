import { Component, inject, computed } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ReservationsService } from '../../core/services/reservations.service';
import { ColisService } from '../../core/services/colis.service';
import { PaiementsService } from '../../core/services/paiements.service';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CardModule, ButtonModule, RouterModule, DecimalPipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  private readonly reservationsService = inject(ReservationsService);
  private readonly colisService = inject(ColisService);
  private readonly paiementsService = inject(PaiementsService);

  // Computed KPIs from services
  readonly kpis = computed(() => ({
    resaToday: this.reservationsService.todayCount(),
    parcelsTransit: this.colisService.inTransitCount(),
    revenueMonth: this.paiementsService.totalAmount()
  }));
}
