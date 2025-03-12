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
    return this.http.get<Local[]>(this.apiUrl);
  }

  getLocal(id: number): Observable<Local> {
    return this.http.get<Local>(`${this.apiUrl}/${id}`);
  }

  criarLocal(local: Local): Observable<Local> {
    if (!this.authService.isAdmin()) {
      throw new Error('Apenas administradores podem criar locais');
    }
    return this.http.post<Local>(this.apiUrl, local);
  }

  atualizarLocal(id: number, local: Local): Observable<Local> {
    if (!this.authService.isAdmin()) {
      throw new Error('Apenas administradores podem atualizar locais');
    }
    return this.http.put<Local>(`${this.apiUrl}/${id}`, local);
  }

  deletarLocal(id: number): Observable<void> {
    if (!this.authService.isAdmin()) {
      throw new Error('Apenas administradores podem deletar locais');
    }
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
