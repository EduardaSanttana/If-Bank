package edu.ifsp.ifbank.service;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import edu.ifsp.ifbank.api.dto.CadastroUsuarioRequest;
import edu.ifsp.ifbank.exception.NegocioException;
import edu.ifsp.ifbank.modelo.Conta;
import edu.ifsp.ifbank.modelo.Usuario;
import edu.ifsp.ifbank.modelo.enums.PerfilUsuario;
import edu.ifsp.ifbank.modelo.enums.StatusUsuario;
import edu.ifsp.ifbank.persistence.ContaRepositorio;
import edu.ifsp.ifbank.persistence.UsuarioRepositorio;

/**
 * Regras de negocio da abertura de conta (requisito 1):
 * - valida duplicidade de CPF e e-mail
 * - salva a foto enviada
 * - cria o usuario com status PENDENTE (aguardando aprovacao do gerente)
 * - cria a conta vinculada, com saldo zero e numero gerado automaticamente
 */
@Service
public class AbrirContaService {

    private final UsuarioRepositorio usuarioRepositorio;
    private final ContaRepositorio contaRepositorio;
    private final ArmazenamentoArquivoService armazenamentoArquivoService;

    public AbrirContaService(UsuarioRepositorio usuarioRepositorio,
                              ContaRepositorio contaRepositorio,
                              ArmazenamentoArquivoService armazenamentoArquivoService) {
        this.usuarioRepositorio = usuarioRepositorio;
        this.contaRepositorio = contaRepositorio;
        this.armazenamentoArquivoService = armazenamentoArquivoService;
    }

    @Transactional
    public Usuario abrirConta(CadastroUsuarioRequest dados, MultipartFile foto) {

        String cpfSomenteNumeros = dados.getCpf().replaceAll("\\D", "");

        if (usuarioRepositorio.findByCpf(cpfSomenteNumeros).isPresent()) {
            throw new NegocioException("Já existe uma conta cadastrada com este CPF.");
        }

        if (usuarioRepositorio.findByEmail(dados.getEmail()).isPresent()) {
            throw new NegocioException("Já existe uma conta cadastrada com este e-mail.");
        }

        // Salva a foto antes de persistir, para nao deixar usuario "orfao" se a foto falhar
        String caminhoFoto = armazenamentoArquivoService.salvarFoto(foto);

        Usuario usuario = new Usuario();
        usuario.setNome(dados.getNome().trim());
        usuario.setCpf(cpfSomenteNumeros);
        usuario.setDataNascimento(dados.getDataNascimento());
        usuario.setEndereco(dados.getEndereco().trim());
        usuario.setTelefone(dados.getTelefone().trim());
        usuario.setEmail(dados.getEmail().trim().toLowerCase());
        usuario.setSenha(dados.getSenha());
        usuario.setFoto(caminhoFoto);
        usuario.setPerfil(PerfilUsuario.CLIENTE);
        usuario.setStatus(StatusUsuario.PENDENTE);

        Usuario usuarioSalvo = usuarioRepositorio.save(usuario);

        Conta conta = new Conta();
        conta.setNumeroConta(gerarNumeroConta());
        conta.setSaldo(BigDecimal.ZERO);
        conta.setUsuario(usuarioSalvo);
        contaRepositorio.save(conta);

        usuarioSalvo.setConta(conta);
        return usuarioSalvo;
    }

    private String gerarNumeroConta() {
        long proximoId = contaRepositorio.count() + 1;
        String numero = String.format("IF%06d", proximoId);

        while (contaRepositorio.existsByNumeroConta(numero)) {
            proximoId++;
            numero = String.format("IF%06d", proximoId);
        }

        return numero;
    }
}
