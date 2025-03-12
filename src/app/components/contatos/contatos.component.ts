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
      <h2>Contatos</h2>

      <!-- Formulário de Novo Contato -->
      <div class="card mb-4">
        <div class="card-header">
          <h4>{{ modoEdicao ? 'Editar Contato' : 'Novo Contato' }}</h4>
        </div>
        <div class="card-body">
          <form [formGroup]="contatoForm" (ngSubmit)="onSubmit()">
            <div class="row">
              <div class="col-md-4 mb-3">
                <label class="form-label">Nome</label>
                <input
                  type="text"
                  class="form-control"
                  formControlName="nome"
                />
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">Telefone</label>
                <input
                  type="tel"
                  class="form-control"
                  formControlName="telefone"
                />
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">Email</label>
                <input
                  type="email"
                  class="form-control"
                  formControlName="email"
                />
              </div>
            </div>
            <button
              type="submit"
              class="btn btn-primary"
              [disabled]="!contatoForm.valid"
            >
              {{ modoEdicao ? 'Atualizar' : 'Salvar' }}
            </button>
            <button
              *ngIf="modoEdicao"
              type="button"
              class="btn btn-secondary ms-2"
              (click)="resetForm()"
            >
              Cancelar
            </button>
          </form>
        </div>
      </div>

      <!-- Lista de Contatos -->
      <div class="card">
        <div class="card-header">
          <h4>Meus Contatos</h4>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Telefone</th>
                  <th>Email</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let contato of contatos">
                  <td>{{ contato.nome }}</td>
                  <td>{{ contato.telefone }}</td>
                  <td>{{ contato.email }}</td>
                  <td>
                    <button
                      class="btn btn-sm btn-warning me-2"
                      (click)="editarContato(contato)"
                    >
                      Editar
                    </button>
                    <button
                      class="btn btn-sm btn-danger"
                      (click)="deletarContato(contato.id!)"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ContatosComponent implements OnInit {
  contatoForm: FormGroup;
  contatos: Contato[] = [];
  modoEdicao = false;
  contatoEmEdicao: number | null = null;

  constructor(
    private fb: FormBuilder,
    private contatoService: ContatoService,
    private authService: AuthService
  ) {
    this.contatoForm = this.fb.group({
      nome: ['', Validators.required],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {
    this.carregarContatos();
  }

  carregarContatos() {
    this.contatoService.getContatos().subscribe((contatos) => {
      this.contatos = contatos;
    });
  }

  onSubmit() {
    if (this.contatoForm.valid) {
      const contato = this.contatoForm.value;

      if (this.modoEdicao && this.contatoEmEdicao) {
        this.contatoService
          .atualizarContato(this.contatoEmEdicao, contato)
          .subscribe({
            next: () => {
              this.resetForm();
              this.carregarContatos();
            },
            error: (error) =>
              console.error('Erro ao atualizar contato:', error),
          });
      } else {
        this.contatoService.criarContato(contato).subscribe({
          next: () => {
            this.resetForm();
            this.carregarContatos();
          },
          error: (error) => console.error('Erro ao criar contato:', error),
        });
      }
    }
  }

  editarContato(contato: Contato) {
    this.modoEdicao = true;
    this.contatoEmEdicao = contato.id;
    this.contatoForm.patchValue(contato);
  }

  deletarContato(id: number) {
    if (confirm('Tem certeza que deseja excluir este contato?')) {
      this.contatoService.deletarContato(id).subscribe({
        next: () => this.carregarContatos(),
        error: (error) => console.error('Erro ao deletar contato:', error),
      });
    }
  }

  resetForm() {
    this.contatoForm.reset();
    this.modoEdicao = false;
    this.contatoEmEdicao = null;
  }
}
