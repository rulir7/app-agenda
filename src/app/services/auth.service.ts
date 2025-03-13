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

  private addAuthHeaders() {
    const token = this.getToken();
    if (token) {
      return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }
    return new HttpHeaders();
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
          console.log('Resposta do login:', response); // Verificar a resposta
          // Não há mais necessidade de acessar `user`, pois a resposta não contém esse campo
          const usuario: Usuario = {
            id: Number(response.token), // ID pode ser extraído de algum lugar ou deixado em branco se não necessário
            nome: '', // Pode ser deixado vazio ou de outra forma, já que não temos o nome do usuário
            email: email, // Aqui você pode usar o email como identificação
            nivelAcesso: 'user', // O nível de acesso pode ser atribuído manualmente ou de acordo com o backend
          };
          localStorage.setItem('token', response.token);
          localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
          this.usuarioLogadoSubject.next(usuario);
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
    this.usuarioLogadoSubject.next(null);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && this.usuarioLogadoSubject.value !== null;
  }

  isAdmin(): boolean {
    const usuario = this.usuarioLogadoSubject.value;
    return usuario ? usuario.nivelAcesso === 'admin' : false;
  }

  getUsuarioLogado(): Usuario | null {
    let usuario = this.usuarioLogadoSubject.value;
    if (!usuario) {
      const usuarioSalvo = localStorage.getItem('usuarioLogado');
      if (usuarioSalvo) {
        usuario = JSON.parse(usuarioSalvo);
        this.usuarioLogadoSubject.next(usuario);
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
