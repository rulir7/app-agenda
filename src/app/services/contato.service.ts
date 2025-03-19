import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contato } from '../models/contato.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ContatoService {
  private apiUrl = 'http://localhost:3000/contatos';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getContatos(): Observable<Contato[]> {
    return this.http.get<Contato[]>(this.apiUrl, {
      headers: this.getHeaders(),
    });
  }

  getContato(id: number): Observable<Contato> {
    return this.http.get<Contato>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
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
      headers: this.getHeaders(),
    });
  }

  atualizarContato(
    id: number,
    contato: Omit<Contato, 'id' | 'userId'>
  ): Observable<Contato> {
    if (!this.authService.isAuthenticated()) {
      throw new Error('Usuário não autenticado');
    }

    return this.http.put<Contato>(
      `${this.apiUrl}/${id}`,
      {
        ...contato,
        id,
        userId: this.authService.getUserId(),
      },
      { headers: this.getHeaders() }
    );
  }

  excluirContato(id: number): Observable<void> {
    if (!this.authService.isAuthenticated()) {
      throw new Error('Usuário não autenticado');
    }

    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
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
