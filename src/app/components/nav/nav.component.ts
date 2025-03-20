import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <a class="navbar-brand" routerLink="/">Agenda</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item" *ngIf="authService.isAuthenticated()">
              <a
                class="nav-link"
                routerLink="/contatos"
                routerLinkActive="active"
              >
                Contatos
              </a>
            </li>
            <li class="nav-item" *ngIf="authService.isAdmin()">
              <a
                class="nav-link"
                routerLink="/locais"
                routerLinkActive="active"
              >
                Locais
              </a>
            </li>
          </ul>
          <p
            *ngIf="authService.isAuthenticated()"
            class="navbar-item  ms-auto"
            style="color: white; margin-top: 1.1rem;"
            href="#"
          >
            Olá, {{ authService.getUserRole() }}
            {{ authService.getUserUsername() }}
          </p>
          <ul class="navbar-nav">
            <li class="nav-item" *ngIf="!authService.isAuthenticated()">
              <a class="nav-link" routerLink="/login">Login</a>
            </li>
            <li class="nav-item" *ngIf="authService.isAuthenticated()">
              <a class="nav-link" href="#" (click)="logout($event)">Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: [
    `
      .navbar {
        margin-bottom: 1rem;
      }
    `,
  ],
})
export class NavComponent {
  constructor(public authService: AuthService) {}

  logout(event: Event) {
    event.preventDefault();
    this.authService.logout();
  }
}
