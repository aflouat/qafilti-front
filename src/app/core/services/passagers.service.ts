import { Injectable, signal, computed } from '@angular/core';

export interface Passager {
  id: number;
  nom: string;
  telephone: string;
  document: string;
}

@Injectable({ providedIn: 'root' })
export class PassagersService {
  // Private state with signals
  private readonly _passagers = signal<Passager[]>([
    { id: 1, nom: 'Jean Dupont', telephone: '0601020304', document: 'CIN123456' },
    { id: 2, nom: 'Marie Curie', telephone: '0605060708', document: 'CIN654321' },
    { id: 3, nom: 'Ali Ben Ali', telephone: '0611121314', document: 'CIN112233' }
  ]);

  // Public readonly signals
  readonly passagers = this._passagers.asReadonly();
  readonly passagersCount = computed(() => this._passagers().length);

  // CRUD Methods
  getAll(): Passager[] {
    return this._passagers();
  }

  getById(id: number): Passager | undefined {
    return this._passagers().find(p => p.id === id);
  }

  create(passager: Omit<Passager, 'id'>): Passager {
    const id = this.generateId();
    const newPassager: Passager = { id, ...passager };
    this._passagers.update(passagers => [...passagers, newPassager]);
    return newPassager;
  }

  update(id: number, updates: Partial<Omit<Passager, 'id'>>): boolean {
    const index = this._passagers().findIndex(p => p.id === id);
    if (index === -1) return false;

    this._passagers.update(passagers => {
      const updated = [...passagers];
      updated[index] = { ...updated[index], ...updates };
      return updated;
    });
    return true;
  }

  delete(id: number): boolean {
    const initialLength = this._passagers().length;
    this._passagers.update(passagers => passagers.filter(p => p.id !== id));
    return this._passagers().length < initialLength;
  }

  private generateId(): number {
    const ids = this._passagers().map(p => p.id);
    return ids.length ? Math.max(...ids) + 1 : 1;
  }
}
