import { Component, inject } from '@angular/core';
import { Tabs, Tab, TabPanels, TabPanel, TabList } from 'primeng/tabs';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { TrajetsService, Trajet } from '../../core/services/trajets.service';
import { VehiculesService, Vehicule } from '../../core/services/vehicules.service';
import { TarifsService, Tarif } from '../../core/services/tarifs.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [Tabs, Tab, TabPanels, TabPanel, TabList, TableModule, DialogModule, InputTextModule, InputNumberModule, FormsModule, ButtonModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  private readonly trajetsService = inject(TrajetsService);
  private readonly vehiculesService = inject(VehiculesService);
  private readonly tarifsService = inject(TarifsService);

  // Use service signals directly
  readonly trajets = this.trajetsService.trajets;
  readonly vehicules = this.vehiculesService.vehicules;
  readonly tarifs = this.tarifsService.tarifs;

  // Trajets
  trajetDialog = false;
  currentTrajetId: number | null = null;
  trajetForm: Partial<Trajet> = {};

  openTrajet() {
    this.currentTrajetId = null;
    this.trajetForm = {};
    this.trajetDialog = true;
  }

  editTrajet(t: Trajet) {
    this.currentTrajetId = t.id;
    this.trajetForm = { ...t };
    this.trajetDialog = true;
  }

  saveTrajet() {
    if (this.currentTrajetId) {
      this.trajetsService.update(this.currentTrajetId, this.trajetForm);
    } else {
      if (this.trajetForm.code && this.trajetForm.origine && this.trajetForm.destination) {
        this.trajetsService.create({
          code: this.trajetForm.code,
          origine: this.trajetForm.origine,
          destination: this.trajetForm.destination
        });
      }
    }
    this.trajetDialog = false;
  }

  removeTrajet(t: Trajet) {
    this.trajetsService.delete(t.id);
  }

  // Véhicules
  vehiculeDialog = false;
  currentVehiculeId: number | null = null;
  vehiculeForm: Partial<Vehicule> = {};

  openVehicule() {
    this.currentVehiculeId = null;
    this.vehiculeForm = {};
    this.vehiculeDialog = true;
  }

  editVehicule(v: Vehicule) {
    this.currentVehiculeId = v.id;
    this.vehiculeForm = { ...v };
    this.vehiculeDialog = true;
  }

  saveVehicule() {
    if (this.currentVehiculeId) {
      this.vehiculesService.update(this.currentVehiculeId, this.vehiculeForm);
    } else {
      if (this.vehiculeForm.matricule && this.vehiculeForm.modele && this.vehiculeForm.capacite !== undefined) {
        this.vehiculesService.create({
          matricule: this.vehiculeForm.matricule,
          modele: this.vehiculeForm.modele,
          capacite: this.vehiculeForm.capacite
        });
      }
    }
    this.vehiculeDialog = false;
  }

  removeVehicule(v: Vehicule) {
    this.vehiculesService.delete(v.id);
  }

  // Tarifs
  tarifDialog = false;
  currentTarifId: number | null = null;
  tarifForm: Partial<Tarif> = {};

  openTarif() {
    this.currentTarifId = null;
    this.tarifForm = {};
    this.tarifDialog = true;
  }

  editTarif(f: Tarif) {
    this.currentTarifId = f.id;
    this.tarifForm = { ...f };
    this.tarifDialog = true;
  }

  saveTarif() {
    if (this.currentTarifId) {
      this.tarifsService.update(this.currentTarifId, this.tarifForm);
    } else {
      if (this.tarifForm.trajet && this.tarifForm.prix !== undefined) {
        this.tarifsService.create({
          trajet: this.tarifForm.trajet,
          prix: this.tarifForm.prix
        });
      }
    }
    this.tarifDialog = false;
  }

  removeTarif(f: Tarif) {
    this.tarifsService.delete(f.id);
  }
}
