// compromisso.service.ts - Serviço para gerenciamento de compromissos
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Compromisso } from '../models/compromisso.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CompromissoService {
  private apiUrl = 'http://localhost:3000/compromissos';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getCompromissos(): Observable<Compromisso[]> {
    return this.http.get<Compromisso[]>(this.apiUrl, {
      headers: this.getHeaders(),
    });
  }

  getCompromisso(id: number): Observable<Compromisso> {
    return this.http.get<Compromisso>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  criarCompromisso(
    compromisso: Omit<Compromisso, 'id' | 'userId'>
  ): Observable<Compromisso> {
    if (!this.authService.isAuthenticated()) {
      throw new Error('Usuário não autenticado');
    }

    const novoCompromisso = {
      ...compromisso,
      userId: this.authService.getUserId(),
    };

    return this.http.post<Compromisso>(this.apiUrl, novoCompromisso, {
      headers: this.getHeaders(),
    });
  }

  atualizarCompromisso(
    id: number,
    compromisso: Omit<Compromisso, 'id' | 'userId'>
  ): Observable<Compromisso> {
    if (!this.authService.isAuthenticated()) {
      throw new Error('Usuário não autenticado');
    }

    return this.http.put<Compromisso>(
      `${this.apiUrl}/${id}`,
      {
        ...compromisso,
        id,
        userId: this.authService.getUserId(),
      },
      { headers: this.getHeaders() }
    );
  }

  excluirCompromisso(id: number): Observable<void> {
    if (!this.authService.isAuthenticated()) {
      throw new Error('Usuário não autenticado');
    }

    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  // Método auxiliar para verificar se o usuário pode editar ou excluir um compromisso
  private podeEditarOuExcluir(compromisso: Compromisso): boolean {
    if (this.authService.isAdmin()) {
      return true;
    }

    const userId = this.authService.getUserId();
    return compromisso.userId ? compromisso.userId === userId : false;
  }
}
