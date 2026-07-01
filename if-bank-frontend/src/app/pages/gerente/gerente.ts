import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Usuario } from '../../usuario';
import { UsuarioService } from '../../usuario-service';
import { AuthService } from '../../auth.service';
import { PerfilModal } from '../../components/perfil-modal/perfil-modal';

type Aba = 'pendentes' | 'historico';

@Component({
  selector: 'app-gerente',
  standalone: true,
  imports: [CommonModule, RouterModule, PerfilModal],
  templateUrl: './gerente.html',
  styleUrl: './gerente.css',
})
export class Gerente implements OnInit {

  private usuarioService = inject(UsuarioService);
  protected authService = inject(AuthService);

  abaAtiva: Aba = 'pendentes';

  pendentes = signal<Usuario[]>([]);
  historico = signal<Usuario[]>([]);

  carregando = signal(true);
  processandoId = signal<number | null>(null);

  mensagem = signal('');
  mensagemTipo = signal<'sucesso' | 'rejeitado' | 'erro'>('sucesso');

  menuAberto = signal(false);
  perfilAberto = signal(false);

  ngOnInit(): void {
    this.carregarPendentes();
  }

  trocarAba(aba: Aba): void {
    this.abaAtiva = aba;
    this.mensagem.set('');

    if (aba === 'pendentes') {
      this.carregarPendentes();
    } else {
      this.carregarHistorico();
    }
  }

  private carregarPendentes(): void {
    this.carregando.set(true);
    this.usuarioService.listarPendentes().subscribe({
      next: (usuarios) => {
        this.pendentes.set(usuarios);
        this.carregando.set(false);
      },
      error: () => {
        this.mensagem.set('Erro ao carregar contas pendentes.');
        this.mensagemTipo.set('erro');
        this.carregando.set(false);
      },
    });
  }

  private carregarHistorico(): void {
    this.carregando.set(true);
    this.usuarioService.listarHistoricoAprovacao().subscribe({
      next: (usuarios) => {
        this.historico.set(usuarios);
        this.carregando.set(false);
      },
      error: () => {
        this.mensagem.set('Erro ao carregar histórico.');
        this.mensagemTipo.set('erro');
        this.carregando.set(false);
      },
    });
  }

  aprovar(usuario: Usuario): void {
    this.processandoId.set(usuario.id);
    this.mensagem.set('');

    this.usuarioService.aprovar(usuario.id).subscribe({
      next: () => {
        this.mensagem.set(`Conta de ${usuario.nome} aprovada com sucesso!`);
        this.mensagemTipo.set('sucesso');
        this.processandoId.set(null);
        this.pendentes.update(lista => lista.filter(u => u.id !== usuario.id));
      },
      error: (erro) => {
        this.mensagem.set(erro?.error?.mensagem ?? 'Erro ao aprovar a conta. Tente novamente.');
        this.mensagemTipo.set('erro');
        this.processandoId.set(null);
      },
    });
  }

  rejeitar(usuario: Usuario): void {
    this.processandoId.set(usuario.id);
    this.mensagem.set('');

    this.usuarioService.rejeitar(usuario.id).subscribe({
      next: () => {
        this.mensagem.set(`Conta de ${usuario.nome} rejeitada.`);
        this.mensagemTipo.set('rejeitado');
        this.processandoId.set(null);
        this.pendentes.update(lista => lista.filter(u => u.id !== usuario.id));
      },
      error: (erro) => {
        this.mensagem.set(erro?.error?.mensagem ?? 'Erro ao rejeitar a conta. Tente novamente.');
        this.mensagemTipo.set('erro');
        this.processandoId.set(null);
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

  onUsuarioAtualizado(usuario: Usuario): void {
    this.authService.atualizarUsuario(usuario);
  }

  @HostListener('document:click')
  fecharMenu(): void {
    this.menuAberto.set(false);
  }

  formatarData(data: string): string {
    if (!data) return '-';
    const [ano, mes, dia] = data.split('-').map(Number);
    return new Date(ano, mes - 1, dia).toLocaleDateString('pt-BR');
  }

  fotoUrl(caminho: string): string {
    return `http://localhost:8081/${caminho}`;
  }
}
