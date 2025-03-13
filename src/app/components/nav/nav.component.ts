import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <a class="navbar-brand" routerLink="/">Agenda</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item" *ngIf="authService.isLoggedIn()">
              <a
                class="nav-link"
                routerLink="/compromissos"
                routerLinkActive="active"
              >
                Compromissos
              </a>
            </li>
            <li class="nav-item" *ngIf="authService.isLoggedIn()">
              <a
                class="nav-link"
                routerLink="/contatos"
                routerLinkActive="active"
              >
                Contatos
              </a>
            </li>
            <li class="nav-item" *ngIf="authService.isLoggedIn()">
              <a
                class="nav-link"
                routerLink="/locais"
                routerLinkActive="active"
              >
                Locais
              </a>
            </li>
          </ul>
          <ul class="navbar-nav">
            <li class="nav-item" *ngIf="!authService.isLoggedIn()">
              <a class="nav-link" routerLink="/login">Login</a>
            </li>
            <li class="nav-item" *ngIf="authService.isLoggedIn()">
              <a class="nav-link" href="#" (click)="logout($event)">Sair</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
})
export class NavComponent {
  constructor(public authService: AuthService) {}

  logout(event: Event) {
    event.preventDefault();
    this.authService.logout();
  }
}
