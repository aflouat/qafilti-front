import { Component, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { DecimalPipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { RapportsService } from '../../core/services/rapports.service';

@Component({
  standalone: true,
  selector: 'app-rapports',
  imports: [CardModule, TableModule, DecimalPipe],
  templateUrl: './rapports.component.html',
  styleUrls: ['./rapports.component.css']
})
export class RapportsComponent {
  private readonly rapportsService = inject(RapportsService);

  // Use service signals directly
  readonly kpis = this.rapportsService.kpis;
  readonly revenusTrajets = this.rapportsService.revenueByRoute;
}
