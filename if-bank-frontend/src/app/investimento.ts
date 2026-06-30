import { Usuario } from "./usuario";

export interface Investimento {

  id?: number;

  tipo: string;

  valorAplicado: number;

  rendimento: number;

  dataAplicacao: string;

  usuario: Usuario;

}