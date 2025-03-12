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
    const usuario = this.authService.getCurrentUser();
    if (usuario?.nivelAcesso === 'admin') {
      return this.http.get<Compromisso[]>(this.apiUrl);
    } else {
      return this.http.get<Compromisso[]>(
        `${this.apiUrl}?usuarioId=${usuario?.id}`
      );
    }
  }

  getCompromisso(id: number): Observable<Compromisso> {
    return this.http.get<Compromisso>(`${this.apiUrl}/${id}`);
  }

  criarCompromisso(compromisso: Compromisso): Observable<Compromisso> {
    const usuario = this.authService.getCurrentUser();
    compromisso.usuarioId = usuario?.id || 0;
    return this.http.post<Compromisso>(this.apiUrl, compromisso);
  }

  atualizarCompromisso(
    id: number,
    compromisso: Compromisso
  ): Observable<Compromisso> {
    if (!this.podeEditarCompromisso(id)) {
      throw new Error('Você não tem permissão para editar este compromisso');
    }
    return this.http.put<Compromisso>(`${this.apiUrl}/${id}`, compromisso);
  }

  deletarCompromisso(id: number): Observable<void> {
    if (!this.podeEditarCompromisso(id)) {
      throw new Error('Você não tem permissão para deletar este compromisso');
    }
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private async podeEditarCompromisso(compromissoId: number): Promise<boolean> {
    const usuario = this.authService.getCurrentUser();
    if (usuario?.nivelAcesso === 'admin') return true;

    const compromisso = await this.http
      .get<Compromisso>(`${this.apiUrl}/${compromissoId}`)
      .toPromise();
    return compromisso?.usuarioId === usuario?.id;
  }
}
