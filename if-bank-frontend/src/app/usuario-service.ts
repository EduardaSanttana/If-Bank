import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Usuario } from './usuario';
import { CadastroUsuario } from './cadastro-usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private readonly url =
    'http://localhost:8081/api/usuario';

  private http = inject(HttpClient);

  getAll(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.url);
  }

  getById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.url}/${id}`);
  }

  cadastrar(dados: CadastroUsuario, foto: File): Observable<Usuario> {
    const formData = new FormData();

    formData.append('nome', dados.nome);
    formData.append('cpf', dados.cpf);
    formData.append('dataNascimento', dados.dataNascimento);
    formData.append('endereco', dados.endereco);
    formData.append('telefone', dados.telefone);
    formData.append('email', dados.email);
    formData.append('senha', dados.senha);
    formData.append('foto', foto);

    return this.http.post<Usuario>(`${this.url}/cadastro`, formData);
  }

  listarPendentes(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.url}/pendentes`);
  }

  listarHistoricoAprovacao(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.url}/historico-aprovacao`);
  }

  aprovar(id: number): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.url}/${id}/aprovar`, {});
  }

  rejeitar(id: number): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.url}/${id}/rejeitar`, {});
  }
}
