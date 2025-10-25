import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environements/environment';

export interface Colis {
  id: number;
  code: string;
  expediteur: string;
  destinataire: string;
  poids: number;
  tarif: number;
  statut: 'En transit' | 'Livré';
}

@Injectable({ providedIn: 'root' })
export class ColisService {
  private readonly http = inject(HttpClient);

  // Private state with signals
  private readonly _colis = signal<Colis[]>([]);

  // Public readonly signals
  readonly colis = this._colis.asReadonly();
  readonly colisCount = computed(() => this._colis().length);
  readonly inTransitCount = computed(() => this._colis().filter(c => c.statut === 'En transit').length);
  readonly deliveredCount = computed(() => this._colis().filter(c => c.statut === 'Livré').length);

  constructor() {
    this.loadColis();
  }

  // Load data from API
  loadColis(): void {
    this.http.get<Colis[]>(`${environment.apiUrl}/colis`)
      .subscribe({
        next: (colis) => {
          this._colis.set(colis || []);
        },
        error: (error) => {
          console.error('Error loading colis:', error);
          this._colis.set([]);
        }
      });
  }

  // CRUD Methods
  getAll(): Colis[] {
    return this._colis();
  }

  getById(id: number): Colis | undefined {
    return this._colis().find(c => c.id === id);
  }

  getInTransit(): Colis[] {
    return this._colis().filter(c => c.statut === 'En transit');
  }

  create(colis: Omit<Colis, 'id' | 'code'>): Colis {
    const id = this.generateId();
    const code = this.generateCode(id);
    const newColis: Colis = { id, code, ...colis };
    this._colis.update(colis => [newColis, ...colis]);
    return newColis;
  }

  update(id: number, updates: Partial<Omit<Colis, 'id' | 'code'>>): boolean {
    const index = this._colis().findIndex(c => c.id === id);
    if (index === -1) return false;

    this._colis.update(colis => {
      const updated = [...colis];
      updated[index] = { ...updated[index], ...updates };
      return updated;
    });
    return true;
  }

  delete(id: number): boolean {
    const initialLength = this._colis().length;
    this._colis.update(colis => colis.filter(c => c.id !== id));
    return this._colis().length < initialLength;
  }

  // Business logic methods
  markAsDelivered(id: number): boolean {
    return this.update(id, { statut: 'Livré' });
  }

  private generateId(): number {
    const ids = this._colis().map(c => c.id);
    return ids.length ? Math.max(...ids) + 1 : 1;
  }

  private generateCode(id: number): string {
    return `CLS-${id.toString().padStart(4, '0')}`;
  }
}
