package edu.ifsp.ifbank.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.ifsp.ifbank.modelo.Usuario;

public interface UsuarioRepositorio extends JpaRepository<Usuario, Integer> {
	
}

