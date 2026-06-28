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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import edu.ifsp.ifbank.modelo.Conta;
import edu.ifsp.ifbank.persistence.ContaRepositorio;

@RestController
@RequestMapping(path = "/api/conta", produces = "application/json")
public class ContaRestController {

	@Autowired
	private ContaRepositorio repo;

	@GetMapping
	public List<Conta> getAll() {
		return repo.findAll();
	}

	@PostMapping(consumes = "application/json")
	@ResponseStatus(HttpStatus.CREATED)
	public Conta save(@RequestBody Conta conta) {
		return repo.save(conta);
	}

	@DeleteMapping("/{id}")
	public void delete(@PathVariable(name = "id") Long id) {
		repo.deleteById(id);
	}

	@GetMapping("/{id}")
	public ResponseEntity<Conta> findById(@PathVariable(name = "id") Long id) {

		Optional<Conta> opt = repo.findById(id);

		if (opt.isPresent()) {
			return ResponseEntity.ok(opt.get());
		}

		return ResponseEntity.notFound().build();
	}
	
	// atualizar conta
	@PutMapping("/{id}")
	public ResponseEntity<Conta> update(
	        @PathVariable Long id,
	        @RequestBody Conta conta) {

	    Optional<Conta> opt = repo.findById(id);

	    if(opt.isEmpty()) {
	        return ResponseEntity.notFound().build();
	    }

	    conta.setId(id);

	    return ResponseEntity.ok(repo.save(conta));
	}
}
