package edu.ifsp.ifbank.api;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import edu.ifsp.ifbank.exception.NegocioException;
import edu.ifsp.ifbank.modelo.Conta;
import edu.ifsp.ifbank.modelo.Movimentacao;
import edu.ifsp.ifbank.modelo.Transferencia;
import edu.ifsp.ifbank.modelo.enums.TipoMovimentacao;
import edu.ifsp.ifbank.persistence.ContaRepositorio;
import edu.ifsp.ifbank.persistence.MovimentacaoRepositorio;
import edu.ifsp.ifbank.persistence.TransferenciaRepositorio;

@RestController
@RequestMapping(path = "/api/transferencia", produces = "application/json")
public class TransferenciaRestController {

	@Autowired
	private TransferenciaRepositorio repo;

	@Autowired
	private ContaRepositorio contaRepo;

	@Autowired
	private MovimentacaoRepositorio movimentacaoRepo;

	@GetMapping
	public List<Transferencia> getAll() {
		return repo.findAll();
	}

	@PostMapping(consumes = "application/json")
	@ResponseStatus(HttpStatus.CREATED)
	@Transactional
	public Transferencia save(@RequestBody Transferencia transferencia) {
		Conta contaOrigem = contaRepo.findById(transferencia.getContaOrigem().getId())
				.orElseThrow(() -> new NegocioException("Conta de origem não encontrada."));

		Conta contaDestino = contaRepo.findById(transferencia.getContaDestino().getId())
				.orElseThrow(() -> new NegocioException("Conta de destino não encontrada."));

		if (contaOrigem.getSaldo().compareTo(transferencia.getValor()) < 0) {
			throw new NegocioException("Saldo insuficiente para realizar a transferência.");
		}

		contaOrigem.setSaldo(contaOrigem.getSaldo().subtract(transferencia.getValor()));
		contaDestino.setSaldo(contaDestino.getSaldo().add(transferencia.getValor()));
		contaRepo.save(contaOrigem);
		contaRepo.save(contaDestino);

		Movimentacao movEnviada = new Movimentacao();
		movEnviada.setConta(contaOrigem);
		movEnviada.setTipo(TipoMovimentacao.TRANSFERENCIA_ENVIADA);
		movEnviada.setValor(transferencia.getValor());
		movEnviada.setDescricao("Transferência para " + contaDestino.getNumeroConta());
		movEnviada.setDataMovimentacao(LocalDateTime.now());
		movimentacaoRepo.save(movEnviada);

		Movimentacao movRecebida = new Movimentacao();
		movRecebida.setConta(contaDestino);
		movRecebida.setTipo(TipoMovimentacao.TRANSFERENCIA_RECEBIDA);
		movRecebida.setValor(transferencia.getValor());
		movRecebida.setDescricao("Transferência de " + contaOrigem.getNumeroConta());
		movRecebida.setDataMovimentacao(LocalDateTime.now());
		movimentacaoRepo.save(movRecebida);

		transferencia.setContaOrigem(contaOrigem);
		transferencia.setContaDestino(contaDestino);

		return repo.save(transferencia);
	}

	@DeleteMapping("/{id}")
	public void delete(@PathVariable(name = "id") Long id) {
		repo.deleteById(id);
	}

	@GetMapping("/{id}")
	public ResponseEntity<Transferencia> findById(@PathVariable(name = "id") Long id) {
		Optional<Transferencia> opt = repo.findById(id);
		if (opt.isPresent()) {
			return ResponseEntity.ok(opt.get());
		}
		return ResponseEntity.notFound().build();
	}

	@PutMapping("/{id}")
	public ResponseEntity<Transferencia> update(@PathVariable Long id, @RequestBody Transferencia transferencia) {
		Optional<Transferencia> opt = repo.findById(id);
		if (opt.isEmpty()) {
			return ResponseEntity.notFound().build();
		}
		transferencia.setId(id);
		return ResponseEntity.ok(repo.save(transferencia));
	}
}
