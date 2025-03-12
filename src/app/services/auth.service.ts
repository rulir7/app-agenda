import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { Usuario } from '../models/usuario.interface';

interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://api-users-gdsb.onrender.com';
  private usuarioLogadoSubject = new BehaviorSubject<Usuario | null>(null);
  usuarioLogado$ = this.usuarioLogadoSubject.asObservable();

  constructor(private http: HttpClient) {
    const usuarioSalvo = localStorage.getItem('usuarioLogado');
    const token = localStorage.getItem('token');
    if (usuarioSalvo && token) {
      this.usuarioLogadoSubject.next(JSON.parse(usuarioSalvo));
    }
  }

  registrar(
    nome: string,
    email: string,
    senha: string,
    role: 'user' | 'adm'
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, {
      name: nome,
      email: email,
      password: senha,
      role: role,
    });
  }

  login(email: string, senha: string): Observable<Usuario> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, {
        email: email,
        password: senha,
      })
      .pipe(
        map((response) => {
          const usuario: Usuario = {
            id: parseInt(response.user.id),
            nome: response.user.name,
            email: response.user.email,
            nivelAcesso: response.user.role === 'adm' ? 'admin' : 'user',
          };
          localStorage.setItem('token', response.token);
          localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
          this.usuarioLogadoSubject.next(usuario);
          return usuario;
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioLogado');
    this.usuarioLogadoSubject.next(null);
  }

  isLoggedIn(): boolean {
    return this.usuarioLogadoSubject.value !== null;
  }

  isAdmin(): boolean {
    const usuario = this.usuarioLogadoSubject.value;
    return usuario ? usuario.nivelAcesso === 'admin' : false;
  }

  getUsuarioLogado(): Usuario | null {
    return this.usuarioLogadoSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
