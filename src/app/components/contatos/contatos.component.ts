import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ContatoService } from '../../services/contato.service';
import { AuthService } from '../../services/auth.service';
import { Contato } from '../../models/contato.interface';

@Component({
  selector: 'app-contatos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mt-4">
      <h2>Gerenciar Contatos</h2>

      <!-- Mensagem de erro/sucesso -->
      <div
        *ngIf="mensagem"
        class="alert"
        [ngClass]="{
          'alert-success': !mensagem.includes('erro'),
          'alert-danger': mensagem.includes('erro')
        }"
      >
        {{ mensagem }}
      </div>

      <form [formGroup]="contatoForm" (ngSubmit)="onSubmit()" class="mb-4">
        <div class="mb-3">
          <label for="nome" class="form-label">Nome</label>
          <input
            type="text"
            class="form-control"
            id="nome"
            formControlName="nome"
          />
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input
            type="email"
            class="form-control"
            id="email"
            formControlName="email"
          />
        </div>
        <div class="mb-3">
          <label for="telefone" class="form-label">Telefone</label>
          <input
            type="tel"
            class="form-control"
            id="telefone"
            formControlName="telefone"
          />
        </div>
        <button
          type="submit"
          class="btn btn-primary"
          [disabled]="!contatoForm.valid"
        >
          {{ editando ? 'Atualizar' : 'Adicionar' }}
        </button>
        <button
          *ngIf="editando"
          type="button"
          class="btn btn-secondary ms-2"
          (click)="cancelarEdicao()"
        >
          Cancelar
        </button>
      </form>

      <table class="table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let contato of contatos">
            <td>{{ contato.nome }}</td>
            <td>{{ contato.email }}</td>
            <td>{{ contato.telefone }}</td>
            <td>
              <button
                class="btn btn-sm btn-primary me-2"
                (click)="editarContato(contato)"
                *ngIf="podeEditarOuExcluir(contato)"
              >
                Editar
              </button>
              <button
                class="btn btn-sm btn-danger"
                (click)="excluirContato(contato.id)"
                *ngIf="podeEditarOuExcluir(contato)"
              >
                Excluir
              </button>
              <span *ngIf="!podeEditarOuExcluir(contato)" class="text-muted">
                Sem permissão para editar/excluir
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [],
})
export class ContatosComponent implements OnInit {
  contatos: Contato[] = [];
  contatoForm: FormGroup;
  editando = false;
  contatoEditandoId: number | null = null;
  mensagem: string = '';

  constructor(
    private contatoService: ContatoService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.contatoForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.carregarContatos();
  }

  carregarContatos(): void {
    this.contatoService.getContatos().subscribe({
      next: (contatos) => {
        this.contatos = contatos;
      },
      error: (erro) => {
        this.mensagem = 'Erro ao carregar contatos: ' + erro.message;
      },
    });
  }

  onSubmit(): void {
    if (this.contatoForm.valid) {
      if (this.editando && this.contatoEditandoId) {
        this.contatoService
          .atualizarContato(this.contatoEditandoId, this.contatoForm.value)
          .subscribe({
            next: () => {
              this.mensagem = 'Contato atualizado com sucesso!';
              this.carregarContatos();
              this.cancelarEdicao();
            },
            error: (erro) => {
              this.mensagem = 'Erro ao atualizar contato: ' + erro.message;
            },
          });
      } else {
        this.contatoService.criarContato(this.contatoForm.value).subscribe({
          next: () => {
            this.mensagem = 'Contato criado com sucesso!';
            this.carregarContatos();
            this.contatoForm.reset();
          },
          error: (erro) => {
            this.mensagem = 'Erro ao criar contato: ' + erro.message;
          },
        });
      }
    }
  }

  editarContato(contato: Contato): void {
    this.editando = true;
    this.contatoEditandoId = contato.id;
    this.contatoForm.patchValue({
      nome: contato.nome,
      email: contato.email,
      telefone: contato.telefone,
    });
  }

  excluirContato(id: number): void {
    if (confirm('Tem certeza que deseja excluir este contato?')) {
      this.contatoService.excluirContato(id).subscribe({
        next: () => {
          this.mensagem = 'Contato excluído com sucesso!';
          this.carregarContatos();
        },
        error: (erro) => {
          this.mensagem = 'Erro ao excluir contato: ' + erro.message;
        },
      });
    }
  }

  cancelarEdicao(): void {
    this.editando = false;
    this.contatoEditandoId = null;
    this.contatoForm.reset();
  }

  podeEditarOuExcluir(contato: Contato): boolean {
    const usuario = this.authService.getUsuarioLogado();
    if (!usuario) return false;

    if (usuario.nivelAcesso === 'admin') return true;

    return contato.userId ? contato.userId === usuario.id.toString() : false;
  }
}
