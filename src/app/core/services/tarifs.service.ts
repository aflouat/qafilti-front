import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environements/environment';

export interface Tarif {
  id: number;
  trajet: string;
  prix: number;
}

@Injectable({ providedIn: 'root' })
export class TarifsService {
  private readonly http = inject(HttpClient);

  // Private state with signals
  private readonly _tarifs = signal<Tarif[]>([]);

  // Public readonly signals
  readonly tarifs = this._tarifs.asReadonly();
  readonly tarifsCount = computed(() => this._tarifs().length);
  readonly averagePrice = computed(() => {
    const tarifs = this._tarifs();
    if (tarifs.length === 0) return 0;
    return tarifs.reduce((sum, t) => sum + t.prix, 0) / tarifs.length;
  });

  constructor() {
    this.loadTarifs();
  }

  // Load data from API
  loadTarifs(): void {
    this.http.get<Tarif[]>(`${environment.apiUrl}/tarifs`)
      .subscribe({
        next: (tarifs) => {
          this._tarifs.set(tarifs || []);
        },
        error: (error) => {
          console.error('Error loading tarifs:', error);
          this._tarifs.set([]);
        }
      });
  }

  // CRUD Methods
  getAll(): Tarif[] {
    return this._tarifs();
  }

  getById(id: number): Tarif | undefined {
    return this._tarifs().find(t => t.id === id);
  }

  findByRoute(trajet: string): Tarif | undefined {
    return this._tarifs().find(t => t.trajet === trajet);
  }

  create(tarif: Omit<Tarif, 'id'>): Tarif {
    const id = this.generateId();
    const newTarif: Tarif = { id, ...tarif };
    this._tarifs.update(tarifs => [newTarif, ...tarifs]);
    return newTarif;
  }

  update(id: number, updates: Partial<Omit<Tarif, 'id'>>): boolean {
    const index = this._tarifs().findIndex(t => t.id === id);
    if (index === -1) return false;

    this._tarifs.update(tarifs => {
      const updated = [...tarifs];
      updated[index] = { ...updated[index], ...updates };
      return updated;
    });
    return true;
  }

  delete(id: number): boolean {
    const initialLength = this._tarifs().length;
    this._tarifs.update(tarifs => tarifs.filter(t => t.id !== id));
    return this._tarifs().length < initialLength;
  }

  private generateId(): number {
    const ids = this._tarifs().map(t => t.id);
    return ids.length ? Math.max(...ids) + 1 : 1;
  }
}
