import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CompromissoService } from '../../services/compromisso.service';
import { ContatoService } from '../../services/contato.service';
import { LocalService } from '../../services/local.service';
import { AuthService } from '../../services/auth.service';
import { Compromisso } from '../../models/compromisso.interface';
import { Contato } from '../../models/contato.interface';
import { Local } from '../../models/local.interface';

@Component({
  selector: 'app-compromissos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mt-4">
      <h2>Compromissos</h2>

      <!-- Formulário de Novo Compromisso -->
      <div class="card mb-4">
        <div class="card-header">
          <h4>Novo Compromisso</h4>
        </div>
        <div class="card-body">
          <form [formGroup]="compromissoForm" (ngSubmit)="onSubmit()">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Título</label>
                <input
                  type="text"
                  class="form-control"
                  formControlName="titulo"
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Descrição</label>
                <input
                  type="text"
                  class="form-control"
                  formControlName="descricao"
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Data</label>
                <input
                  type="date"
                  class="form-control"
                  formControlName="data"
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Hora</label>
                <input
                  type="time"
                  class="form-control"
                  formControlName="hora"
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Contato</label>
                <select class="form-control" formControlName="contatoId">
                  <option value="">Selecione um contato</option>
                  <option *ngFor="let contato of contatos" [value]="contato.id">
                    {{ contato.nome }}
                  </option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Local</label>
                <select class="form-control" formControlName="localId">
                  <option value="">Selecione um local</option>
                  <option *ngFor="let local of locais" [value]="local.id">
                    {{ local.nome }}
                  </option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              class="btn btn-primary"
              [disabled]="!compromissoForm.valid"
            >
              Salvar
            </button>
          </form>
        </div>
      </div>

      <!-- Lista de Compromissos -->
      <div class="card">
        <div class="card-header">
          <h4>Meus Compromissos</h4>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Data</th>
                  <th>Hora</th>
                  <th>Contato</th>
                  <th>Local</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let compromisso of compromissos">
                  <td>{{ compromisso.titulo }}</td>
                  <td>{{ compromisso.data | date : 'dd/MM/yyyy' }}</td>
                  <td>{{ compromisso.hora }}</td>
                  <td>{{ getContatoNome(compromisso.contatoId) }}</td>
                  <td>{{ getLocalNome(compromisso.localId) }}</td>
                  <td>
                    <button
                      class="btn btn-sm btn-warning me-2"
                      (click)="editarCompromisso(compromisso)"
                    >
                      Editar
                    </button>
                    <button
                      class="btn btn-sm btn-danger"
                      (click)="deletarCompromisso(compromisso.id!)"
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
export class CompromissosComponent implements OnInit {
  compromissoForm: FormGroup;
  compromissos: Compromisso[] = [];
  contatos: Contato[] = [];
  locais: Local[] = [];
  modoEdicao = false;
  compromissoEmEdicao: number | null = null;

  constructor(
    private fb: FormBuilder,
    private compromissoService: CompromissoService,
    private contatoService: ContatoService,
    private localService: LocalService,
    private authService: AuthService
  ) {
    this.compromissoForm = this.fb.group({
      titulo: ['', Validators.required],
      descricao: ['', Validators.required],
      data: ['', Validators.required],
      hora: ['', Validators.required],
      contatoId: ['', Validators.required],
      localId: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.carregarCompromissos();
    this.carregarContatos();
    this.carregarLocais();
  }

  carregarCompromissos() {
    this.compromissoService.getCompromissos().subscribe((compromissos) => {
      this.compromissos = compromissos;
    });
  }

  carregarContatos() {
    this.contatoService.getContatos().subscribe((contatos) => {
      this.contatos = contatos;
    });
  }

  carregarLocais() {
    this.localService.getLocais().subscribe((locais) => {
      this.locais = locais;
    });
  }

  onSubmit() {
    if (this.compromissoForm.valid) {
      const compromisso = this.compromissoForm.value;

      if (this.modoEdicao && this.compromissoEmEdicao) {
        this.compromissoService
          .atualizarCompromisso(this.compromissoEmEdicao, compromisso)
          .subscribe({
            next: () => {
              this.resetForm();
              this.carregarCompromissos();
            },
            error: (error) =>
              console.error('Erro ao atualizar compromisso:', error),
          });
      } else {
        this.compromissoService.criarCompromisso(compromisso).subscribe({
          next: () => {
            this.resetForm();
            this.carregarCompromissos();
          },
          error: (error) => console.error('Erro ao criar compromisso:', error),
        });
      }
    }
  }

  editarCompromisso(compromisso: Compromisso) {
    this.modoEdicao = true;
    this.compromissoEmEdicao = compromisso.id;
    this.compromissoForm.patchValue(compromisso);
  }

  deletarCompromisso(id: number) {
    if (confirm('Tem certeza que deseja excluir este compromisso?')) {
      this.compromissoService.deletarCompromisso(id).subscribe({
        next: () => this.carregarCompromissos(),
        error: (error) => console.error('Erro ao deletar compromisso:', error),
      });
    }
  }

  resetForm() {
    this.compromissoForm.reset();
    this.modoEdicao = false;
    this.compromissoEmEdicao = null;
  }

  getContatoNome(id: number): string {
    const contato = this.contatos.find((c) => c.id === id);
    return contato ? contato.nome : 'Não encontrado';
  }

  getLocalNome(id: number): string {
    const local = this.locais.find((l) => l.id === id);
    return local ? local.nome : 'Não encontrado';
  }
}
