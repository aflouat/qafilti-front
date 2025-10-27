import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environements/environment';

export interface City {
  id?: string;
  nameFr?: string;
  nameAr?: string;
}

@Injectable({ providedIn: 'root' })
export class CitiesService {
  private readonly http = inject(HttpClient);

  // Private state with signals
  private readonly _cities = signal<City[]>([]);

  // Public readonly signals
  readonly cities = this._cities.asReadonly();
  readonly citiesCount = computed(() => this._cities().length);

  constructor() {
    console.log('[CitiesService] CONSTRUCTOR called');
    // Add test data immediately
    this._cities.set([
      { id: '999', nameFr: 'Test Ville', nameAr: 'مدينة الاختبار' }
    ]);
    console.log('[CitiesService] Test data set, count:', this._cities().length);

    this.loadCities();
  }

  // Load data from API
  loadCities(): void {
    console.log('[CitiesService] Loading cities from:', `${environment.apiUrl}/cities`);
    this.http.get<City[]>(`${environment.apiUrl}/cities`)
      .subscribe({
        next: (cities) => {
          console.log('[CitiesService] Received data:', cities);
          console.log('[CitiesService] Setting', (cities || []).length, 'cities');
          this._cities.set(cities || []);
        },
        error: (error) => {
          console.error('[CitiesService] ERROR loading cities:', error);
          console.error('[CitiesService] Error status:', error.status);
          this._cities.set([]);
        }
      });
  }

  // CRUD Methods
  getAll(): City[] {
    return this._cities();
  }

  getById(id: string): City | undefined {
    return this._cities().find(c => c.id === id);
  }

  create(city: City): City {
    const newCity: City = {
      id: this.generateId(),
      ...city
    };
    this._cities.update(cities => [newCity, ...cities]);
    return newCity;
  }

  update(id: string, updates: Partial<City>): boolean {
    const index = this._cities().findIndex(c => c.id === id);
    if (index === -1) return false;

    this._cities.update(cities => {
      const updated = [...cities];
      updated[index] = { ...updated[index], ...updates };
      return updated;
    });
    return true;
  }

  delete(id: string): boolean {
    const initialLength = this._cities().length;
    this._cities.update(cities => cities.filter(c => c.id !== id));
    return this._cities().length < initialLength;
  }

  private generateId(): string {
    const ids = this._cities()
      .map(c => parseInt(c.id || '0'))
      .filter(n => !isNaN(n));
    const maxId = ids.length ? Math.max(...ids) : 0;
    return String(maxId + 1);
  }
}
