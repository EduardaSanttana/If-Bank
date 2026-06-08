package edu.ifsp.ifbank.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.ifsp.ifbank.modelo.Investimento;

public interface InvestimentoRepositorio extends JpaRepository<Investimento, Integer> {
	
}


