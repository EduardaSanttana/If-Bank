package edu.ifsp.ifbank.persistence;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.ifsp.ifbank.modelo.Usuario;
import edu.ifsp.ifbank.modelo.enums.StatusUsuario;

public interface UsuarioRepositorio extends JpaRepository<Usuario,Long> {

	Optional<Usuario> findByEmail(String email);

	Optional<Usuario> findByCpf(String cpf);

	List<Usuario> findByStatus(StatusUsuario status);

	List<Usuario> findByStatusIn(List<StatusUsuario> status);

}

