import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { LocalService } from '../../services/local.service';
import { AuthService } from '../../services/auth.service';
import { Local } from '../../models/local.interface';

@Component({
  selector: 'app-locais',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mt-4">
      <h2>Locais</h2>

      <!-- Formulário de Novo Local -->
      <div class="card mb-4" *ngIf="authService.isAdmin()">
        <div class="card-header">
          <h4>{{ modoEdicao ? 'Editar Local' : 'Novo Local' }}</h4>
        </div>
        <div class="card-body">
          <form [formGroup]="localForm" (ngSubmit)="onSubmit()">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Nome</label>
                <input
                  type="text"
                  class="form-control"
                  formControlName="nome"
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Endereço</label>
                <input
                  type="text"
                  class="form-control"
                  formControlName="endereco"
                />
              </div>
            </div>
            <button
              type="submit"
              class="btn btn-primary"
              [disabled]="!localForm.valid"
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

      <!-- Lista de Locais -->
      <div class="card">
        <div class="card-header">
          <h4>Locais Cadastrados</h4>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Endereço</th>
                  <th *ngIf="authService.isAdmin()">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let local of locais">
                  <td>{{ local.nome }}</td>
                  <td>{{ local.endereco }}</td>
                  <td *ngIf="authService.isAdmin()">
                    <button
                      class="btn btn-sm btn-warning me-2"
                      (click)="editarLocal(local)"
                    >
                      Editar
                    </button>
                    <button
                      class="btn btn-sm btn-danger"
                      (click)="deletarLocal(local.id!)"
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
export class LocaisComponent implements OnInit {
  localForm: FormGroup;
  locais: Local[] = [];
  modoEdicao = false;
  localEmEdicao: number | null = null;

  constructor(
    private fb: FormBuilder,
    private localService: LocalService,
    public authService: AuthService
  ) {
    this.localForm = this.fb.group({
      nome: ['', Validators.required],
      endereco: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.carregarLocais();
  }

  carregarLocais() {
    this.localService.getLocais().subscribe((locais) => {
      this.locais = locais;
    });
  }

  onSubmit() {
    if (this.localForm.valid) {
      const local = this.localForm.value;

      if (this.modoEdicao && this.localEmEdicao) {
        this.localService.atualizarLocal(this.localEmEdicao, local).subscribe({
          next: () => {
            this.resetForm();
            this.carregarLocais();
          },
          error: (error) => console.error('Erro ao atualizar local:', error),
        });
      } else {
        this.localService.criarLocal(local).subscribe({
          next: () => {
            this.resetForm();
            this.carregarLocais();
          },
          error: (error) => console.error('Erro ao criar local:', error),
        });
      }
    }
  }

  editarLocal(local: Local) {
    this.modoEdicao = true;
    this.localEmEdicao = local.id ?? null;
    this.localForm.patchValue(local);
  }

  deletarLocal(id: number) {
    if (confirm('Tem certeza que deseja excluir este local?')) {
      this.localService.excluirLocal(id).subscribe({
        next: () => this.carregarLocais(),
        error: (error) => console.error('Erro ao deletar local:', error),
      });
    }
  }

  resetForm() {
    this.localForm.reset();
    this.modoEdicao = false;
    this.localEmEdicao = null;
  }
}
