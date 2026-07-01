import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { Usuario } from './usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly STORAGE_KEY = 'usuario_logado';
  private readonly url = 'http://localhost:8081/api/usuario/login';

  private http = inject(HttpClient);
  private router = inject(Router);

  private usuarioSignal = signal<Usuario | null>(this.carregarDoStorage());

  readonly usuario = this.usuarioSignal.asReadonly();

  private carregarDoStorage(): Usuario | null {
    try {
      const json = localStorage.getItem(this.STORAGE_KEY);
      return json ? JSON.parse(json) : null;
    } catch {
      return null;
    }
  }

  login(email: string, senha: string): Observable<Usuario> {
    return this.http.post<Usuario>(this.url, { email, senha }).pipe(
      tap(usuario => {
        this.usuarioSignal.set(usuario);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(usuario));
      })
    );
  }

  atualizarUsuario(usuario: Usuario): void {
    this.usuarioSignal.set(usuario);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(usuario));
  }

  logout(): void {
    this.usuarioSignal.set(null);
    localStorage.removeItem(this.STORAGE_KEY);
    this.router.navigate(['/login']);
  }

  isLogado(): boolean {
    return this.usuarioSignal() !== null;
  }

  getUsuario(): Usuario | null {
    return this.usuarioSignal();
  }
}
