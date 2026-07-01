import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {

  private authService = inject(AuthService);
  private router = inject(Router);

  form = { email: '', senha: '' };
  mensagem = signal('');
  carregando = signal(false);

  ngOnInit(): void {
    if (this.authService.isLogado()) {
      const usuario = this.authService.getUsuario();
      this.router.navigate([usuario?.perfil === 'GERENTE' ? '/gerente' : '/dashboard']);
    }
  }

  entrar(): void {
    this.mensagem.set('');

    if (!this.form.email || !this.form.senha) {
      this.mensagem.set('Preencha email e senha.');
      return;
    }

    this.carregando.set(true);

    this.authService.login(this.form.email, this.form.senha).subscribe({
      next: (usuario) => {
        this.router.navigate([usuario?.perfil === 'GERENTE' ? '/gerente' : '/dashboard']);
      },
      error: (erro) => {
        this.mensagem.set(erro?.error?.mensagem ?? 'Email ou senha inválidos.');
        this.carregando.set(false);
      },
    });
  }
}
