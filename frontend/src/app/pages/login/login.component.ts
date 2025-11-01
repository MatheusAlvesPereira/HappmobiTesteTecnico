import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  error?: string;

  constructor(private api: ApiService, private router: Router) {}

  navigateToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  submit() {
    this.api.login({ username: this.username, password: this.password }).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        // Salva o userId se vier na resposta
        if (res.user && res.user.id) {
          localStorage.setItem('userId', res.user.id);
        }
        this.router.navigate(['/vehicles']);
      },
      error: () => this.error = 'Credenciais inválidas'
    });
  }
}
