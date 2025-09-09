import { Component, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { TableModule } from 'primeng/table';

@Component({
  standalone: true,
  selector: 'app-rapports',
  imports: [CardModule, TableModule, DecimalPipe, CurrencyPipe],
  templateUrl: './rapports.component.html',
  styleUrls: ['./rapports.component.css']
})
export class RapportsComponent {
  revenusTrajets = [
    { trajet:'Casa → Rabat', count:120, revenu:1440 },
    { trajet:'Rabat → Fès', count:80, revenu:1440 },
    { trajet:'Casa → Marrakech', count:95, revenu:1900 },
  ];
  kpis = signal({ billets: 3200, colis: 860, fillRate: 78 });
}
