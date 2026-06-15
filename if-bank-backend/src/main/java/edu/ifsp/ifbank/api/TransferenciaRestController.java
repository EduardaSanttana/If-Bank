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

import edu.ifsp.ifbank.modelo.Transferencia;
import edu.ifsp.ifbank.persistence.TransferenciaRepositorio;

@RestController
@RequestMapping(path = "/api/transferencia", produces = "application/json")
public class TransferenciaRestController {

	@Autowired
	private TransferenciaRepositorio repo;

	@GetMapping
	public List<Transferencia> getAll() {
		return repo.findAll();
	}

	@PostMapping(consumes = "application/json")
	@ResponseStatus(HttpStatus.CREATED)
	public Transferencia save(@RequestBody Transferencia transferencia) {
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
	public ResponseEntity<Transferencia> update(@PathVariable Long id,@RequestBody Transferencia transferencia) {

	    Optional<Transferencia> opt = repo.findById(id);

	    if(opt.isEmpty()) {
	        return ResponseEntity.notFound().build();
	    }

	    transferencia.setId(id);

	    return ResponseEntity.ok(repo.save(transferencia));
	}
}
