import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<{ access_token: string }>(
      `${this.apiUrl}/login`,
      { email, password }
    );
  }

  register(name: string, email: string, password: string, rol: string) {
    return this.http.post(
      `${this.apiUrl}/register`,
      { name, email, password, rol }
    );
  }

  guardarToken(token: string) {
    localStorage.setItem('token', token);
  }

  obtenerToken() {
    return localStorage.getItem('token');
  }

  cerrarSesion() {
    localStorage.removeItem('token');
  }

  estaAutenticado() {
    return this.obtenerToken() !== null;
  }
}