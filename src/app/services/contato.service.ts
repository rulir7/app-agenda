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
    return this.http.get<Contato[]>(this.apiUrl);
  }

  getContato(id: number): Observable<Contato> {
    return this.http.get<Contato>(`${this.apiUrl}/${id}`);
  }

  criarContato(contato: Contato): Observable<Contato> {
    return this.http.post<Contato>(this.apiUrl, contato);
  }

  atualizarContato(id: number, contato: Contato): Observable<Contato> {
    return this.http.put<Contato>(`${this.apiUrl}/${id}`, contato);
  }

  deletarContato(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Método para verificar se o usuário pode editar o contato
  podeEditarContato(contatoId: number): boolean {
    const usuario = this.authService.getUsuarioLogado();
    return usuario?.nivelAcesso === 'admin';
  }
}
