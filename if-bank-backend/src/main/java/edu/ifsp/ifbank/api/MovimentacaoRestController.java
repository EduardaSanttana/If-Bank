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

import edu.ifsp.ifbank.modelo.Movimentacao;
import edu.ifsp.ifbank.persistence.MovimentacaoRepositorio;

@RestController
@RequestMapping(path = "/api/movimentacao", produces = "application/json")
public class MovimentacaoRestController {

	@Autowired
	private MovimentacaoRepositorio repo;

	@GetMapping
	public List<Movimentacao> getAll() {
		return repo.findAll();
	}

	@PostMapping(consumes = "application/json")
	@ResponseStatus(HttpStatus.CREATED)
	public Movimentacao save(@RequestBody Movimentacao movi) {
		return repo.save(movi);
	}

	@DeleteMapping("/{id}")
	public void delete(@PathVariable(name = "id") Long id) {
		repo.deleteById(id);
	}

	@GetMapping("/{id}")
	public ResponseEntity<Movimentacao> findById(@PathVariable(name = "id") Long id) {

		Optional<Movimentacao> opt = repo.findById(id);

		if (opt.isPresent()) {
			return ResponseEntity.ok(opt.get());
		}

		return ResponseEntity.notFound().build();
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<Movimentacao> update(@PathVariable Long id, @RequestBody Movimentacao movi) {

	    Optional<Movimentacao> opt = repo.findById(id);

	    if(opt.isEmpty()) {
	        return ResponseEntity.notFound().build();
	    }

	    movi.setId(id);

	    return ResponseEntity.ok(repo.save(movi));
	}
}
