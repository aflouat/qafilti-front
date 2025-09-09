import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, InputTextModule, ButtonModule, RouterModule, NgIf],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  form = { name: '', email: '', password: '', terms: false };
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.error = '';
    if (!this.form.terms) {
      this.error = 'Veuillez accepter les conditions.';
      return;
    }
    const ok = this.auth.register(this.form.name, this.form.email, this.form.password);
    if (ok) {
      this.router.navigateByUrl('/');
    } else {
      this.error = 'Veuillez renseigner tous les champs.';
    }
  }
}
