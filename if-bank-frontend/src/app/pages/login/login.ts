import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {

  private authService = inject(AuthService);
  private router = inject(Router);

  form = { email: '', senha: '' };
  mensagem = '';
  carregando = false;

  ngOnInit(): void {
    if (this.authService.isLogado()) {
      this.router.navigate(['/dashboard']);
    }
  }

  entrar(): void {
    this.mensagem = '';

    if (!this.form.email || !this.form.senha) {
      this.mensagem = 'Preencha email e senha.';
      return;
    }

    this.carregando = true;

    this.authService.login(this.form.email, this.form.senha).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => {
        this.mensagem = 'Email ou senha inválidos.';
        this.carregando = false;
      },
    });
  }
}
