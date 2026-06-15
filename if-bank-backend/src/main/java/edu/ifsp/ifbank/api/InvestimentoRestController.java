package edu.ifsp.ifbank.api;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import edu.ifsp.ifbank.modelo.Investimento;
import edu.ifsp.ifbank.persistence.InvestimentoRepositorio;

@RestController
@RequestMapping(path = "/api/investimento", produces = "application/json")
public class InvestimentoRestController {

	@Autowired
	private InvestimentoRepositorio repo;

	@GetMapping
	public List<Investimento> getAll() {
		return repo.findAll();
	}

	@PostMapping(consumes = "application/json")
	@ResponseStatus(HttpStatus.CREATED)
	public Investimento save(@RequestBody Investimento invest) {
		return repo.save(invest);
	}

	@DeleteMapping("/{id}")
	public void delete(@PathVariable(name = "id") Long id) {
		repo.deleteById(id);
	}

	@GetMapping("/{id}")
	public ResponseEntity<Investimento> findById(@PathVariable(name = "id") Long id) {

		Optional<Investimento> opt = repo.findById(id);

		if (opt.isPresent()) {
			return ResponseEntity.ok(opt.get());
		}

		return ResponseEntity.notFound().build();
	}
	
}
