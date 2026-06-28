import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Usuario } from '../../usuario';
import { Movimentacao } from '../../movimentacao';
import { UsuarioService } from '../../usuario-service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  private usuarioService = inject(UsuarioService);
  protected authService = inject(AuthService);

  usuario: Usuario | null = null;
  movimentacoes: Movimentacao[] = [];
  totalEntradas = 0;
  totalSaidas = 0;

  ngOnInit(): void {
    const usuarioAuth = this.authService.getUsuario();
    if (!usuarioAuth) return;

    this.usuarioService.getById(usuarioAuth.id).subscribe(usuario => {
      this.usuario = usuario;
      this.movimentacoes = usuario.conta?.movimentacoes ?? [];
      this.totalEntradas = this.movimentacoes
        .filter(m => m.tipo === 'DEPOSITO' || m.tipo === 'TRANSFERENCIA_RECEBIDA')
        .reduce((acc, m) => acc + m.valor, 0);
      this.totalSaidas = this.movimentacoes
        .filter(m => m.tipo === 'SAQUE' || m.tipo === 'TRANSFERENCIA_ENVIADA')
        .reduce((acc, m) => acc + m.valor, 0);
    });
  }

  formatarValor(valor: number): string {
    return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}
