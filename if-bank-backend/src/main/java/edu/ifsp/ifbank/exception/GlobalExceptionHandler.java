package edu.ifsp.ifbank.exception;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Centraliza o tratamento de erros da API, garantindo que toda resposta de
 * erro tenha o formato { "mensagem": "..." }, usado pelo frontend para
 * exibir feedback ao usuario.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NegocioException.class)
    public ResponseEntity<Map<String, String>> handleNegocio(NegocioException ex) {
        return ResponseEntity.badRequest().body(corpoErro(ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidacao(MethodArgumentNotValidException ex) {
        Map<String, String> erros = new LinkedHashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(erro ->
            erros.put(erro.getField(), erro.getDefaultMessage())
        );

        String mensagem = erros.isEmpty()
                ? "Dados invalidos."
                : String.join("; ", erros.values());

        Map<String, String> corpo = corpoErro(mensagem);
        corpo.put("campos", erros.toString());

        return ResponseEntity.badRequest().body(corpo);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGenerico(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(corpoErro("Ocorreu um erro inesperado. Tente novamente."));
    }

    private Map<String, String> corpoErro(String mensagem) {
        Map<String, String> corpo = new HashMap<>();
        corpo.put("mensagem", mensagem);
        return corpo;
    }
}
