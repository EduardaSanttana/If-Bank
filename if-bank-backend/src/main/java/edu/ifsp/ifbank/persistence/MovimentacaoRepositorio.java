package edu.ifsp.ifbank.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.ifsp.ifbank.modelo.Movimentacao;

public interface MovimentacaoRepositorio extends JpaRepository<Movimentacao, Long> {
	
}
