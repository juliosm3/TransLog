import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <h1>Registrar usuario</h1>

    <form [formGroup]="form" (ngSubmit)="register()">
      <mat-form-field>
        <mat-label>Nombre</mat-label>
        <input matInput formControlName="name">
      </mat-form-field>

      <mat-form-field>
        <mat-label>Email</mat-label>
        <input matInput type="email" formControlName="email">
      </mat-form-field>

      <mat-form-field>
        <mat-label>Contraseña</mat-label>
        <input matInput type="password" formControlName="password">
      </mat-form-field>

      <button matButton="filled" type="submit">Registrar</button>
    </form>

    <p>{{ mensaje }}</p>
  `
})
export class Register {
  mensaje = '';

  form = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl('')
  });

  constructor(private authService: AuthService) {}

  register() {
    const name = this.form.value.name || '';
    const email = this.form.value.email || '';
    const password = this.form.value.password || '';

    this.authService.register(name, email, password, 'OPERADOR').subscribe({
      next: () => {
        this.mensaje = 'Usuario registrado correctamente';
      },
      error: () => {
        this.mensaje = 'Error al registrar usuario';
      }
    });
  }
}