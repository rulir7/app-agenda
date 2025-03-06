// login.component.ts - Componente de Login
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email = '';
  senha = '';

  constructor(private authService: AuthService) {}

  login() {
    this.authService.login(this.email, this.senha);
  }
}
