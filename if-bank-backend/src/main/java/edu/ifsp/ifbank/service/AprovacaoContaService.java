package edu.ifsp.ifbank.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.ifsp.ifbank.exception.NegocioException;
import edu.ifsp.ifbank.modelo.Usuario;
import edu.ifsp.ifbank.modelo.enums.StatusUsuario;
import edu.ifsp.ifbank.persistence.UsuarioRepositorio;

@Service
public class AprovacaoContaService {

    private final UsuarioRepositorio usuarioRepositorio;

    public AprovacaoContaService(UsuarioRepositorio usuarioRepositorio) {
        this.usuarioRepositorio = usuarioRepositorio;
    }

    public List<Usuario> listarPendentes() {
        return usuarioRepositorio.findByStatus(StatusUsuario.PENDENTE);
    }

    public List<Usuario> listarHistorico() {
        return usuarioRepositorio.findByStatusIn(
                List.of(StatusUsuario.APROVADO, StatusUsuario.REJEITADO));
    }

    @Transactional
    public Usuario aprovar(Long usuarioId) {
        Usuario usuario = buscarPendente(usuarioId);
        usuario.setStatus(StatusUsuario.APROVADO);
        return usuarioRepositorio.save(usuario);
    }

    @Transactional
    public Usuario rejeitar(Long usuarioId) {
        Usuario usuario = buscarPendente(usuarioId);
        usuario.setStatus(StatusUsuario.REJEITADO);
        return usuarioRepositorio.save(usuario);
    }

    private Usuario buscarPendente(Long usuarioId) {
        Usuario usuario = usuarioRepositorio.findById(usuarioId)
                .orElseThrow(() -> new NegocioException("Usuário não encontrado."));

        if (usuario.getStatus() != StatusUsuario.PENDENTE) {
            throw new NegocioException("Esta conta já foi analisada anteriormente.");
        }

        return usuario;
    }
}
