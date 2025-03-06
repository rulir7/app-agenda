import { Component, OnInit } from '@angular/core';
import { CompromissoService } from '../../services/compromisso.service';
import { Compromisso } from '../compromissos/compromisso.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-compromisso',
  imports: [FormsModule, CommonModule],
  templateUrl: './compromisso.component.html',
  styleUrls: ['./compromisso.component.css'],
})
export class CompromissoComponent implements OnInit {
  compromissos: Compromisso[] = [];
  compromissoSelecionado: Compromisso | null = null;

  constructor(private compromissoService: CompromissoService) {}

  ngOnInit() {
    this.loadCompromissos();
  }

  loadCompromissos() {
    this.compromissoService.getCompromissos().subscribe((data) => {
      this.compromissos = data;
    });
  }

  selecionarCompromisso(compromisso: Compromisso) {
    this.compromissoSelecionado = { ...compromisso };
  }

  salvarCompromisso() {
    if (this.compromissoSelecionado?.id) {
      this.compromissoService
        .updateCompromisso(this.compromissoSelecionado)
        .subscribe(() => {
          this.loadCompromissos();
          this.compromissoSelecionado = null;
        });
    }
  }

  excluirCompromisso(id: number) {
    if (confirm('Tem certeza que deseja excluir este compromisso?')) {
      this.compromissoService.deleteCompromisso(id).subscribe(() => {
        this.loadCompromissos();
      });
    }
  }
}
