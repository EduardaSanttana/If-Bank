import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Usuario } from '../../usuario';
import { Investimento } from '../../investimento';

import { UsuarioService } from '../../usuario-service';
import { InvestimentoService } from '../../investimento-service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-investimentos',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './investimentos.html',
  styleUrl: './investimentos.css',
})
export class Investimentos implements OnInit {

  private usuarioService = inject(UsuarioService);
  private investimentoService = inject(InvestimentoService);

  protected authService = inject(AuthService);

  usuario = signal<Usuario | null>(null);

  investimentos = signal<Investimento[]>([]);

  totalInvestido = signal(0);

  totalRendimento = signal(0);

  filtroDataInicio = '';
  
  filtroDataFim = '';

  carregando = signal(true);

  ngOnInit(): void {

    const usuarioAuth = this.authService.getUsuario();

    if (!usuarioAuth) {
      this.carregando.set(false);
      return;
    }

    this.usuarioService.getById(usuarioAuth.id).subscribe(usuario => {

      this.usuario.set(usuario);

      this.carregarInvestimentos();

    });

  }

  private carregarInvestimentos(): void {

    this.carregando.set(true);
    const usuarioId = this.usuario()?.id;

    if (!usuarioId) {
      this.carregando.set(false);
      return;
    } 

  this.investimentoService.getByUsuario(usuarioId).subscribe(lista => {

      this.investimentos.set(lista);

      this.calcularTotais();

      this.carregando.set(false);

    });

  }

  buscarPorPeriodo(): void {

    const usuarioId = this.usuario()?.id;

    if (!usuarioId) {
      return;
    }

    if (!this.filtroDataInicio || !this.filtroDataFim) {
      alert('Selecione as duas datas.');
      return;
    }

    this.carregando.set(true);

    this.investimentoService
      .buscarPorPeriodo(
        usuarioId,
        this.filtroDataInicio,
        this.filtroDataFim
      )
      .subscribe(lista => {

        this.investimentos.set(lista);

        this.calcularTotais();

        this.carregando.set(false);

      });

  }

  //limpa o filtro de data, e retorna a lista total dos investimentos daquele usuario
  limparFiltro(): void {

    this.filtroDataInicio = '';
    this.filtroDataFim = '';

    const usuarioAuth = this.authService.getUsuario();

    if (!usuarioAuth) {
      return;
    }

    this.carregando.set(true);

    this.investimentoService
        .getByUsuario(usuarioAuth.id)
        .subscribe(lista => {

          this.investimentos.set(lista);

          this.carregando.set(false);

        });

  }

  private calcularTotais(): void {

    const lista = this.investimentos();

    this.totalInvestido.set(

      lista.reduce(
        (acc, inv) => acc + inv.valorAplicado,
        0
      )

    );

    this.totalRendimento.set(

      lista.reduce(
        (acc, inv) => acc + inv.rendimento,
        0
      )

    );

  }

  formatarValor(valor: number): string {

    return valor.toLocaleString('pt-BR', {

      minimumFractionDigits: 2,

      maximumFractionDigits: 2

    });

  }

}