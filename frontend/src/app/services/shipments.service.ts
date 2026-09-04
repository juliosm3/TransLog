import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ShipmentsService {
  private apiUrl = 'http://localhost:3000/shipments';

  constructor(private http: HttpClient) {}

  listar(page: number, estado: string) {
    return this.http.get<any[]>(
      `${this.apiUrl}?page=${page}&limit=10&estado=${estado}`
    );
  }

  crear(datos: any) {
    return this.http.post(this.apiUrl, datos);
  }

  obtener(id: string) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  actualizarEstado(id: string, datos: any) {
    return this.http.patch(`${this.apiUrl}/${id}/status`, datos);
  }
}