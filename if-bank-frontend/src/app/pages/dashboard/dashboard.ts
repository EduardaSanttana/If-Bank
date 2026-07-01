import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
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

  usuario = signal<Usuario | null>(null);
  movimentacoes = signal<Movimentacao[]>([]);
  totalEntradas = signal(0);
  totalSaidas = signal(0);
  menuAberto = signal(false);
  perfilAberto = signal(false);

  ngOnInit(): void {

    const usuarioAuth = this.authService.getUsuario();

    if (!usuarioAuth) {
      return;
    }

    this.usuarioService.getById(usuarioAuth.id).subscribe(usuario => {

      this.usuario.set(usuario);

      const movs = usuario.conta?.movimentacoes ?? [];

      this.movimentacoes.set(movs);

      this.totalEntradas.set(
        movs
          .filter(m => m.tipo === 'DEPOSITO' || m.tipo === 'TRANSFERENCIA_RECEBIDA')
          .reduce((acc, m) => acc + m.valor, 0)
      );

      this.totalSaidas.set(
        movs
          .filter(m => m.tipo === 'SAQUE' || m.tipo === 'TRANSFERENCIA_ENVIADA')
          .reduce((acc, m) => acc + m.valor, 0)
      );

    });

  }

  toggleMenu(event: Event): void {
    event.stopPropagation();
    this.menuAberto.set(!this.menuAberto());
  }

  abrirPerfil(event: Event): void {
    event.stopPropagation();
    this.menuAberto.set(false);
    this.perfilAberto.set(true);
  }

  fecharPerfil(): void {
    this.perfilAberto.set(false);
  }

  @HostListener('document:click')
  fecharMenu(): void {
    this.menuAberto.set(false);
  }

  formatarValor(valor: number): string {
    return valor.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
}