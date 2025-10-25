import { Injectable, signal, computed } from '@angular/core';

export interface Vehicule {
  id: number;
  matricule: string;
  modele: string;
  capacite: number;
}

@Injectable({ providedIn: 'root' })
export class VehiculesService {
  // Private state with signals
  private readonly _vehicules = signal<Vehicule[]>([
    { id: 1, matricule: 'ABC-123', modele: 'Mercedes Sprinter', capacite: 18 },
  ]);

  // Public readonly signals
  readonly vehicules = this._vehicules.asReadonly();
  readonly vehiculesCount = computed(() => this._vehicules().length);
  readonly totalCapacity = computed(() => this._vehicules().reduce((sum, v) => sum + v.capacite, 0));

  // CRUD Methods
  getAll(): Vehicule[] {
    return this._vehicules();
  }

  getById(id: number): Vehicule | undefined {
    return this._vehicules().find(v => v.id === id);
  }

  create(vehicule: Omit<Vehicule, 'id'>): Vehicule {
    const id = this.generateId();
    const newVehicule: Vehicule = { id, ...vehicule };
    this._vehicules.update(vehicules => [newVehicule, ...vehicules]);
    return newVehicule;
  }

  update(id: number, updates: Partial<Omit<Vehicule, 'id'>>): boolean {
    const index = this._vehicules().findIndex(v => v.id === id);
    if (index === -1) return false;

    this._vehicules.update(vehicules => {
      const updated = [...vehicules];
      updated[index] = { ...updated[index], ...updates };
      return updated;
    });
    return true;
  }

  delete(id: number): boolean {
    const initialLength = this._vehicules().length;
    this._vehicules.update(vehicules => vehicules.filter(v => v.id !== id));
    return this._vehicules().length < initialLength;
  }

  // Business logic methods
  getTotalCapacity(): number {
    return this.totalCapacity();
  }

  private generateId(): number {
    const ids = this._vehicules().map(v => v.id);
    return ids.length ? Math.max(...ids) + 1 : 1;
  }
}
