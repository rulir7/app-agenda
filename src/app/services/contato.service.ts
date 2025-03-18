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

  criarContato(contato: Omit<Contato, 'id' | 'userId'>): Observable<Contato> {
    const usuario = this.authService.getUsuarioLogado();
    if (!usuario) throw new Error('Usuário não autenticado');

    const novoContato = {
      ...contato,
      userId: usuario.id.toString(),
    };

    return this.http.post<Contato>(this.apiUrl, novoContato);
  }

  atualizarContato(
    id: number,
    contato: Omit<Contato, 'id' | 'userId'>
  ): Observable<Contato> {
    const usuario = this.authService.getUsuarioLogado();
    if (!usuario) throw new Error('Usuário não autenticado');

    // Primeiro verifica se o usuário tem permissão para editar
    return new Observable((observer) => {
      this.getContato(id).subscribe({
        next: (contatoExistente) => {
          if (this.podeEditarOuExcluir(contatoExistente)) {
            this.http
              .put<Contato>(`${this.apiUrl}/${id}`, {
                ...contato,
                id,
                userId: contatoExistente.userId,
              })
              .subscribe({
                next: (response) => observer.next(response),
                error: (error) => observer.error(error),
              });
          } else {
            observer.error(
              new Error('Você não tem permissão para editar este contato')
            );
          }
        },
        error: (error) => observer.error(error),
      });
    });
  }

  excluirContato(id: number): Observable<void> {
    const usuario = this.authService.getUsuarioLogado();
    if (!usuario) throw new Error('Usuário não autenticado');

    // Primeiro verifica se o usuário tem permissão para excluir
    return new Observable((observer) => {
      this.getContato(id).subscribe({
        next: (contato) => {
          if (this.podeEditarOuExcluir(contato)) {
            this.http.delete<void>(`${this.apiUrl}/${id}`).subscribe({
              next: () => observer.next(),
              error: (error) => observer.error(error),
            });
          } else {
            observer.error(
              new Error('Você não tem permissão para excluir este contato')
            );
          }
        },
        error: (error) => observer.error(error),
      });
    });
  }

  // Método auxiliar para verificar se o usuário pode editar ou excluir um contato
  private podeEditarOuExcluir(contato: Contato): boolean {
    const usuario = this.authService.getUsuarioLogado();
    if (!usuario) return false;

    // Admins podem editar/excluir qualquer contato
    if (usuario.nivelAcesso === 'admin') return true;

    // Usuários normais só podem editar/excluir seus próprios contatos
    return contato.userId === usuario.id.toString();
  }
}
