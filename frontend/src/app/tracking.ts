import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-tracking',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
    <h1>Seguimiento de envío</h1>

    <mat-form-field>
      <mat-label>Código de seguimiento</mat-label>
      <input matInput [formControl]="trackingCode">
    </mat-form-field>

    <button matButton="filled" (click)="buscar()">Buscar</button>

    <p>{{ error }}</p>

    <div *ngIf="envio">
      <p><strong>Tracking:</strong> {{ envio.trackingCode }}</p>
      <p><strong>Estado:</strong> {{ envio.estado }}</p>
      <p><strong>Destino:</strong> {{ envio.direccionDestino }}</p>

      <h2>Historial</h2>

      <div *ngFor="let evento of envio.events">
        <p>
          {{ evento.estado }} -
          {{ evento.fecha | date:'short' }} -
          {{ evento.ubicacion }}
        </p>
      </div>
    </div>
  `
})
export class Tracking {
  trackingCode = new FormControl('');
  envio: any;
  error = '';

  constructor(private http: HttpClient) {}

  buscar() {
    const codigo = this.trackingCode.value || '';

    this.http.get<any>(
      `http://localhost:3000/tracking/${codigo}`
    ).subscribe({
      next: (envio) => {
        this.envio = envio;
        this.error = '';
      },
      error: () => {
        this.error = 'Envío no encontrado';
      }
    });
  }
}