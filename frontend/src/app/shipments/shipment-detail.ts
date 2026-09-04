import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ShipmentsService } from '../services/shipments.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-shipment-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
    <h1>Detalle del envío</h1>

    <p>{{ error }}</p>

    <div *ngIf="envio">
      <p><strong>Tracking:</strong> {{ envio.trackingCode }}</p>
      <p><strong>Origen:</strong> {{ envio.direccionOrigen }}</p>
      <p><strong>Destino:</strong> {{ envio.direccionDestino }}</p>
      <p><strong>Destinatario:</strong> {{ envio.nombreDestinatario }}</p>
      <p><strong>Peso:</strong> {{ envio.peso }}</p>
      <p><strong>Estado:</strong> {{ envio.estado }}</p>

      <h2>Cambiar estado</h2>

      <form [formGroup]="form" (ngSubmit)="actualizarEstado()">
        <select formControlName="estado">
          <option value="IN_WAREHOUSE">IN_WAREHOUSE</option>
          <option value="IN_TRANSIT">IN_TRANSIT</option>
          <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
          <option value="DELIVERED">DELIVERED</option>
          <option value="RETURNED">RETURNED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>

        <mat-form-field>
          <mat-label>Ubicación</mat-label>
          <input matInput formControlName="ubicacion">
        </mat-form-field>

        <mat-form-field>
          <mat-label>Notas</mat-label>
          <input matInput formControlName="notas">
        </mat-form-field>

        <button matButton="filled" type="submit">Actualizar</button>
      </form>

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
export class ShipmentDetail implements OnInit {
  envio: any;
  error = '';
  id = '';

  form = new FormGroup({
    estado: new FormControl(''),
    ubicacion: new FormControl(''),
    notas: new FormControl('')
  });

  constructor(
    private route: ActivatedRoute,
    private shipmentsService: ShipmentsService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.cargar();
  }

  cargar() {
    this.shipmentsService.obtener(this.id).subscribe({
      next: (envio) => {
        this.envio = envio;
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.error = 'Error al cargar el envío';
        this.changeDetector.detectChanges();
      }
    });
  }

  actualizarEstado() {
    this.shipmentsService.actualizarEstado(this.id, this.form.value).subscribe({
      next: () => {
        this.cargar();
      },
      error: () => {
        this.error = 'No se puede realizar ese cambio de estado';
        this.changeDetector.detectChanges();
      }
    });
  }
}