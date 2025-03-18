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
    return this.http.get<Compromisso[]>(this.apiUrl);
  }

  getCompromisso(id: number): Observable<Compromisso> {
    return this.http.get<Compromisso>(`${this.apiUrl}/${id}`);
  }

  criarCompromisso(
    compromisso: Omit<Compromisso, 'id' | 'userId'>
  ): Observable<Compromisso> {
    const usuario = this.authService.getUsuarioLogado();
    if (!usuario) throw new Error('Usuário não autenticado');

    const novoCompromisso = {
      ...compromisso,
      userId: usuario.id.toString(),
    };

    return this.http.post<Compromisso>(this.apiUrl, novoCompromisso);
  }

  atualizarCompromisso(
    id: number,
    compromisso: Omit<Compromisso, 'id' | 'userId'>
  ): Observable<Compromisso> {
    const usuario = this.authService.getUsuarioLogado();
    if (!usuario) throw new Error('Usuário não autenticado');

    // Primeiro verifica se o usuário tem permissão para editar
    return new Observable((observer) => {
      this.getCompromisso(id).subscribe({
        next: (compromissoExistente) => {
          if (this.podeEditarOuExcluir(compromissoExistente)) {
            this.http
              .put<Compromisso>(`${this.apiUrl}/${id}`, {
                ...compromisso,
                id,
                userId: compromissoExistente.userId,
              })
              .subscribe({
                next: (response) => observer.next(response),
                error: (error) => observer.error(error),
              });
          } else {
            observer.error(
              new Error('Você não tem permissão para editar este compromisso')
            );
          }
        },
        error: (error) => observer.error(error),
      });
    });
  }

  excluirCompromisso(id: number): Observable<void> {
    const usuario = this.authService.getUsuarioLogado();
    if (!usuario) throw new Error('Usuário não autenticado');

    // Primeiro verifica se o usuário tem permissão para excluir
    return new Observable((observer) => {
      this.getCompromisso(id).subscribe({
        next: (compromisso) => {
          if (this.podeEditarOuExcluir(compromisso)) {
            this.http.delete<void>(`${this.apiUrl}/${id}`).subscribe({
              next: () => observer.next(),
              error: (error) => observer.error(error),
            });
          } else {
            observer.error(
              new Error('Você não tem permissão para excluir este compromisso')
            );
          }
        },
        error: (error) => observer.error(error),
      });
    });
  }

  // Método auxiliar para verificar se o usuário pode editar ou excluir um compromisso
  private podeEditarOuExcluir(compromisso: Compromisso): boolean {
    const usuario = this.authService.getUsuarioLogado();
    if (!usuario) return false;

    // Admins podem editar/excluir qualquer compromisso
    if (usuario.nivelAcesso === 'admin') return true;

    // Usuários normais só podem editar/excluir seus próprios compromissos
    return compromisso.userId === usuario.id.toString();
  }
}
