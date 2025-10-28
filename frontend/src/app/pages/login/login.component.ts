import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  error?: string;

  constructor(private api: ApiService, private router: Router) {}

  submit() {
    this.api.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/vehicles']);
      },
      error: () => this.error = 'Credenciais inválidas'
    });
  }
}
