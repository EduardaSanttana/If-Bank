import { Component, inject, OnInit } from '@angular/core';
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

  usuario: Usuario | null = null;
  contas: Conta[] = [];
  transferencias: Transferencia[] = [];
  carregando = true;

  form = {
    numeroContaOrigem: '',
    numeroContaDestino: '',
    valor: null as number | null,
  };

  mensagem = '';
  mensagemErro = false;
  enviando = false;

  ngOnInit(): void {
    const usuarioAuth = this.authService.getUsuario();
    if (!usuarioAuth) {
      this.carregando = false;
      return;
    }

    this.usuarioService.getById(usuarioAuth.id).subscribe(usuario => {
      this.usuario = usuario;
      this.form.numeroContaOrigem = usuario.conta?.numeroConta ?? '';
      this.carregarTransferencias();
    });

    this.contaService.getAll().subscribe(contas => this.contas = contas);
  }

  private carregarTransferencias(): void {
    this.carregando = true;
    this.transferenciaService.getAll().subscribe(transferencias => {
      const contaId = this.usuario?.conta?.id;
      this.transferencias = contaId
        ? transferencias.filter(t =>
            t.contaOrigem.id === contaId || t.contaDestino.id === contaId
          )
        : transferencias;
      this.carregando = false;
    });
  }

  enviar(): void {
    this.mensagem = '';

    if (!this.form.numeroContaOrigem || !this.form.numeroContaDestino || !this.form.valor) {
      this.mensagem = 'Preencha todos os campos antes de enviar.';
      this.mensagemErro = true;
      return;
    }

    if (this.form.valor <= 0) {
      this.mensagem = 'O valor deve ser maior que zero.';
      this.mensagemErro = true;
      return;
    }

    if (this.form.numeroContaOrigem === this.form.numeroContaDestino) {
      this.mensagem = 'A conta de origem e destino não podem ser iguais.';
      this.mensagemErro = true;
      return;
    }

    const contaOrigem = this.contas.find(c => c.numeroConta === this.form.numeroContaOrigem);
    const contaDestino = this.contas.find(c => c.numeroConta === this.form.numeroContaDestino);

    if (!contaOrigem) {
      this.mensagem = `Conta de origem "${this.form.numeroContaOrigem}" não encontrada.`;
      this.mensagemErro = true;
      return;
    }

    if (!contaDestino) {
      this.mensagem = `Conta de destino "${this.form.numeroContaDestino}" não encontrada.`;
      this.mensagemErro = true;
      return;
    }

    this.enviando = true;

    const payload: Transferencia = {
      contaOrigem: { id: contaOrigem.id },
      contaDestino: { id: contaDestino.id },
      valor: this.form.valor,
      dataTransferencia: new Date().toISOString().slice(0, 19),
    };

    this.transferenciaService.create(payload).subscribe({
      next: () => {
        this.mensagem = 'Transferência realizada com sucesso!';
        this.mensagemErro = false;
        this.enviando = false;
        this.form.numeroContaDestino = '';
        this.form.valor = null;
        this.carregarTransferencias();
      },
      error: () => {
        this.mensagem = 'Erro ao realizar transferência. Verifique se a conta destino existe e há saldo suficiente.';
        this.mensagemErro = true;
        this.enviando = false;
      },
    });
  }

  formatarValor(valor: number): string {
    return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  formatarData(data: string): string {
    return new Date(data).toLocaleString('pt-BR');
  }
}
