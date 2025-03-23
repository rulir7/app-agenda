// compromisso.service.ts - Serviço para gerenciamento de compromissos
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Compromisso } from '../models/compromisso.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CompromissoService {
  private apiUrl = 'http://localhost:3000/compromissos';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getCompromissos(): Observable<Compromisso[]> {
    return this.http.get<Compromisso[]>(this.apiUrl, {
      headers: this.authService.addAuthHeaders(),
    });
  }

  getCompromisso(id: number): Observable<Compromisso> {
    return this.http.get<Compromisso>(`${this.apiUrl}/${id}`, {
      headers: this.authService.addAuthHeaders(),
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
      headers: this.authService.addAuthHeaders(),
    });
  }

  atualizarCompromisso(
    id: number,
    compromisso: Omit<Compromisso, 'id' | 'userId'>
  ): Observable<Compromisso> {
    if (!this.authService.isAuthenticated()) {
      throw new Error('Usuário não autenticado');
    }

    const compromissoAtualizado = {
      ...compromisso,
      userId: this.authService.getUserId(),
    };

    return this.http.put<Compromisso>(
      `${this.apiUrl}/${id}`,
      compromissoAtualizado,
      {
        headers: this.authService.addAuthHeaders(),
      }
    );
  }

  excluirCompromisso(id: number): Observable<void> {
    if (!this.authService.isAuthenticated()) {
      throw new Error('Usuário não autenticado');
    }

    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.authService.addAuthHeaders(),
    });
  }

  // Método auxiliar para verificar se o usuário pode editar ou excluir um compromisso
  podeEditarOuExcluir(compromisso: Compromisso): boolean {
    if (this.authService.isAdmin()) {
      return true;
    }

    const userId = this.authService.getUserId();
    return compromisso.userId ? compromisso.userId === userId : false;
  }
}
