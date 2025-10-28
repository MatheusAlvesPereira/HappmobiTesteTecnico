import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  error?: string;

  constructor(private api: ApiService, private router: Router) {}

  submit() {
    this.api.register({ username: this.username, email: this.email, password: this.password }).subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.error = 'Falha ao cadastrar'
    });
  }
}
