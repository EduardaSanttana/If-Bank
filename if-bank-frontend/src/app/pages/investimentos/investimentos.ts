import { Component, HostListener, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Usuario } from '../../usuario';
import { Investimento } from '../../investimento';

import { UsuarioService } from '../../usuario-service';
import { InvestimentoService } from '../../investimento-service';
import { AuthService } from '../../auth.service';
import { PerfilModal } from '../../components/perfil-modal/perfil-modal';

@Component({
  selector: 'app-investimentos',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, PerfilModal],
  templateUrl: './investimentos.html',
  styleUrl: './investimentos.css',
})
export class Investimentos implements OnInit {

  private usuarioService = inject(UsuarioService);
  private investimentoService = inject(InvestimentoService);

  protected authService = inject(AuthService);

  usuario = signal<Usuario | null>(null);

  investimentos = signal<Investimento[]>([]);

  paginaAtual = signal(1);
  itensPorPagina = 5;

  totalPaginas = computed(() =>
    Math.max(1, Math.ceil(this.investimentos().length / this.itensPorPagina))
  );

  investimentosPaginados = computed(() => {
    const inicio = (this.paginaAtual() - 1) * this.itensPorPagina;
    return this.investimentos().slice(inicio, inicio + this.itensPorPagina);
  });

  totalInvestido = signal(0);

  totalRendimento = signal(0);

  filtroDataInicio = '';
  
  filtroDataFim = '';

  mostrarFormulario = signal(false);

  mensagem = signal('');

  mensagemErro = signal(false);

  enviando = signal(false);

  carregando = signal(true);
  menuAberto = signal(false);
  perfilAberto = signal(false);

  form = {
    tipo: '',
    valorAplicado: null as number | null
  };

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
      this.paginaAtual.set(1);

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

        this.paginaAtual.set(1);

        this.carregando.set(false);

      });

  }

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
          this.paginaAtual.set(1);
          this.carregando.set(false);

        });

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

  aplicarInvestimento(): void {

    this.mensagem.set('');

    if (!this.form.tipo || !this.form.valorAplicado) {

        this.mensagem.set("Preencha todos os campos.");

        this.mensagemErro.set(true);

        return;
    }

    this.enviando.set(true);

    const payload: Investimento = {

      tipo: this.form.tipo,

      valorAplicado: this.form.valorAplicado!,

      rendimento: 0,

      dataAplicacao: new Date().toISOString(),

      usuario: {
        id: this.usuario()!.id
      } as Usuario

    };

    this.investimentoService.create(payload).subscribe({

        next: () => {

            this.mensagem.set("Investimento realizado com sucesso!");

            this.mensagemErro.set(false);

            this.enviando.set(false);

            this.mostrarFormulario.set(false);

            this.form.tipo = '';

            this.form.valorAplicado = null;

            this.atualizarUsuario(); 
            this.carregarInvestimentos();

        },

        error: (err) => {

            console.log(err);
            this.enviando.set(false);

            this.mensagemErro.set(true);

            this.mensagem.set(

                err.error?.message ??
                "Erro ao realizar investimento."

            );

        }

    });

  } 

  private atualizarUsuario(): void {

    const usuarioAuth = this.authService.getUsuario();

    if (!usuarioAuth) {
      return;
    }

    this.usuarioService.getById(usuarioAuth.id).subscribe(usuario => {

      this.usuario.set(usuario);

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

  onUsuarioAtualizado(usuario: Usuario): void {
    this.usuario.set(usuario);
    this.authService.atualizarUsuario(usuario);
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