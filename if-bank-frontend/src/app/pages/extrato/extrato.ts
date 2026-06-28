import { Component, inject, OnInit } from '@angular/core';
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

  usuario: Usuario | null = null;
  movimentacoes: Movimentacao[] = [];
  totalEntradas = 0;
  totalSaidas = 0;
  carregando = true;

  ngOnInit(): void {
    const usuarioAuth = this.authService.getUsuario();
    if (!usuarioAuth) {
      this.carregando = false;
      return;
    }

    this.usuarioService.getById(usuarioAuth.id).subscribe(usuario => {
      this.usuario = usuario;
      this.movimentacoes = usuario.conta?.movimentacoes ?? [];
      this.calcularTotais();
      this.carregando = false;
    });
  }

  private calcularTotais(): void {
    this.totalEntradas = this.movimentacoes
      .filter(m => m.tipo === 'DEPOSITO' || m.tipo === 'TRANSFERENCIA_RECEBIDA')
      .reduce((acc, m) => acc + m.valor, 0);
    this.totalSaidas = this.movimentacoes
      .filter(m => m.tipo === 'SAQUE' || m.tipo === 'TRANSFERENCIA_ENVIADA')
      .reduce((acc, m) => acc + m.valor, 0);
  }

  getTipoClass(tipo: string): string {
    if (tipo === 'DEPOSITO' || tipo === 'TRANSFERENCIA_RECEBIDA') return 'entrada';
    if (tipo === 'SAQUE' || tipo === 'TRANSFERENCIA_ENVIADA') return 'saida';
    return 'neutro';
  }

  formatarTipo(tipo: string): string {
    const mapa: Record<string, string> = {
      'DEPOSITO': 'Depósito',
      'SAQUE': 'Saque',
      'TRANSFERENCIA_ENVIADA': 'Transferência Enviada',
      'TRANSFERENCIA_RECEBIDA': 'Transferência Recebida',
      'INVESTIMENTO': 'Investimento',
    };
    return mapa[tipo] ?? tipo;
  }

  formatarValor(valor: number): string {
    return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  isSaida(tipo: string): boolean {
    return tipo === 'SAQUE' || tipo === 'TRANSFERENCIA_ENVIADA';
  }
}
