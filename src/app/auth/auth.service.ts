import { Injectable, signal } from '@angular/core';

export interface AuthUser {
  name: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly isAuthenticated = signal<boolean>(false);
  readonly user = signal<AuthUser | null>(null);

  login(email: string, password: string): boolean {
    // Mock: accept any non-empty credentials
    if (email?.trim() && password?.trim()) {
      this.user.set({ name: email.split('@')[0], email });
      this.isAuthenticated.set(true);
      return true;
    }
    return false;
  }

  register(name: string, email: string, password: string): boolean {
    // Mock: accept any non-empty values
    if (name?.trim() && email?.trim() && password?.trim()) {
      this.user.set({ name, email });
      this.isAuthenticated.set(true);
      return true;
    }
    return false;
  }

  logout(): void {
    this.user.set(null);
    this.isAuthenticated.set(false);
  }
}
