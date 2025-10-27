import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environements/environment';

export interface Trip {
  tripId?: string;
  date?: string;
  departureCityId?: string;
  departureCityName?: string;
  departureCityNameAr?: string;
  arrivalCityId?: string;
  arrivalCityName?: string;
  arrivalCityNameAr?: string;
  vehicleId?: string;
  departureTime?: string;
  arrivalTime?: string;
}

@Injectable({ providedIn: 'root' })
export class TripsService {
  private readonly http = inject(HttpClient);

  // Private state with signals
  private readonly _trips = signal<Trip[]>([]);

  // Public readonly signals
  readonly trips = this._trips.asReadonly();
  readonly tripsCount = computed(() => this._trips().length);
  readonly todayTrips = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    return this._trips().filter(t => t.date === today).length;
  });

  constructor() {
    this.loadTrips();
  }

  // Load data from API
  loadTrips(): void {
    this.http.get<Trip[]>(`${environment.apiUrl}/trips`)
      .subscribe({
        next: (trips) => {
          this._trips.set(trips || []);
        },
        error: (error) => {
          console.error('Error loading trips:', error);
          this._trips.set([]);
        }
      });
  }

  // CRUD Methods
  getAll(): Trip[] {
    return this._trips();
  }

  getById(id: string): Trip | undefined {
    return this._trips().find(t => t.tripId === id);
  }

  create(trip: Trip): Trip {
    const newTrip: Trip = {
      tripId: this.generateId(),
      ...trip
    };
    this._trips.update(trips => [newTrip, ...trips]);
    return newTrip;
  }

  update(id: string, updates: Partial<Trip>): boolean {
    const index = this._trips().findIndex(t => t.tripId === id);
    if (index === -1) return false;

    this._trips.update(trips => {
      const updated = [...trips];
      updated[index] = { ...updated[index], ...updates };
      return updated;
    });
    return true;
  }

  delete(id: string): boolean {
    const initialLength = this._trips().length;
    this._trips.update(trips => trips.filter(t => t.tripId !== id));
    return this._trips().length < initialLength;
  }

  private generateId(): string {
    const nums = this._trips()
      .map(t => parseInt(t.tripId?.replace('TR', '') || '0'))
      .filter(n => !isNaN(n));
    const maxNum = nums.length ? Math.max(...nums) : 0;
    return `TR${String(maxNum + 1).padStart(3, '0')}`;
  }
}
