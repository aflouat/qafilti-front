import { Component } from '@angular/core';
import { Tabs, Tab, TabPanels, TabPanel, TabList } from 'primeng/tabs';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [Tabs, Tab, TabPanels, TabPanel, TabList, TableModule, DialogModule, InputTextModule, FormsModule, ButtonModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  // Trajets
  trajets: { id:number; code:string; origine:string; destination:string }[] = [
    { id:1, code:'TRJ-01', origine:'Casa', destination:'Rabat' },
  ];
  trajetDialog=false; currentTrajet:any=null; trajetForm:any={};
  openTrajet(){ this.currentTrajet=null; this.trajetForm={}; this.trajetDialog=true; }
  editTrajet(t:any){ this.currentTrajet=t; this.trajetForm={...t}; this.trajetDialog=true; }
  saveTrajet(){ if(this.currentTrajet){ Object.assign(this.currentTrajet,this.trajetForm);} else { const id=Math.max(0,...this.trajets.map(x=>x.id))+1; this.trajets.unshift({ id, ...this.trajetForm }); } this.trajetDialog=false; }
  removeTrajet(t:any){ this.trajets=this.trajets.filter(x=>x.id!==t.id); }

  // Véhicules
  vehicules: { id:number; matricule:string; modele:string; capacite:number }[] = [
    { id:1, matricule:'ABC-123', modele:'Mercedes Sprinter', capacite:18 },
  ];
  vehiculeDialog=false; currentVehicule:any=null; vehiculeForm:any={};
  openVehicule(){ this.currentVehicule=null; this.vehiculeForm={}; this.vehiculeDialog=true; }
  editVehicule(v:any){ this.currentVehicule=v; this.vehiculeForm={...v}; this.vehiculeDialog=true; }
  saveVehicule(){ if(this.currentVehicule){ Object.assign(this.currentVehicule,this.vehiculeForm);} else { const id=Math.max(0,...this.vehicules.map(x=>x.id))+1; this.vehicules.unshift({ id, ...this.vehiculeForm }); } this.vehiculeDialog=false; }
  removeVehicule(v:any){ this.vehicules=this.vehicules.filter(x=>x.id!==v.id); }

  // Tarifs
  tarifs: { id:number; trajet:string; prix:number }[] = [
    { id:1, trajet:'Casa → Rabat', prix:12 },
  ];
  tarifDialog=false; currentTarif:any=null; tarifForm:any={};
  openTarif(){ this.currentTarif=null; this.tarifForm={}; this.tarifDialog=true; }
  editTarif(f:any){ this.currentTarif=f; this.tarifForm={...f}; this.tarifDialog=true; }
  saveTarif(){ if(this.currentTarif){ Object.assign(this.currentTarif,this.tarifForm);} else { const id=Math.max(0,...this.tarifs.map(x=>x.id))+1; this.tarifs.unshift({ id, ...this.tarifForm }); } this.tarifDialog=false; }
  removeTarif(f:any){ this.tarifs=this.tarifs.filter(x=>x.id!==f.id); }
}
