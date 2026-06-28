import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { UsuarioService } from '../../usuario-service';

@Component({
  selector: 'app-abrir-conta',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './abrir-conta.html',
  styleUrl: './abrir-conta.css',
})
export class AbrirConta {

  private usuarioService = inject(UsuarioService);
  private router = inject(Router);

  form = {
    nome: '',
    cpf: '',
    dataNascimento: '',
    endereco: '',
    telefone: '',
    email: '',
    senha: '',
    confirmarSenha: '',
  };

  fotoSelecionada: File | null = null;
  previewFoto: string | null = null;

  mensagem = '';
  mensagemErro = false;
  enviando = false;

  /** Captura o arquivo de foto escolhido e gera uma pré-visualização. */
  onFotoSelecionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    const arquivo = input.files?.[0] ?? null;

    this.fotoSelecionada = arquivo;
    this.previewFoto = null;

    if (arquivo) {
      const leitor = new FileReader();
      leitor.onload = () => (this.previewFoto = leitor.result as string);
      leitor.readAsDataURL(arquivo);
    }
  }

  /** Mantém apenas dígitos no campo de CPF, já que o backend espera só números. */
  onCpfInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.form.cpf = input.value.replace(/\D/g, '').slice(0, 11);
  }

  cadastrar(): void {
    this.mensagem = '';
    this.mensagemErro = false;

    if (!this.validarFormulario()) {
      return;
    }

    this.enviando = true;

    const { confirmarSenha, ...dados } = this.form;

    this.usuarioService.cadastrar(dados, this.fotoSelecionada!).subscribe({
      next: () => {
        this.mensagem =
          'Conta criada com sucesso! Sua abertura de conta está pendente de aprovação pelo gerente. Você poderá fazer login após a aprovação.';
        this.mensagemErro = false;
        this.enviando = false;
        this.limparFormulario();

        setTimeout(() => this.router.navigate(['/login']), 4000);
      },
      error: (erro) => {
        this.mensagem =
          erro?.error?.mensagem ?? 'Erro ao abrir a conta. Verifique os dados e tente novamente.';
        this.mensagemErro = true;
        this.enviando = false;
      },
    });
  }

  private validarFormulario(): boolean {
    const { nome, cpf, dataNascimento, endereco, telefone, email, senha, confirmarSenha } = this.form;

    if (!nome || !cpf || !dataNascimento || !endereco || !telefone || !email || !senha) {
      this.mensagem = 'Preencha todos os campos antes de enviar.';
      this.mensagemErro = true;
      return false;
    }

    if (cpf.length !== 11) {
      this.mensagem = 'O CPF deve conter exatamente 11 números.';
      this.mensagemErro = true;
      return false;
    }

    if (senha.length < 6) {
      this.mensagem = 'A senha deve ter no mínimo 6 caracteres.';
      this.mensagemErro = true;
      return false;
    }

    if (senha !== confirmarSenha) {
      this.mensagem = 'As senhas não coincidem.';
      this.mensagemErro = true;
      return false;
    }

    if (!this.fotoSelecionada) {
      this.mensagem = 'É necessário enviar uma foto para concluir o cadastro.';
      this.mensagemErro = true;
      return false;
    }

    return true;
  }

  private limparFormulario(): void {
    this.form = {
      nome: '',
      cpf: '',
      dataNascimento: '',
      endereco: '',
      telefone: '',
      email: '',
      senha: '',
      confirmarSenha: '',
    };
    this.fotoSelecionada = null;
    this.previewFoto = null;
  }
}
