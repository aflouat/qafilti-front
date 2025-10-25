import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environements/environment';

export interface Reservation {
  id: number;
  code: string;
  passager: string;
  trajet: string;
  date: Date;
  prix: number;
  statut: 'Brouillon' | 'Confirmée';
}

/**
 * EXEMPLE: ReservationsService avec intégration HttpClient
 *
 * Pour utiliser ce service au lieu de la version mock:
 * 1. Renommer ce fichier en 'reservations.service.ts' (remplacer l'existant)
 * 2. Démarrer Mockoon avec la configuration dans src/assets/qafilti-mockoon.json
 * 3. Les données seront maintenant chargées depuis l'API au lieu du mock
 */
@Injectable({ providedIn: 'root' })
export class ReservationsServiceWithHttp {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/reservations`;

  // Private state with signals
  private readonly _reservations = signal<Reservation[]>([]);

  // Public readonly signals
  readonly reservations = this._reservations.asReadonly();
  readonly reservationsCount = computed(() => this._reservations().length);
  readonly confirmedCount = computed(() => this._reservations().filter(r => r.statut === 'Confirmée').length);
  readonly todayCount = computed(() => {
    const today = new Date().toDateString();
    return this._reservations().filter(r => new Date(r.date).toDateString() === today).length;
  });

  constructor() {
    // Charger les données initiales au démarrage
    this.loadReservations();
  }

  // Load data from API
  private loadReservations(): void {
    this.http.get<Reservation[]>(this.apiUrl)
      .subscribe({
        next: (reservations) => {
          // Convertir les dates strings en objets Date
          const parsed = reservations.map(r => ({
            ...r,
            date: new Date(r.date)
          }));
          this._reservations.set(parsed);
        },
        error: (error) => {
          console.error('Erreur lors du chargement des réservations:', error);
          // En cas d'erreur, charger les données mock
          this.loadMockData();
        }
      });
  }

  private loadMockData(): void {
    this._reservations.set([
      { id: 1, code: 'RSV-0001', passager: 'Amina L.', trajet: 'Casa → Rabat', date: new Date(), prix: 12, statut: 'Confirmée' },
      { id: 2, code: 'RSV-0002', passager: 'Youssef M.', trajet: 'Rabat → Fès', date: new Date(), prix: 18, statut: 'Brouillon' },
    ]);
  }

  // CRUD Methods with HTTP
  getAll(): Reservation[] {
    return this._reservations();
  }

  getById(id: number): Reservation | undefined {
    return this._reservations().find(r => r.id === id);
  }

  create(reservation: Omit<Reservation, 'id' | 'code'>): Observable<Reservation> {
    return this.http.post<Reservation>(this.apiUrl, reservation)
      .pipe(
        tap((newReservation) => {
          // Mettre à jour le signal local
          this._reservations.update(reservations => [
            { ...newReservation, date: new Date(newReservation.date) },
            ...reservations
          ]);
        })
      );
  }

  update(id: number, updates: Partial<Omit<Reservation, 'id' | 'code'>>): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.apiUrl}/${id}`, updates)
      .pipe(
        tap((updatedReservation) => {
          // Mettre à jour le signal local
          const index = this._reservations().findIndex(r => r.id === id);
          if (index !== -1) {
            this._reservations.update(reservations => {
              const updated = [...reservations];
              updated[index] = { ...updatedReservation, date: new Date(updatedReservation.date) };
              return updated;
            });
          }
        })
      );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(() => {
          // Mettre à jour le signal local
          this._reservations.update(reservations => reservations.filter(r => r.id !== id));
        })
      );
  }

  // Business logic methods
  confirm(id: number): Observable<Reservation> {
    return this.update(id, { statut: 'Confirmée' });
  }

  // Note: En version HTTP, la génération de code se fait côté backend
}
