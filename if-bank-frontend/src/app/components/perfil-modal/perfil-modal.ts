import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Usuario } from '../../usuario';
import { UsuarioService } from '../../usuario-service';

@Component({
  selector: 'app-perfil-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil-modal.html',
  styleUrl: './perfil-modal.css'
})
export class PerfilModal {

  @Input() usuario: Usuario | null = null;
  @Output() fechar = new EventEmitter<void>();
  @Output() usuarioAtualizado = new EventEmitter<Usuario>();

  private usuarioService = inject(UsuarioService);

  editando = signal(false);
  salvando = signal(false);
  mensagemErro = signal('');

  form = { nome: '', endereco: '', telefone: '', email: '' };

  fecharModal(): void {
    this.editando.set(false);
    this.mensagemErro.set('');
    this.fechar.emit();
  }

  getFotoPerfil(): string {

    if (!this.usuario?.foto) {
      return '';
    }

    return `http://localhost:8081/${this.usuario.foto}`;

  }

  abrirEdicao(): void {

    if (!this.usuario) {
      return;
    }

    this.form = {
      nome: this.usuario.nome,
      endereco: this.usuario.endereco,
      telefone: this.usuario.telefone,
      email: this.usuario.email
    };

    this.mensagemErro.set('');
    this.editando.set(true);

  }

  cancelarEdicao(): void {
    this.editando.set(false);
    this.mensagemErro.set('');
  }

  salvarEdicao(): void {

    if (!this.usuario) {
      return;
    }

    this.mensagemErro.set('');
    this.salvando.set(true);

    this.usuarioService.atualizar(this.usuario.id, this.form).subscribe({
      next: (usuarioAtualizado) => {
        this.salvando.set(false);
        this.editando.set(false);
        this.usuarioAtualizado.emit(usuarioAtualizado);
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
