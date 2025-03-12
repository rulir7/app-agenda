export interface Usuario {
  id: number;
  nome: string;
  email: string;
  nivelAcesso: 'admin' | 'user';
}
