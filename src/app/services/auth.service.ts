import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

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

  constructor(private http: HttpClient, private router: Router) {}

  addAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
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

  login(email: string, senha: string): Observable<any> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, {
        email,
        password: senha,
      })
      .pipe(
        map((response) => {
          localStorage.setItem('token', response.token);
          this.router.navigate(['/agenda']);
          return response;
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
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (token) {
      const decoded: any = jwtDecode(token);
      return decoded.role;
    }
    return null;
  }

  getUserUsername(): string | null {
    const token = this.getToken();
    if (token) {
      const decoded: any = jwtDecode(token);
      return decoded.username;
    }
    return null;
  }

  getUserId(): string | null {
    const token = this.getToken();
    if (token) {
      const decoded: any = jwtDecode(token);
      return decoded.id;
    }
    return null;
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
