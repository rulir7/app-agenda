// compromisso.service.ts - Serviço para gerenciamento de compromissos
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Compromisso } from '../modules/compromissos/compromisso.model';

@Injectable({ providedIn: 'root' })
export class CompromissoService {
  private apiUrl = 'http://localhost:3000/compromissos';

  constructor(private http: HttpClient) {}

  getCompromissos(): Observable<Compromisso[]> {
    return this.http.get<Compromisso[]>(this.apiUrl);
  }

  addCompromisso(compromisso: Compromisso): Observable<Compromisso> {
    return this.http.post<Compromisso>(this.apiUrl, compromisso);
  }

  updateCompromisso(compromisso: Compromisso): Observable<Compromisso> {
    return this.http.put<Compromisso>(
      `${this.apiUrl}/${compromisso.id}`,
      compromisso
    );
  }

  deleteCompromisso(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
