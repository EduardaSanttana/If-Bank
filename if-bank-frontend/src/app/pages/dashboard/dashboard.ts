import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { Usuario } from '../../usuario';
import { UsuarioService } from '../../usuario-service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  private usuarioService = inject(UsuarioService);

  protected usuarios$: Observable<Usuario[]>;

  constructor() {
    this.usuarios$ = this.usuarioService.getAll();
  }
}