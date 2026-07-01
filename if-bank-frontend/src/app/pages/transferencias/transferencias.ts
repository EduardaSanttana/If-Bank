import { Component, HostListener, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Transferencia } from '../../transferencia';
import { TransferenciaService } from '../../transferencia-service';
import { Conta } from '../../conta';
import { ContaService } from '../../conta-service';
import { Usuario } from '../../usuario';
import { UsuarioService } from '../../usuario-service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-transferencias',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './transferencias.html',
  styleUrl: './transferencias.css',
})
export class Transferencias implements OnInit {

  private transferenciaService = inject(TransferenciaService);
  private contaService = inject(ContaService);
  private usuarioService = inject(UsuarioService);
  protected authService = inject(AuthService);

  usuario = signal<Usuario | null>(null);
  contas = signal<Conta[]>([]);
  private todasTransferencias = signal<Transferencia[]>([]);
  transferencias = signal<Transferencia[]>([]);
  carregando = signal(true);
  menuAberto = signal(false);
  perfilAberto = signal(false);

  filtroDataInicio = '';
  filtroDataFim = '';

  paginaAtual = signal(1);
  itensPorPagina = 5;

  totalPaginas = computed(() =>
    Math.max(1, Math.ceil(this.transferencias().length / this.itensPorPagina))
  );

  transferenciasPaginadas = computed(() => {
    const inicio = (this.paginaAtual() - 1) * this.itensPorPagina;
    return this.transferencias().slice(inicio, inicio + this.itensPorPagina);
  });

  form = {
    numeroContaOrigem: '',
    numeroContaDestino: '',
    valor: null as number | null,
  };

  mensagem = signal('');
  mensagemErro = signal(false);
  enviando = signal(false);

  ngOnInit(): void {
    const usuarioAuth = this.authService.getUsuario();
    if (!usuarioAuth) {
      this.carregando.set(false);
      return;
    }

    this.usuarioService.getById(usuarioAuth.id).subscribe(usuario => {
      this.usuario.set(usuario);
      this.form.numeroContaOrigem = usuario.conta?.numeroConta ?? '';
      this.carregarTransferencias();
    });

    this.contaService.getAll().subscribe(contas => this.contas.set(contas));
  }

  private carregarTransferencias(): void {
    this.carregando.set(true);
    this.transferenciaService.getAll().subscribe(transferencias => {
      const contaId = this.usuario()?.conta?.id;
      const lista = contaId
        ? transferencias.filter(t =>
            t.contaOrigem.id === contaId || t.contaDestino.id === contaId
          )
        : transferencias;
      this.todasTransferencias.set(lista);
      this.transferencias.set(lista);
      this.filtroDataInicio = '';
      this.filtroDataFim = '';
      this.paginaAtual.set(1);
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

    const filtradas = this.todasTransferencias().filter(t => {
      const data = new Date(t.dataTransferencia);
      return data >= inicio && data <= fim;
    });

    this.transferencias.set(filtradas);
    this.paginaAtual.set(1);

  }

  limparFiltro(): void {

    this.filtroDataInicio = '';
    this.filtroDataFim = '';

    this.transferencias.set(this.todasTransferencias());
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

  enviar(): void {
    this.mensagem.set('');

    if (!this.form.numeroContaOrigem || !this.form.numeroContaDestino || !this.form.valor) {
      this.mensagem.set('Preencha todos os campos antes de enviar.');
      this.mensagemErro.set(true);
      return;
    }

    if (this.form.valor <= 0) {
      this.mensagem.set('O valor deve ser maior que zero.');
      this.mensagemErro.set(true);
      return;
    }

    if (this.form.numeroContaOrigem === this.form.numeroContaDestino) {
      this.mensagem.set('A conta de origem e destino não podem ser iguais.');
      this.mensagemErro.set(true);
      return;
    }

    const contaOrigem = this.contas().find(c => c.numeroConta === this.form.numeroContaOrigem);
    const contaDestino = this.contas().find(c => c.numeroConta === this.form.numeroContaDestino);

    if (!contaOrigem) {
      this.mensagem.set(`Conta de origem "${this.form.numeroContaOrigem}" não encontrada.`);
      this.mensagemErro.set(true);
      return;
    }

    if (!contaDestino) {
      this.mensagem.set(`Conta de destino "${this.form.numeroContaDestino}" não encontrada.`);
      this.mensagemErro.set(true);
      return;
    }

    const saldoAtual = this.usuario()?.conta?.saldo ?? 0;
    if (this.form.valor > saldoAtual) {
      this.mensagem.set('Saldo insuficiente para realizar a transferência.');
      this.mensagemErro.set(true);
      return;
    }

    this.enviando.set(true);

    const payload: Transferencia = {
      contaOrigem: { id: contaOrigem.id },
      contaDestino: { id: contaDestino.id },
      valor: this.form.valor,
      dataTransferencia: new Date().toISOString().slice(0, 19),
    };

    this.transferenciaService.create(payload).subscribe({
      next: () => {
        this.mensagem.set('Transferência realizada com sucesso!');
        this.mensagemErro.set(false);
        this.enviando.set(false);
        this.form.numeroContaDestino = '';
        this.form.valor = null;
        this.carregarTransferencias();
      },
      error: () => {
        this.mensagem.set('Erro ao realizar transferência. Verifique se a conta destino existe e há saldo suficiente.');
        this.mensagemErro.set(true);
        this.enviando.set(false);
      },
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
    return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  formatarData(data: string): string {
    return new Date(data).toLocaleString('pt-BR');
  }
}