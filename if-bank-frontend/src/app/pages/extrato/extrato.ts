import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Usuario } from '../../usuario';
import { Movimentacao } from '../../movimentacao';
import { UsuarioService } from '../../usuario-service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-extrato',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './extrato.html',
  styleUrl: './extrato.css',
})
export class Extrato implements OnInit {

  private usuarioService = inject(UsuarioService);
  protected authService = inject(AuthService);

  usuario = signal<Usuario | null>(null);

  // lista completa, sem filtro de periodo (vinda da conta do usuario)
  private todasMovimentacoes = signal<Movimentacao[]>([]);

  // lista apos aplicar o filtro de periodo (mesmo padrao da tela de investimentos)
  movimentacoes = signal<Movimentacao[]>([]);

  totalEntradas = signal(0);
  totalSaidas = signal(0);
  carregando = signal(true);

  filtroDataInicio = '';
  filtroDataFim = '';

  // paginacao, 5 por pagina
  paginaAtual = signal(1);
  itensPorPagina = 5;

  totalPaginas = computed(() =>
    Math.max(1, Math.ceil(this.movimentacoes().length / this.itensPorPagina))
  );

  movimentacoesPaginadas = computed(() => {
    const inicio = (this.paginaAtual() - 1) * this.itensPorPagina;
    return this.movimentacoes().slice(inicio, inicio + this.itensPorPagina);
  });

  ngOnInit(): void {

    const usuarioAuth = this.authService.getUsuario();

    if (!usuarioAuth) {
      this.carregando.set(false);
      return;
    }

    this.usuarioService.getById(usuarioAuth.id).subscribe(usuario => {

      this.usuario.set(usuario);

      const movs = usuario.conta?.movimentacoes ?? [];

      this.todasMovimentacoes.set(movs);
      this.movimentacoes.set(movs);

      this.calcularTotais();

      this.carregando.set(false);

    });

  }

  buscarPorPeriodo(): void {

    if (!this.filtroDataInicio || !this.filtroDataFim) {
      alert('Selecione as duas datas.');
      return;
    }

    const inicio = new Date(this.filtroDataInicio + 'T00:00:00');
    const fim = new Date(this.filtroDataFim + 'T23:59:59');

    const filtradas = this.todasMovimentacoes().filter(mov => {
      const data = new Date(mov.dataMovimentacao);
      return data >= inicio && data <= fim;
    });

    this.movimentacoes.set(filtradas);
    this.calcularTotais();
    this.paginaAtual.set(1);

  }

  //limpa o filtro de data, e retorna a lista total de movimentacoes daquele usuario
  limparFiltro(): void {

    this.filtroDataInicio = '';
    this.filtroDataFim = '';

    this.movimentacoes.set(this.todasMovimentacoes());
    this.calcularTotais();
    this.paginaAtual.set(1);

  }

  irParaPagina(pagina: number): void {
    if (pagina < 1 || pagina > this.totalPaginas()) {
      return;
    }
    this.paginaAtual.set(pagina);
  }

  paginaAnterior(): void {
    this.irParaPagina(this.paginaAtual() - 1);
  }

  proximaPagina(): void {
    this.irParaPagina(this.paginaAtual() + 1);
  }

  private calcularTotais(): void {

    this.totalEntradas.set(
      this.movimentacoes()
        .filter(m => m.tipo === 'DEPOSITO' || m.tipo === 'TRANSFERENCIA_RECEBIDA')
        .reduce((acc, m) => acc + m.valor, 0)
    );

    this.totalSaidas.set(
      this.movimentacoes()
        .filter(m => m.tipo === 'SAQUE' || m.tipo === 'TRANSFERENCIA_ENVIADA')
        .reduce((acc, m) => acc + m.valor, 0)
    );

  }

  getTipoClass(tipo: string): string {
    if (tipo === 'DEPOSITO' || tipo === 'TRANSFERENCIA_RECEBIDA') return 'entrada';
    if (tipo === 'SAQUE' || tipo === 'TRANSFERENCIA_ENVIADA') return 'saida';
    return 'neutro';
  }

  formatarTipo(tipo: string): string {
    const mapa: Record<string, string> = {
      DEPOSITO: 'Depósito',
      SAQUE: 'Saque',
      TRANSFERENCIA_ENVIADA: 'Transferência Enviada',
      TRANSFERENCIA_RECEBIDA: 'Transferência Recebida',
      INVESTIMENTO: 'Investimento',
    };
    return mapa[tipo] ?? tipo;
  }

  formatarValor(valor: number): string {
    return valor.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  isSaida(tipo: string): boolean {
    return tipo === 'SAQUE' || tipo === 'TRANSFERENCIA_ENVIADA';
  }

}