import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Investimento } from './investimento';

@Injectable({
  providedIn: 'root'
})
export class InvestimentoService {

  private readonly url = 'http://localhost:8081/api/investimento';

  private http = inject(HttpClient);

  getAll(): Observable<Investimento[]> {
        return this.http.get<Investimento[]>(this.url);
    }
  getByUsuario(id: number): Observable<Investimento[]> {
        return this.http.get<Investimento[]>(`${this.url}/usuario/${id}`);
    }

    buscarPorPeriodo(
        usuarioId: number,
        inicio: string,
        fim: string
    ) {
        return this.http.get<Investimento[]>(
            `${this.url}/usuario/${usuarioId}/periodo?inicio=${inicio}&fim=${fim}`
        );
    }

}