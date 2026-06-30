package edu.ifsp.ifbank.persistence;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.ifsp.ifbank.modelo.Investimento;

public interface InvestimentoRepositorio extends JpaRepository<Investimento, Long> {
	
	List<Investimento> findByUsuarioId(Long usuarioId);
	
	List<Investimento> findByUsuarioIdAndDataAplicacaoBetween(
	        Long usuarioId,
	        LocalDateTime inicio,
	        LocalDateTime fim
	);
}


