import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/usuarios';
  private authState = new BehaviorSubject<boolean>(this.isAuthenticated());
  authState$ = this.authState.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, senha: string) {
    return this.http
      .get<any[]>(`${this.apiUrl}?email=${email}&senha=${senha}`)
      .subscribe((users) => {
        if (users.length > 0) {
          localStorage.setItem('user', JSON.stringify(users[0]));
          this.authState.next(true);
          this.router.navigate(['/dashboard']);
        } else {
          alert('Credenciais inválidas!');
        }
      });
  }

  logout() {
    localStorage.removeItem('user');
    this.authState.next(false);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('user') !== null;
  }
}
