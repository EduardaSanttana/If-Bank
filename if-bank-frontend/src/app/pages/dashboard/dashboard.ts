import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { Usuario } from '../../usuario';
import { UsuarioService } from '../../usuario-service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  private usuarioService = inject(UsuarioService);

  protected usuarios$: Observable<Usuario[]>;

  usuarioLogado: Usuario = {
    id: 1,
    nome: 'Luana Melissa',
    cpf: '000.000.000-00',
    dataNascimento: '2000-01-01',
    endereco: 'Rua Exemplo, 123',
    telefone: '(11) 99999-9999',
    email: 'luana@email.com',
    senha: '123456',
    foto: '',
    perfil: 'Cliente',
    status: 'Ativo'
  };

  constructor() {
    this.usuarios$ = this.usuarioService.getAll();
  }
}