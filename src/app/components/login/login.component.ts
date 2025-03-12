import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      <div class="text-center mb-4">
        <button class="btn btn-link" (click)="toggleForm()">
          {{ isLoginForm ? 'Criar nova conta' : 'Já tenho uma conta' }}
        </button>
      </div>

      <!-- Formulário de Login -->
      <form
        *ngIf="isLoginForm"
        [formGroup]="loginForm"
        (ngSubmit)="onLoginSubmit()"
      >
        <h2>Login</h2>
        <div class="form-group">
          <label for="loginEmail">Email:</label>
          <input
            type="email"
            id="loginEmail"
            formControlName="email"
            class="form-control"
            [class.is-invalid]="loginEmail?.invalid && loginEmail?.touched"
          />
          <div
            class="invalid-feedback"
            *ngIf="loginEmail?.invalid && loginEmail?.touched"
          >
            <div *ngIf="loginEmail?.errors?.['required']">
              Email é obrigatório
            </div>
            <div *ngIf="loginEmail?.errors?.['email']">Email inválido</div>
          </div>
        </div>

        <div class="form-group">
          <label for="loginSenha">Senha:</label>
          <input
            type="password"
            id="loginSenha"
            formControlName="senha"
            class="form-control"
            [class.is-invalid]="loginSenha?.invalid && loginSenha?.touched"
          />
          <div
            class="invalid-feedback"
            *ngIf="loginSenha?.invalid && loginSenha?.touched"
          >
            <div *ngIf="loginSenha?.errors?.['required']">
              Senha é obrigatória
            </div>
          </div>
        </div>

        <button
          type="submit"
          class="btn btn-primary"
          [disabled]="loginForm.invalid"
        >
          Entrar
        </button>
      </form>

      <!-- Formulário de Registro -->
      <form
        *ngIf="!isLoginForm"
        [formGroup]="registroForm"
        (ngSubmit)="onRegistroSubmit()"
      >
        <h2>Criar Conta</h2>
        <div class="form-group">
          <label for="nome">Nome:</label>
          <input
            type="text"
            id="nome"
            formControlName="nome"
            class="form-control"
            [class.is-invalid]="nome?.invalid && nome?.touched"
          />
          <div class="invalid-feedback" *ngIf="nome?.invalid && nome?.touched">
            <div *ngIf="nome?.errors?.['required']">Nome é obrigatório</div>
          </div>
        </div>

        <div class="form-group">
          <label for="registroEmail">Email:</label>
          <input
            type="email"
            id="registroEmail"
            formControlName="email"
            class="form-control"
            [class.is-invalid]="
              registroEmail?.invalid && registroEmail?.touched
            "
          />
          <div
            class="invalid-feedback"
            *ngIf="registroEmail?.invalid && registroEmail?.touched"
          >
            <div *ngIf="registroEmail?.errors?.['required']">
              Email é obrigatório
            </div>
            <div *ngIf="registroEmail?.errors?.['email']">Email inválido</div>
          </div>
        </div>

        <div class="form-group">
          <label for="registroSenha">Senha:</label>
          <input
            type="password"
            id="registroSenha"
            formControlName="senha"
            class="form-control"
            [class.is-invalid]="
              registroSenha?.invalid && registroSenha?.touched
            "
          />
          <div
            class="invalid-feedback"
            *ngIf="registroSenha?.invalid && registroSenha?.touched"
          >
            <div *ngIf="registroSenha?.errors?.['required']">
              Senha é obrigatória
            </div>
          </div>
        </div>

        <button
          type="submit"
          class="btn btn-primary"
          [disabled]="registroForm.invalid"
        >
          Criar Conta
        </button>
      </form>

      <div class="alert alert-danger mt-3" *ngIf="error">
        {{ error }}
      </div>
    </div>
  `,
  styles: [
    `
      .login-container {
        max-width: 400px;
        margin: 2rem auto;
        padding: 2rem;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .form-group {
        margin-bottom: 1rem;
      }

      label {
        display: block;
        margin-bottom: 0.5rem;
      }

      .form-control {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
      }

      .is-invalid {
        border-color: #dc3545;
      }

      .invalid-feedback {
        color: #dc3545;
        font-size: 0.875rem;
        margin-top: 0.25rem;
      }

      .btn {
        width: 100%;
        padding: 0.75rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }

      .btn-primary {
        background-color: #007bff;
        color: white;
      }

      .btn-primary:disabled {
        background-color: #ccc;
        cursor: not-allowed;
      }

      .btn-primary:hover:not(:disabled) {
        background-color: #0056b3;
      }

      .btn-link {
        color: #007bff;
        text-decoration: none;
      }

      .btn-link:hover {
        text-decoration: underline;
      }

      .alert {
        padding: 0.75rem 1.25rem;
        border-radius: 4px;
      }

      .alert-danger {
        background-color: #f8d7da;
        border-color: #f5c6cb;
        color: #721c24;
      }
    `,
  ],
})
export class LoginComponent {
  isLoginForm = true;
  loginForm: FormGroup;
  registroForm: FormGroup;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required]],
    });

    this.registroForm = this.fb.group({
      nome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required]],
    });
  }

  toggleForm() {
    this.isLoginForm = !this.isLoginForm;
    this.error = '';
  }

  // Getters para o formulário de login
  get loginEmail() {
    return this.loginForm.get('email');
  }

  get loginSenha() {
    return this.loginForm.get('senha');
  }

  // Getters para o formulário de registro
  get nome() {
    return this.registroForm.get('nome');
  }

  get registroEmail() {
    return this.registroForm.get('email');
  }

  get registroSenha() {
    return this.registroForm.get('senha');
  }

  onLoginSubmit() {
    if (this.loginForm.valid) {
      const { email, senha } = this.loginForm.value;
      this.authService.login(email, senha).subscribe({
        next: () => {
          this.router.navigate(['/compromissos']);
        },
        error: (err) => {
          console.error('Erro ao fazer login:', err);
          this.error = 'Email ou senha inválidos';
        },
      });
    }
  }

  onRegistroSubmit() {
    if (this.registroForm.valid) {
      const { nome, email, senha } = this.registroForm.value;
      this.authService.registrar(nome, email, senha, 'user').subscribe({
        next: () => {
          this.error = '';
          this.isLoginForm = true;
          this.loginForm.patchValue({ email, senha });
        },
        error: (err) => {
          console.error('Erro ao registrar:', err);
          this.error = 'Erro ao criar conta. Tente novamente.';
        },
      });
    }
  }
}
