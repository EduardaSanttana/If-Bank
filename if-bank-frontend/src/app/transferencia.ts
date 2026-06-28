export interface Transferencia {
  id?: number;
  contaOrigem: { id: number; numeroConta?: string; saldo?: number };
  contaDestino: { id: number; numeroConta?: string; saldo?: number };
  valor: number;
  dataTransferencia: string;
}
