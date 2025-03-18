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
      <h2>Gerenciar Compromissos</h2>

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

      <form [formGroup]="compromissoForm" (ngSubmit)="onSubmit()" class="mb-4">
        <div class="mb-3">
          <label for="titulo" class="form-label">Título</label>
          <input
            type="text"
            class="form-control"
            id="titulo"
            formControlName="titulo"
          />
        </div>
        <div class="mb-3">
          <label for="descricao" class="form-label">Descrição</label>
          <textarea
            class="form-control"
            id="descricao"
            formControlName="descricao"
          ></textarea>
        </div>
        <div class="row">
          <div class="col-md-6 mb-3">
            <label for="data" class="form-label">Data</label>
            <input
              type="date"
              class="form-control"
              id="data"
              formControlName="data"
            />
          </div>
          <div class="col-md-6 mb-3">
            <label for="hora" class="form-label">Hora</label>
            <input
              type="time"
              class="form-control"
              id="hora"
              formControlName="hora"
            />
          </div>
        </div>
        <div class="mb-3">
          <label for="contatoId" class="form-label">Contato</label>
          <select
            class="form-control"
            id="contatoId"
            formControlName="contatoId"
          >
            <option [value]="null">Selecione um contato</option>
            <option *ngFor="let contato of contatos" [value]="contato.id">
              {{ contato.nome }}
            </option>
          </select>
        </div>
        <div class="mb-3">
          <label for="localId" class="form-label">Local</label>
          <select class="form-control" id="localId" formControlName="localId">
            <option [value]="null">Selecione um local</option>
            <option *ngFor="let local of locais" [value]="local.id">
              {{ local.nome }}
            </option>
          </select>
        </div>
        <button
          type="submit"
          class="btn btn-primary"
          [disabled]="!compromissoForm.valid"
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

      <div class="card">
        <div class="card-header">
          <h4>Compromissos Agendados</h4>
        </div>
        <div class="card-body">
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
                <td>{{ getNomeContato(compromisso.contatoId) }}</td>
                <td>{{ getNomeLocal(compromisso.localId) }}</td>
                <td>
                  <button
                    class="btn btn-sm btn-primary me-2"
                    (click)="editarCompromisso(compromisso)"
                    *ngIf="podeEditarOuExcluir(compromisso)"
                  >
                    Editar
                  </button>
                  <button
                    class="btn btn-sm btn-danger"
                    (click)="excluirCompromisso(compromisso.id!)"
                    *ngIf="podeEditarOuExcluir(compromisso)"
                  >
                    Excluir
                  </button>
                  <span
                    *ngIf="!podeEditarOuExcluir(compromisso)"
                    class="text-muted"
                  >
                    Sem permissão para editar/excluir
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class CompromissosComponent implements OnInit {
  compromissos: Compromisso[] = [];
  contatos: Contato[] = [];
  locais: Local[] = [];
  compromissoForm: FormGroup;
  editando = false;
  compromissoEditandoId: number | null = null;
  mensagem: string = '';

  constructor(
    private compromissoService: CompromissoService,
    private contatoService: ContatoService,
    private localService: LocalService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.compromissoForm = this.fb.group({
      titulo: ['', Validators.required],
      descricao: ['', Validators.required],
      data: ['', Validators.required],
      hora: ['', Validators.required],
      contatoId: [null],
      localId: [null],
    });
  }

  ngOnInit(): void {
    this.carregarCompromissos();
    this.carregarContatos();
    this.carregarLocais();
  }

  carregarCompromissos(): void {
    this.compromissoService.getCompromissos().subscribe({
      next: (compromissos) => {
        this.compromissos = this.ordenarCompromissos(compromissos);
      },
      error: (erro) => {
        this.mensagem = 'Erro ao carregar compromissos: ' + erro.message;
      },
    });
  }

  ordenarCompromissos(compromissos: Compromisso[]): Compromisso[] {
    return compromissos.sort((a, b) => {
      // Primeiro compara as datas
      const dataA = new Date(a.data);
      const dataB = new Date(b.data);

      if (dataA.getTime() !== dataB.getTime()) {
        return dataA.getTime() - dataB.getTime();
      }

      // Se as datas forem iguais, compara as horas
      const [horaA, minutoA] = a.hora.split(':').map(Number);
      const [horaB, minutoB] = b.hora.split(':').map(Number);

      if (horaA !== horaB) {
        return horaA - horaB;
      }

      return minutoA - minutoB;
    });
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

  carregarLocais(): void {
    this.localService.getLocais().subscribe({
      next: (locais) => {
        this.locais = locais;
      },
      error: (erro) => {
        this.mensagem = 'Erro ao carregar locais: ' + erro.message;
      },
    });
  }

  onSubmit(): void {
    if (this.compromissoForm.valid) {
      if (this.editando && this.compromissoEditandoId) {
        this.compromissoService
          .atualizarCompromisso(
            this.compromissoEditandoId,
            this.compromissoForm.value
          )
          .subscribe({
            next: () => {
              this.mensagem = 'Compromisso atualizado com sucesso!';
              this.carregarCompromissos();
              this.cancelarEdicao();
            },
            error: (erro) => {
              this.mensagem = 'Erro ao atualizar compromisso: ' + erro.message;
            },
          });
      } else {
        this.compromissoService
          .criarCompromisso(this.compromissoForm.value)
          .subscribe({
            next: () => {
              this.mensagem = 'Compromisso criado com sucesso!';
              this.carregarCompromissos();
              this.compromissoForm.reset();
            },
            error: (erro) => {
              this.mensagem = 'Erro ao criar compromisso: ' + erro.message;
            },
          });
      }
    }
  }

  editarCompromisso(compromisso: Compromisso): void {
    this.editando = true;
    this.compromissoEditandoId = compromisso.id ?? null;
    this.compromissoForm.patchValue({
      titulo: compromisso.titulo,
      descricao: compromisso.descricao,
      data: compromisso.data,
      hora: compromisso.hora,
      contatoId: compromisso.contatoId,
      localId: compromisso.localId,
    });
  }

  excluirCompromisso(id: number): void {
    if (confirm('Tem certeza que deseja excluir este compromisso?')) {
      this.compromissoService.excluirCompromisso(id).subscribe({
        next: () => {
          this.mensagem = 'Compromisso excluído com sucesso!';
          this.carregarCompromissos();
        },
        error: (erro) => {
          this.mensagem = 'Erro ao excluir compromisso: ' + erro.message;
        },
      });
    }
  }

  cancelarEdicao(): void {
    this.editando = false;
    this.compromissoEditandoId = null;
    this.compromissoForm.reset();
  }

  podeEditarOuExcluir(compromisso: Compromisso): boolean {
    const usuario = this.authService.getUsuarioLogado();
    if (!usuario) return false;

    if (usuario.nivelAcesso === 'admin') return true;

    return compromisso.userId
      ? compromisso.userId === usuario.id.toString()
      : false;
  }

  getNomeContato(id: number): string {
    if (!id) return 'Nenhum contato selecionado';
    const contato = this.contatos.find((c) => Number(c.id) === Number(id));
    return contato ? contato.nome : 'Contato não encontrado';
  }

  getNomeLocal(id: number): string {
    if (!id) return 'Nenhum local selecionado';
    const local = this.locais.find((l) => Number(l.id) === Number(id));
    return local ? local.nome : 'Local não encontrado';
  }
}
