import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ShipmentsService } from '../services/shipments.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shipments',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule
  ],
  template: `
    <h1>Envíos</h1>

    <h2>Crear envío</h2>

    <form [formGroup]="form" (ngSubmit)="crear()">
      <mat-form-field>
        <mat-label>Origen</mat-label>
        <input matInput formControlName="direccionOrigen">
      </mat-form-field>

      <mat-form-field>
        <mat-label>Destino</mat-label>
        <input matInput formControlName="direccionDestino">
      </mat-form-field>

      <mat-form-field>
        <mat-label>Destinatario</mat-label>
        <input matInput formControlName="nombreDestinatario">
      </mat-form-field>

      <mat-form-field>
        <mat-label>Peso</mat-label>
        <input matInput type="number" formControlName="peso">
      </mat-form-field>

      <button matButton="filled" type="submit">Crear</button>
    </form>

    <h2>Listado</h2>

    <select [(ngModel)]="estado" (change)="cargar()">
      <option value="">Todos</option>
      <option value="CREATED">CREATED</option>
      <option value="IN_WAREHOUSE">IN_WAREHOUSE</option>
      <option value="IN_TRANSIT">IN_TRANSIT</option>
      <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
      <option value="DELIVERED">DELIVERED</option>
      <option value="RETURNED">RETURNED</option>
      <option value="CANCELLED">CANCELLED</option>
    </select>

    <p *ngIf="cargando">Cargando...</p>
    <p>{{ error }}</p>

    <table>
      <tr>
        <th>Tracking</th>
        <th>Destino</th>
        <th>Peso</th>
        <th>Estado</th>
        <th></th>
      </tr>

      <tr *ngFor="let envio of envios">
        <td>{{ envio.trackingCode }}</td>
        <td>{{ envio.direccionDestino }}</td>
        <td>{{ envio.peso }}</td>
        <td>{{ envio.estado }}</td>
        <td>
          <a [routerLink]="['/shipments', envio.id]">Ver</a>
        </td>
      </tr>
    </table>

    <button matButton (click)="anterior()" [disabled]="page === 1">
      Anterior
    </button>

    Página {{ page }}

    <button matButton (click)="siguiente()">
      Siguiente
    </button>
  `
})
export class Shipments implements OnInit {
  envios: any[] = [];
  page = 1;
  estado = '';
  cargando = false;
  error = '';

  form = new FormGroup({
    direccionOrigen: new FormControl(''),
    direccionDestino: new FormControl(''),
    nombreDestinatario: new FormControl(''),
    peso: new FormControl(0)
  });

  constructor(private shipmentsService: ShipmentsService) {}

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.cargando = true;

    this.shipmentsService.listar(this.page, this.estado).subscribe({
      next: (envios) => {
        this.envios = envios;
        this.cargando = false;
      },
      error: () => {
        this.error = 'Error al cargar los envíos';
        this.cargando = false;
      }
    });
  }

  crear() {
    this.shipmentsService.crear(this.form.value).subscribe({
      next: () => {
        this.form.reset();
        this.cargar();
      },
      error: () => {
        this.error = 'Error al crear el envío';
      }
    });
  }

  anterior() {
    if (this.page > 1) {
      this.page--;
      this.cargar();
    }
  }

  siguiente() {
    this.page++;
    this.cargar();
  }
}