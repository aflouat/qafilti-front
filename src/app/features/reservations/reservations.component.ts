import { Component, inject } from '@angular/core';
import { DatePipe, CurrencyPipe, CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { DatePicker } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InputNumberModule } from 'primeng/inputnumber';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';
import { ReservationsService, Reservation } from '../../core/services/reservations.service';

@Component({
  standalone: true,
  selector: 'app-reservations',
  imports: [TableModule, DialogModule, InputTextModule, Select, DatePicker, ButtonModule, TagModule, FormsModule, InputNumberModule, TooltipModule, DatePipe, CurrencyPipe, CommonModule],
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent {
  private readonly reservationsService = inject(ReservationsService);

  // Use service signals directly
  readonly reservations = this.reservationsService.reservations;

  statuts = [{ label:'Brouillon', value:'Brouillon' },{ label:'Confirmée', value:'Confirmée' }];

  dialog = false;
  currentId: number | string | null | undefined = null;
  form: Partial<Reservation> = {};
  globalFilter = '';

  openNew() {
    this.currentId = null;
    this.form = { date: new Date(), statut: 'Brouillon', prix: 0, passager: '', trajet: '' };
    this.dialog = true;
  }

  edit(r: Reservation) {
    this.currentId = r.id || r.reservationId;
    this.form = { ...r };
    this.dialog = true;
  }

  save() {
    if (this.currentId) {
      // Update existing
      this.reservationsService.update(this.currentId, this.form);
    } else {
      // Create new
      if (this.form.passager && this.form.trajet && this.form.date && this.form.prix !== undefined && this.form.statut) {
        this.reservationsService.create({
          passager: this.form.passager,
          trajet: this.form.trajet,
          date: this.form.date,
          prix: this.form.prix,
          statut: this.form.statut
        });
      }
    }
    this.dialog = false;
  }

  remove(r: Reservation) {
    const id = r.id || r.reservationId;
    if (id !== undefined) {
      this.reservationsService.delete(id);
    }
  }

  confirm(r: Reservation) {
    const id = r.id || r.reservationId;
    if (id !== undefined) {
      this.reservationsService.confirm(id);
    }
  }

  print(r: Reservation) {
    window.print();
  }
}
