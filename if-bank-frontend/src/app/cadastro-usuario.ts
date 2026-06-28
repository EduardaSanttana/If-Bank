/**
 * Dados do formulario de abertura de conta (requisito 1).
 * Espelha o CadastroUsuarioRequest do backend.
 */
export interface CadastroUsuario {
  nome: string;
  cpf: string;
  dataNascimento: string; // formato yyyy-MM-dd
  endereco: string;
  telefone: string;
  email: string;
  senha: string;
}
