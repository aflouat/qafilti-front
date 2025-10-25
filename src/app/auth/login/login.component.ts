import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, InputTextModule, ButtonModule, RouterModule, NgIf, NgFor, NgClass, CardModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  form = { email: '', password: '' };
  error = '';
  returnUrl = '/';

  // Récupérer les utilisateurs mock pour affichage
  readonly mockUsers = this.auth.getMockUsers();

  ngOnInit() {
    // Récupérer l'URL de retour si elle existe
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  submit() {
    this.error = '';
    const ok = this.auth.login(this.form.email, this.form.password);
    if (ok) {
      // Rediriger vers l'URL demandée ou le dashboard
      this.router.navigateByUrl(this.returnUrl);
    } else {
      this.error = 'Email ou mot de passe incorrect.';
    }
  }

  // Fonction pour remplir automatiquement le formulaire
  fillCredentials(email: string, password: string) {
    this.form.email = email;
    this.form.password = password;
  }
}
