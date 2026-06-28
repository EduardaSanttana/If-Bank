import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Usuario } from '../../usuario';
import { Movimentacao } from '../../movimentacao';
import { UsuarioService } from '../../usuario-service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-extrato',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './extrato.html',
  styleUrl: './extrato.css',
})
export class Extrato implements OnInit {

  private usuarioService = inject(UsuarioService);
  protected authService = inject(AuthService);

  usuario = signal<Usuario | null>(null);
  movimentacoes = signal<Movimentacao[]>([]);
  totalEntradas = signal(0);
  totalSaidas = signal(0);
  carregando = signal(true);

  ngOnInit(): void {

    const usuarioAuth = this.authService.getUsuario();

    if (!usuarioAuth) {
      this.carregando.set(false);
      return;
    }

    this.usuarioService.getById(usuarioAuth.id).subscribe(usuario => {

      this.usuario.set(usuario);

      const movs = usuario.conta?.movimentacoes ?? [];

      this.movimentacoes.set(movs);

      this.calcularTotais();

      this.carregando.set(false);

    });

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