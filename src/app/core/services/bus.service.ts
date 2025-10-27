import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environements/environment';

export interface Bus {
  id?: string;
  license_plate?: string;
  status?: 'active' | 'maintenance' | 'inactive';
  capacity?: number;
}

@Injectable({ providedIn: 'root' })
export class BusService {
  private readonly http = inject(HttpClient);

  // Private state with signals
  private readonly _buses = signal<Bus[]>([]);

  // Public readonly signals
  readonly buses = this._buses.asReadonly();
  readonly busCount = computed(() => this._buses().length);
  readonly activeBuses = computed(() =>
    this._buses().filter(b => b.status === 'active').length
  );

  constructor() {
    console.log('[BusService] CONSTRUCTOR called');
    // Add test data immediately
    this._buses.set([
      { id: 'TEST001', license_plate: 'TEST-123', status: 'active', capacity: 20 }
    ]);
    console.log('[BusService] Test data set, count:', this._buses().length);

    this.loadBuses();
  }

  // Load data from API
  loadBuses(): void {
    console.log('[BusService] Loading buses from:', `${environment.apiUrl}/bus`);
    this.http.get<Bus[]>(`${environment.apiUrl}/bus`)
      .subscribe({
        next: (buses) => {
          console.log('[BusService] Received data:', buses);
          console.log('[BusService] Setting', (buses || []).length, 'buses');
          this._buses.set(buses || []);
        },
        error: (error) => {
          console.error('[BusService] ERROR loading buses:', error);
          console.error('[BusService] Error status:', error.status);
          this._buses.set([]);
        }
      });
  }

  // CRUD Methods
  getAll(): Bus[] {
    return this._buses();
  }

  getById(id: string): Bus | undefined {
    return this._buses().find(b => b.id === id);
  }

  create(bus: Bus): Bus {
    const newBus: Bus = {
      id: this.generateId(),
      ...bus
    };
    this._buses.update(buses => [newBus, ...buses]);
    return newBus;
  }

  update(id: string, updates: Partial<Bus>): boolean {
    const index = this._buses().findIndex(b => b.id === id);
    if (index === -1) return false;

    this._buses.update(buses => {
      const updated = [...buses];
      updated[index] = { ...updated[index], ...updates };
      return updated;
    });
    return true;
  }

  delete(id: string): boolean {
    const initialLength = this._buses().length;
    this._buses.update(buses => buses.filter(b => b.id !== id));
    return this._buses().length < initialLength;
  }

  private generateId(): string {
    const nums = this._buses()
      .map(b => parseInt(b.id?.replace('B', '') || '0'))
      .filter(n => !isNaN(n));
    const maxNum = nums.length ? Math.max(...nums) : 0;
    return `B${String(maxNum + 1).padStart(3, '0')}`;
  }
}
