import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contato } from '../models/contato.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ContatoService {
  private apiUrl = 'http://localhost:3000/contatos';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getContatos(): Observable<Contato[]> {
    return this.http.get<Contato[]>(this.apiUrl, {
      headers: this.authService.addAuthHeaders(),
    });
  }

  getContato(id: number): Observable<Contato> {
    return this.http.get<Contato>(`${this.apiUrl}/${id}`, {
      headers: this.authService.addAuthHeaders(),
    });
  }

  criarContato(contato: Omit<Contato, 'id' | 'userId'>): Observable<Contato> {
    if (!this.authService.isAuthenticated()) {
      throw new Error('Usuário não autenticado');
    }

    const novoContato = {
      ...contato,
      userId: this.authService.getUserId(),
    };

    return this.http.post<Contato>(this.apiUrl, novoContato, {
      headers: this.authService.addAuthHeaders(),
    });
  }

  atualizarContato(
    id: number,
    contato: Omit<Contato, 'id' | 'userId'>
  ): Observable<Contato> {
    if (!this.authService.isAuthenticated()) {
      throw new Error('Usuário não autenticado');
    }

    const contatoAtualizado = {
      ...contato,
      userId: this.authService.getUserId(),
    };

    return this.http.put<Contato>(`${this.apiUrl}/${id}`, contatoAtualizado, {
      headers: this.authService.addAuthHeaders(),
    });
  }

  excluirContato(id: number): Observable<void> {
    if (!this.authService.isAuthenticated()) {
      throw new Error('Usuário não autenticado');
    }

    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.authService.addAuthHeaders(),
    });
  }

  private podeEditarOuExcluir(contato: Contato): boolean {
    if (this.authService.isAdmin()) {
      return true;
    }

    const userId = this.authService.getUserId();
    return contato.userId ? contato.userId === userId : false;
  }
}
