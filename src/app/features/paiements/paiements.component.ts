import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-paiements',
  imports: [TableModule, DialogModule, InputTextModule, InputNumberModule, ButtonModule, FormsModule, CurrencyPipe],
  templateUrl: './paiements.component.html',
  styleUrls: ['./paiements.component.css']
})
export class PaiementsComponent {
  rows = [
    { ref: '12345', type: 'Acompte', montant: 500, mode: 'Carte bancaire', note: 'Premier paiement' },
    { ref: '67890', type: 'Solde', montant: 1500, mode: 'Virement', note: 'Paiement final' }
  ];
  test(){
    console.log('test');
  }
}
