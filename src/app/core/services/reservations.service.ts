import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environements/environment';

export interface Reservation {
  reservationId?: string;
  id?: number;
  code?: string;
  tripId?: string;
  passager?: string;
  passengerName?: string;
  passengerPhone?: string;
  trajet?: string;
  date?: Date | string;
  prix?: number;
  netAmount?: number;
  seatNumber?: string;
  statut?: 'Brouillon' | 'Confirmée' | 'CONFIRMED' | 'PENDING' | 'CREATED';
  status?: string;
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class ReservationsService {
  private readonly http = inject(HttpClient);

  // Private state with signals
  private readonly _reservations = signal<Reservation[]>([]);

  // Public readonly signals
  readonly reservations = this._reservations.asReadonly();
  readonly reservationsCount = computed(() => this._reservations().length);
  readonly confirmedCount = computed(() => {
    return this._reservations().filter(r =>
      r.statut === 'Confirmée' || r.status === 'CONFIRMED'
    ).length;
  });
  readonly todayCount = computed(() => {
    const today = new Date().toDateString();
    return this._reservations().filter(r => {
      const reservDate = r.date ? new Date(r.date) : null;
      return reservDate && reservDate.toDateString() === today;
    }).length;
  });

  constructor() {
    this.loadReservations();
  }

  // Load data from API
  loadReservations(): void {
    this.http.get<{ reservations: Reservation[] }>(`${environment.apiUrl}/reservation`)
      .subscribe({
        next: (response) => {
          // Map Mockoon data to application format
          const mappedReservations = (response.reservations || []).map(r => ({
            ...r,
            // Map Mockoon fields to app fields
            code: r.code || r.reservationId || '',
            passager: r.passager || r.passengerName || '',
            trajet: r.trajet || r.tripId || 'Trajet à définir',
            prix: r.prix ?? r.netAmount ?? 0,
            statut: this.mapStatus(r.status || r.statut),
            // Keep original fields for compatibility
            reservationId: r.reservationId,
            passengerName: r.passengerName,
            netAmount: r.netAmount
          }));
          this._reservations.set(mappedReservations);
        },
        error: (error) => {
          console.error('Error loading reservations:', error);
          // Fallback to empty array on error
          this._reservations.set([]);
        }
      });
  }

  // Map English status to French
  private mapStatus(status?: string): 'Brouillon' | 'Confirmée' {
    if (!status) return 'Brouillon';
    const statusMap: Record<string, 'Brouillon' | 'Confirmée'> = {
      'CONFIRMED': 'Confirmée',
      'PENDING': 'Brouillon',
      'CREATED': 'Brouillon',
      'Confirmée': 'Confirmée',
      'Brouillon': 'Brouillon'
    };
    return statusMap[status] || 'Brouillon';
  }

  // CRUD Methods
  getAll(): Reservation[] {
    return this._reservations();
  }

  getById(id: number | string): Reservation | undefined {
    return this._reservations().find(r =>
      r.id === id || r.reservationId === id
    );
  }

  create(reservation: Partial<Reservation>): Reservation {
    const newReservation: Reservation = {
      id: this.generateId(),
      code: this.generateCode(this.generateId()),
      ...reservation
    };
    this._reservations.update(reservations => [newReservation, ...reservations]);
    return newReservation;
  }

  update(id: number | string, updates: Partial<Reservation>): boolean {
    const index = this._reservations().findIndex(r =>
      r.id === id || r.reservationId === id
    );
    if (index === -1) return false;

    this._reservations.update(reservations => {
      const updated = [...reservations];
      updated[index] = { ...updated[index], ...updates };
      return updated;
    });
    return true;
  }

  delete(id: number | string): boolean {
    const initialLength = this._reservations().length;
    this._reservations.update(reservations =>
      reservations.filter(r => r.id !== id && r.reservationId !== id)
    );
    return this._reservations().length < initialLength;
  }

  // Business logic methods
  confirm(id: number | string): boolean {
    const reservation = this.getById(id);
    if (!reservation) return false;
    if (reservation.statut === 'Confirmée' || reservation.status === 'CONFIRMED') {
      return false;
    }

    return this.update(id, { statut: 'Confirmée', status: 'CONFIRMED' });
  }

  private generateId(): number {
    const ids = this._reservations().map(r => r.id || 0).filter(id => id > 0);
    return ids.length ? Math.max(...ids) + 1 : 1;
  }

  private generateCode(id: number): string {
    return `RSV-${id.toString().padStart(4, '0')}`;
  }
}
