import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  email: string = '';
  newPassword: string = '';
  message: string = '';
  error: string = '';

  constructor(private api: ApiService, private router: Router) {}
  
  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  submit() {
    this.error = '';
    this.message = '';
    this.api.forgotPassword(this.email, this.newPassword).subscribe({
      next: () => {
        this.message = 'Senha alterada com sucesso! Você já pode fazer o login.';
      },
      error: (err) => {
        this.error = err?.error?.message
          ? err.error.message
          : (err.status === 404
              ? 'Recurso não encontrado.'
              : 'Ocorreu um erro ao tentar alterar a senha. Tente novamente mais tarde.');
      }
    });
  }
}