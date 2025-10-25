import { Injectable, signal, computed } from '@angular/core';

export interface Paiement {
  id: number;
  ref: string;
  type: 'Acompte' | 'Solde';
  montant: number;
  mode: 'Carte bancaire' | 'Virement' | 'Espèces';
  note?: string;
}

@Injectable({ providedIn: 'root' })
export class PaiementsService {
  // Private state with signals
  private readonly _paiements = signal<Paiement[]>([
    { id: 1, ref: '12345', type: 'Acompte', montant: 500, mode: 'Carte bancaire', note: 'Premier paiement' },
    { id: 2, ref: '67890', type: 'Solde', montant: 1500, mode: 'Virement', note: 'Paiement final' }
  ]);

  // Public readonly signals
  readonly paiements = this._paiements.asReadonly();
  readonly paiementsCount = computed(() => this._paiements().length);
  readonly totalAmount = computed(() => this._paiements().reduce((sum, p) => sum + p.montant, 0));
  readonly acompteAmount = computed(() =>
    this._paiements().filter(p => p.type === 'Acompte').reduce((sum, p) => sum + p.montant, 0)
  );
  readonly soldeAmount = computed(() =>
    this._paiements().filter(p => p.type === 'Solde').reduce((sum, p) => sum + p.montant, 0)
  );

  // CRUD Methods
  getAll(): Paiement[] {
    return this._paiements();
  }

  getById(id: number): Paiement | undefined {
    return this._paiements().find(p => p.id === id);
  }

  create(paiement: Omit<Paiement, 'id'>): Paiement {
    const id = this.generateId();
    const newPaiement: Paiement = { id, ...paiement };
    this._paiements.update(paiements => [...paiements, newPaiement]);
    return newPaiement;
  }

  update(id: number, updates: Partial<Omit<Paiement, 'id'>>): boolean {
    const index = this._paiements().findIndex(p => p.id === id);
    if (index === -1) return false;

    this._paiements.update(paiements => {
      const updated = [...paiements];
      updated[index] = { ...updated[index], ...updates };
      return updated;
    });
    return true;
  }

  delete(id: number): boolean {
    const initialLength = this._paiements().length;
    this._paiements.update(paiements => paiements.filter(p => p.id !== id));
    return this._paiements().length < initialLength;
  }

  // Business logic methods
  getTotalByType(type: 'Acompte' | 'Solde'): number {
    return this._paiements()
      .filter(p => p.type === type)
      .reduce((sum, p) => sum + p.montant, 0);
  }

  private generateId(): number {
    const ids = this._paiements().map(p => p.id);
    return ids.length ? Math.max(...ids) + 1 : 1;
  }
}
