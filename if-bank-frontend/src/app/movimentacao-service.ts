import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Movimentacao } from './movimentacao';

@Injectable({
  providedIn: 'root'
})
export class MovimentacaoService {

  private readonly url = 'http://localhost:8081/api/movimentacao';

  private http = inject(HttpClient);

  getAll(): Observable<Movimentacao[]> {
    return this.http.get<Movimentacao[]>(this.url);
  }
}
