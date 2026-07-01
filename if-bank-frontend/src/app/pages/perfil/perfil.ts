import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { Usuario } from '../../usuario';
import { UsuarioService } from '../../usuario-service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class Perfil implements OnInit {

  private usuarioService = inject(UsuarioService);
  protected authService = inject(AuthService);

  usuario = signal<Usuario | null>(null);
  menuAberto = signal(false);

  editando = signal(false);
  salvando = signal(false);
  mensagemErro = signal('');

  form = { nome: '', endereco: '', telefone: '', email: '' };

  ngOnInit(): void {

    const usuarioAuth = this.authService.getUsuario();

    if (!usuarioAuth) {
      return;
    }

    this.usuarioService.getById(usuarioAuth.id)
      .subscribe(usuario => {

        this.usuario.set(usuario);

      });

  }

  toggleMenu(event: Event): void {
    event.stopPropagation();
    this.menuAberto.set(!this.menuAberto());
  }

  @HostListener('document:click')
  fecharMenu(): void {
    this.menuAberto.set(false);
  }

  abrirEdicao(): void {

    const usuario = this.usuario();

    if (!usuario) {
      return;
    }

    this.form = {
      nome: usuario.nome,
      endereco: usuario.endereco,
      telefone: usuario.telefone,
      email: usuario.email
    };

    this.mensagemErro.set('');
    this.editando.set(true);

  }

  cancelarEdicao(): void {
    this.editando.set(false);
    this.mensagemErro.set('');
  }

  salvarEdicao(): void {

    const usuario = this.usuario();

    if (!usuario) {
      return;
    }

    this.mensagemErro.set('');
    this.salvando.set(true);

    this.usuarioService.atualizar(usuario.id, this.form).subscribe({
      next: (usuarioAtualizado) => {
        this.usuario.set(usuarioAtualizado);
        this.authService.atualizarUsuario(usuarioAtualizado);
        this.salvando.set(false);
        this.editando.set(false);
      },
      error: (erro) => {
        this.mensagemErro.set(erro?.error?.mensagem ?? 'Não foi possível atualizar o perfil.');
        this.salvando.set(false);
      }
    });

  }

  formatarValor(valor: number): string {

    return valor.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

  }

}
