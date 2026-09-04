import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <h1>Iniciar sesión</h1>

    <form [formGroup]="form" (ngSubmit)="login()">
      <mat-form-field>
        <mat-label>Email</mat-label>
        <input matInput type="email" formControlName="email">
      </mat-form-field>

      <mat-form-field>
        <mat-label>Contraseña</mat-label>
        <input matInput type="password" formControlName="password">
      </mat-form-field>

      <button matButton="filled" type="submit">Entrar</button>
    </form>

    <p>{{ error }}</p>
  `
})
export class Login {
  error = '';

  form = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    const email = this.form.value.email || '';
    const password = this.form.value.password || '';

    this.authService.login(email, password).subscribe({
      next: (respuesta) => {
        this.authService.guardarToken(respuesta.access_token);
        this.router.navigate(['/shipments']);
      },
      error: () => {
        this.error = 'Email o contraseña incorrectos';
      }
    });
  }
}