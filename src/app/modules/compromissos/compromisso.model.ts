// compromisso.model.ts - Modelo de dados para compromissos
export interface Compromisso {
  id?: number;
  titulo: string;
  descricao: string;
  data: string;
  hora: string;
  contatoId: number;
  localId: number;
  usuarioId: number;
}
