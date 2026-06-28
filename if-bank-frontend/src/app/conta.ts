import { Movimentacao } from './movimentacao';

export interface Conta {
  id: number;
  numeroConta: string;
  saldo: number;
  movimentacoes?: Movimentacao[];
}
