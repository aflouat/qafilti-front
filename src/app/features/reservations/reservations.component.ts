import { Component } from '@angular/core';
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

export interface Reservation {
  id: number;
  code: string;
  passager: string;
  trajet: string;
  date: Date;
  prix: number;
  statut: 'Brouillon' | 'Confirmée';
}

@Component({
  standalone: true,
  selector: 'app-reservations',
  imports: [TableModule, DialogModule, InputTextModule, Select, DatePicker, ButtonModule, TagModule, FormsModule, InputNumberModule, TooltipModule, DatePipe, CurrencyPipe, CommonModule],
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent {
  reservations: Reservation[] = [
    { id:1, code:'RSV-0001', passager:'Amina L.', trajet:'Casa → Rabat', date:new Date(), prix:12, statut:'Confirmée' },
    { id:2, code:'RSV-0002', passager:'Youssef M.', trajet:'Rabat → Fès', date:new Date(), prix:18, statut:'Brouillon' },
  ];

  statuts = [{ label:'Brouillon', value:'Brouillon' },{ label:'Confirmée', value:'Confirmée' }];

  dialog = false;
  current: Reservation | null = null;
  form: any = {};
  globalFilter = '';

  openNew(){ this.current = null; this.form = { date:new Date(), statut:'Brouillon', prix:0 }; this.dialog = true; }
  edit(r: Reservation){ this.current = r; this.form = { ...r }; this.dialog = true; }

  save(){
    if(this.current){
      Object.assign(this.current, this.form);
    } else {
      const id = Math.max(0, ...this.reservations.map(x=>x.id)) + 1;
      const code = `RSV-${id.toString().padStart(4,'0')}`;
      this.reservations.unshift({ id, code, ...this.form });
    }
    this.dialog = false;
  }

  remove(r: Reservation){ this.reservations = this.reservations.filter(x=>x.id!==r.id); }
  confirm(r: Reservation){
    if(r.statut !== 'Confirmée'){
      // ensure code exists
      if(!r.code){
        const id = Math.max(0, ...this.reservations.map(x=>x.id)) + 1;
        r.code = `RSV-${id.toString().padStart(4,'0')}`;
        r.id = id;
      }
      r.statut = 'Confirmée';
    }
  }
  print(r: Reservation){ window.print(); }
}
