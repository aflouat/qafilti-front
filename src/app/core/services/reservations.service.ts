import { Injectable, signal, computed } from '@angular/core';

export interface Reservation {
  id: number;
  code: string;
  passager: string;
  trajet: string;
  date: Date;
  prix: number;
  statut: 'Brouillon' | 'Confirmée';
}

@Injectable({ providedIn: 'root' })
export class ReservationsService {
  // Private state with signals
  private readonly _reservations = signal<Reservation[]>([
    { id: 1, code: 'RSV-0001', passager: 'Amina L.', trajet: 'Casa → Rabat', date: new Date(), prix: 12, statut: 'Confirmée' },
    { id: 2, code: 'RSV-0002', passager: 'Youssef M.', trajet: 'Rabat → Fès', date: new Date(), prix: 18, statut: 'Brouillon' },
  ]);

  // Public readonly signals
  readonly reservations = this._reservations.asReadonly();
  readonly reservationsCount = computed(() => this._reservations().length);
  readonly confirmedCount = computed(() => this._reservations().filter(r => r.statut === 'Confirmée').length);
  readonly todayCount = computed(() => {
    const today = new Date().toDateString();
    return this._reservations().filter(r => new Date(r.date).toDateString() === today).length;
  });

  // CRUD Methods
  getAll(): Reservation[] {
    return this._reservations();
  }

  getById(id: number): Reservation | undefined {
    return this._reservations().find(r => r.id === id);
  }

  create(reservation: Omit<Reservation, 'id' | 'code'>): Reservation {
    const id = this.generateId();
    const code = this.generateCode(id);
    const newReservation: Reservation = {
      id,
      code,
      ...reservation
    };
    this._reservations.update(reservations => [newReservation, ...reservations]);
    return newReservation;
  }

  update(id: number, updates: Partial<Omit<Reservation, 'id' | 'code'>>): boolean {
    const index = this._reservations().findIndex(r => r.id === id);
    if (index === -1) return false;

    this._reservations.update(reservations => {
      const updated = [...reservations];
      updated[index] = { ...updated[index], ...updates };
      return updated;
    });
    return true;
  }

  delete(id: number): boolean {
    const initialLength = this._reservations().length;
    this._reservations.update(reservations => reservations.filter(r => r.id !== id));
    return this._reservations().length < initialLength;
  }

  // Business logic methods
  confirm(id: number): boolean {
    const reservation = this.getById(id);
    if (!reservation || reservation.statut === 'Confirmée') return false;

    return this.update(id, { statut: 'Confirmée' });
  }

  private generateId(): number {
    const ids = this._reservations().map(r => r.id);
    return ids.length ? Math.max(...ids) + 1 : 1;
  }

  private generateCode(id: number): string {
    return `RSV-${id.toString().padStart(4, '0')}`;
  }
}
