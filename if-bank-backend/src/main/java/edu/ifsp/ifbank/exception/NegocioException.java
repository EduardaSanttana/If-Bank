package edu.ifsp.ifbank.exception;

/**
 * Exception lançada quando uma regra de negocio é violada
 * (ex.: CPF ja cadastrado, saldo insuficiente, etc).
 * É traduzida para HTTP 400 pelo GlobalExceptionHandler.
 */
public class NegocioException extends RuntimeException {

    public NegocioException(String mensagem) {
        super(mensagem);
    }
}
