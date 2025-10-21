import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {
  username: string = '';
  password: string = '';
  loading: boolean = false;
  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (!this.username || !this.password) {
      this.error = 'Por favor completa todos los campos';
      return;
    }

    this.loading = true;
    this.error = '';

    // Simular delay de red
    setTimeout(() => {
      const success = this.authService.login(this.username, this.password);
      
      if (success) {
        this.router.navigate(['/']);
      } else {
        this.error = 'Usuario o contraseña incorrectos';
      }
      
      this.loading = false;
    }, 1000);
  }

  // Credenciales de prueba para desarrollo
  fillDemoCredentials(role: string) {
    switch (role) {
      case 'admin':
        this.username = 'admin';
        this.password = 'admin123';
        break;
      case 'vendedor':
        this.username = 'vendedor';
        this.password = 'vendedor123';
        break;
      case 'inventario':
        this.username = 'inventario';
        this.password = 'inventario123';
        break;
    }
  }
}