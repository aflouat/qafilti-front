import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CardModule, ButtonModule, RouterModule, CurrencyPipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  kpis = {
    resaToday: 12,
    parcelsTransit: 27,
    revenueMonth: 15840
  };
}
