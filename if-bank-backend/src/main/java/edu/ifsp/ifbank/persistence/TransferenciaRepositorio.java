package edu.ifsp.ifbank.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.ifsp.ifbank.modelo.Transferencia;

public interface TransferenciaRepositorio extends JpaRepository<Transferencia, Long> {
	
}
