package edu.ifsp.ifbank.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.ifsp.ifbank.modelo.Conta;

public interface ContaRepositorio extends JpaRepository<Conta, Long> {

	boolean existsByNumeroConta(String numeroConta);

}
