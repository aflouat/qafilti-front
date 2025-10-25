import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environements/environment';

export interface Trajet {
  id?: number;
  code?: string;
  tripId?: string;
  origine?: string;
  destination?: string;
  departureCityName?: string;
  arrivalCityName?: string;
  date?: string;
  vehicleId?: string;
  departureTime?: string;
  arrivalTime?: string;
}

@Injectable({ providedIn: 'root' })
export class TrajetsService {
  private readonly http = inject(HttpClient);

  // Private state with signals
  private readonly _trajets = signal<Trajet[]>([]);

  // Public readonly signals
  readonly trajets = this._trajets.asReadonly();
  readonly trajetsCount = computed(() => this._trajets().length);

  constructor() {
    this.loadTrajets();
  }

  // Load data from API
  loadTrajets(): void {
    this.http.get<{ trips: Trajet[] }>(`${environment.apiUrl}/trips`)
      .subscribe({
        next: (response) => {
          this._trajets.set(response.trips || []);
        },
        error: (error) => {
          console.error('Error loading trajets:', error);
          this._trajets.set([]);
        }
      });
  }

  // CRUD Methods
  getAll(): Trajet[] {
    return this._trajets();
  }

  getById(id: number): Trajet | undefined {
    return this._trajets().find(t => t.id === id);
  }

  create(trajet: Omit<Trajet, 'id'>): Trajet {
    const id = this.generateId();
    const newTrajet: Trajet = { id, ...trajet };
    this._trajets.update(trajets => [newTrajet, ...trajets]);
    return newTrajet;
  }

  update(id: number, updates: Partial<Omit<Trajet, 'id'>>): boolean {
    const index = this._trajets().findIndex(t => t.id === id);
    if (index === -1) return false;

    this._trajets.update(trajets => {
      const updated = [...trajets];
      updated[index] = { ...updated[index], ...updates };
      return updated;
    });
    return true;
  }

  delete(id: number): boolean {
    const initialLength = this._trajets().length;
    this._trajets.update(trajets => trajets.filter(t => t.id !== id));
    return this._trajets().length < initialLength;
  }

  private generateId(): number {
    const ids = this._trajets().map(t => t.id).filter((id): id is number => id !== undefined);
    return ids.length ? Math.max(...ids) + 1 : 1;
  }
}
