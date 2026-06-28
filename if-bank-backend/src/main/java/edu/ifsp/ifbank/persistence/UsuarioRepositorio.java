package edu.ifsp.ifbank.persistence;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.ifsp.ifbank.modelo.Usuario;

public interface UsuarioRepositorio extends JpaRepository<Usuario,Long> {

	Optional<Usuario> findByEmail(String email);

}

