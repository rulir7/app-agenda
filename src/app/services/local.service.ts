import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Local } from '../models/local.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class LocalService {
  private apiUrl = 'http://localhost:3000/locais';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getLocais(): Observable<Local[]> {
    return this.http.get<Local[]>(this.apiUrl, {
      headers: this.authService.addAuthHeaders(),
    });
  }

  getLocal(id: number): Observable<Local> {
    return this.http.get<Local>(`${this.apiUrl}/${id}`, {
      headers: this.authService.addAuthHeaders(),
    });
  }

  criarLocal(local: Omit<Local, 'id'>): Observable<Local> {
    if (!this.authService.isAuthenticated()) {
      throw new Error('Usuário não autenticado');
    }

    return this.http.post<Local>(this.apiUrl, local, {
      headers: this.authService.addAuthHeaders(),
    });
  }

  atualizarLocal(id: number, local: Omit<Local, 'id'>): Observable<Local> {
    if (!this.authService.isAuthenticated()) {
      throw new Error('Usuário não autenticado');
    }

    return this.http.put<Local>(`${this.apiUrl}/${id}`, local, {
      headers: this.authService.addAuthHeaders(),
    });
  }

  excluirLocal(id: number): Observable<void> {
    if (!this.authService.isAuthenticated()) {
      throw new Error('Usuário não autenticado');
    }

    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.authService.addAuthHeaders(),
    });
  }
}
