import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { Select } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-colis',
  imports: [CommonModule, TableModule, DialogModule, InputTextModule, InputNumberModule, Select, ButtonModule, TagModule, FormsModule],
  templateUrl: './colis.component.html',
  styleUrls: ['./colis.component.css']
})
export class ColisComponent {
  colis: { id:number; code:string; expediteur:string; destinataire:string; poids:number; tarif:number; statut:'En transit'|'Livré' }[] = [
    { id:1, code:'CLS-0001', expediteur:'Nadia', destinataire:'Karim', poids:3.2, tarif:8, statut:'En transit' },
  ];
  dialog=false; current:any=null; form:any={}; globalFilter='';
  statuts=[{label:'En transit', value:'En transit'},{label:'Livré', value:'Livré'}];

  openNew(){ this.current=null; this.form={ statut:'En transit', poids:0, tarif:0 }; this.dialog=true; }
  edit(c:any){ this.current=c; this.form={...c}; this.dialog=true; }
  save(){ if(this.current){ Object.assign(this.current,this.form);} else { const id=Math.max(0,...this.colis.map(x=>x.id))+1; const code=`CLS-${id.toString().padStart(4,'0')}`; this.colis.unshift({ id, code, ...this.form }); } this.dialog=false; }
  remove(c:any){ this.colis=this.colis.filter(x=>x.id!==c.id); }
  markDelivered(c:any){ c.statut='Livré'; }
}
