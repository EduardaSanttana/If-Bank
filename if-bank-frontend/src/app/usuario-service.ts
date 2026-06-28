import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Usuario } from './usuario';

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
}