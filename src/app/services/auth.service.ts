import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  map,
  tap,
  catchError,
  throwError,
} from 'rxjs';
import { Usuario } from '../models/usuario.interface';
import { Router } from '@angular/router';

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
  private usuarioLogado = new BehaviorSubject<Usuario | null>(null);
  usuarioLogado$ = this.usuarioLogado.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const usuarioSalvo = localStorage.getItem('usuarioLogado');
    const token = localStorage.getItem('token');
    if (usuarioSalvo && token) {
      this.usuarioLogado.next(JSON.parse(usuarioSalvo));
    }
  }

  //versao professor
  /*
constructor() {
IsAuthenticated(): boolean {
return !!localStorage.getItem('token');
}
}




*/

  private addAuthHeaders() {
    const token = this.getToken();
    if (token) {
      return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }
    return new HttpHeaders();
  }

  private decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(window.atob(base64));
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return null;
    }
  }

  registrar(
    nome: string,
    email: string,
    senha: string,
    role: 'user' | 'admin'
  ): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/register`, {
        name: nome,
        email: email,
        password: senha,
        role: role,
      })
      .pipe(
        catchError((error) => {
          console.error('Erro no registro:', error);
          return throwError(
            () => new Error('Falha ao registrar o usuário. Tente novamente.')
          );
        })
      );
  }

  login(email: string, senha: string): Observable<Usuario> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, { email, password: senha })
      .pipe(
        map((response) => {
          const tokenPayload = this.decodeToken(response.token);
          if (!tokenPayload) {
            throw new Error('Token inválido');
          }

          const usuario: Usuario = {
            id: parseInt(tokenPayload.id),
            nome: tokenPayload.username,
            email: tokenPayload.username,
            nivelAcesso: tokenPayload.role,
          };

          localStorage.setItem('token', response.token);
          localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
          this.usuarioLogado.next(usuario);
          this.router.navigate(['/agenda']);
          return usuario;
        }),
        catchError((error) => {
          console.error('Erro no login:', error);
          return throwError(
            () =>
              new Error('Falha na autenticação. Verifique suas credenciais.')
          );
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioLogado');
    this.usuarioLogado.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && this.usuarioLogado.value !== null;
  }

  isAdmin(): boolean {
    const usuario = this.usuarioLogado.value;
    return usuario ? usuario.nivelAcesso === 'admin' : false;
  }

  getUsuarioLogado(): Usuario | null {
    let usuario = this.usuarioLogado.value;
    if (!usuario) {
      const usuarioSalvo = localStorage.getItem('usuarioLogado');
      if (usuarioSalvo) {
        usuario = JSON.parse(usuarioSalvo);
        this.usuarioLogado.next(usuario);
      }
    }
    return usuario;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Método para obter informações do usuário com autenticação
  getUserInfo(): Observable<any> {
    const headers = this.addAuthHeaders();
    return this.http.get(`${this.apiUrl}/user-info`, { headers }).pipe(
      catchError((error) => {
        console.error('Erro ao buscar informações do usuário:', error);
        return throwError(
          () => new Error('Falha ao buscar as informações do usuário.')
        );
      })
    );
  }
}
