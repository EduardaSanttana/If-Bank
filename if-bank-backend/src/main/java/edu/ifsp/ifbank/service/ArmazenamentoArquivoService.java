package edu.ifsp.ifbank.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import edu.ifsp.ifbank.exception.NegocioException;

/**
 * Responsavel por persistir arquivos enviados pelo usuario (ex.: foto de
 * cadastro) na pasta configurada em app.upload.dir, retornando o caminho
 * relativo a ser salvo no banco.
 */
@Service
public class ArmazenamentoArquivoService {

    private static final long TAMANHO_MAXIMO_BYTES = 5L * 1024 * 1024; // 5MB

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    public String salvarFoto(MultipartFile foto) {
        if (foto == null || foto.isEmpty()) {
            throw new NegocioException("É necessário enviar uma foto para concluir o cadastro.");
        }

        if (foto.getSize() > TAMANHO_MAXIMO_BYTES) {
            throw new NegocioException("A foto deve ter no máximo 5MB.");
        }

        String contentType = foto.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new NegocioException("O arquivo enviado deve ser uma imagem.");
        }

        try {
            Path pastaDestino = Path.of(uploadDir);
            Files.createDirectories(pastaDestino);

            String extensao = extrairExtensao(foto.getOriginalFilename());
            String nomeArquivo = UUID.randomUUID() + extensao;

            Path destino = pastaDestino.resolve(nomeArquivo);
            foto.transferTo(destino);

            return "uploads/" + nomeArquivo;
        } catch (IOException e) {
            throw new NegocioException("Falha ao salvar a foto enviada. Tente novamente.");
        }
    }

    private String extrairExtensao(String nomeOriginal) {
        if (nomeOriginal == null || !nomeOriginal.contains(".")) {
            return "";
        }
        return nomeOriginal.substring(nomeOriginal.lastIndexOf('.'));
    }
}
