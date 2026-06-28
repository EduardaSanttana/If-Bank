package edu.ifsp.ifbank.api;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import edu.ifsp.ifbank.api.dto.CadastroUsuarioRequest;
import edu.ifsp.ifbank.exception.NegocioException;
import edu.ifsp.ifbank.modelo.Usuario;
import edu.ifsp.ifbank.modelo.enums.StatusUsuario;
import edu.ifsp.ifbank.persistence.UsuarioRepositorio;
import edu.ifsp.ifbank.service.AbrirContaService;
import edu.ifsp.ifbank.service.AprovacaoContaService;
import jakarta.validation.Valid;

@RestController
@RequestMapping(path = "/api/usuario", produces = "application/json")
@Validated
public class UsuarioRestController {

	@Autowired
	private UsuarioRepositorio repo;

	@Autowired
	private AbrirContaService abrirContaService;

	@Autowired
	private AprovacaoContaService aprovacaoContaService;

	@GetMapping
	public List<Usuario> getAll() {
		return repo.findAll();
	}

	@PostMapping(consumes = "application/json")
	@ResponseStatus(HttpStatus.CREATED)
	public Usuario save(@RequestBody Usuario usuario) {
		return repo.save(usuario);
	}

	/**
	 * Abertura de conta (requisito 1): cadastro de dados pessoais + foto.
	 * A conta criada nasce com status PENDENTE, aguardando aprovacao do gerente.
	 */
	@PostMapping(path = "/cadastro", consumes = "multipart/form-data")
	@ResponseStatus(HttpStatus.CREATED)
	public Usuario abrirConta(@Valid @ModelAttribute CadastroUsuarioRequest dados,
							   @RequestParam("foto") MultipartFile foto) {
		return abrirContaService.abrirConta(dados, foto);
	}

	/**
	 * Aprovacao de abertura de contas (requisito 6), acessivel somente ao
	 * perfil GERENTE. A restricao de perfil deve ser validada no frontend
	 * (rota protegida) e idealmente tambem aqui caso seja adicionada
	 * autenticacao real no futuro.
	 */
	@GetMapping("/pendentes")
	public List<Usuario> listarPendentes() {
		return aprovacaoContaService.listarPendentes();
	}

	@GetMapping("/historico-aprovacao")
	public List<Usuario> listarHistoricoAprovacao() {
		return aprovacaoContaService.listarHistorico();
	}

	@PatchMapping("/{id}/aprovar")
	public Usuario aprovar(@PathVariable Long id) {
		return aprovacaoContaService.aprovar(id);
	}

	@PatchMapping("/{id}/rejeitar")
	public Usuario rejeitar(@PathVariable Long id) {
		return aprovacaoContaService.rejeitar(id);
	}

	@DeleteMapping("/{id}")
	public void delete(@PathVariable(name = "id") Long id) {
		repo.deleteById(id);
	}

	@GetMapping("/{id}")
	public ResponseEntity<Usuario> findById(@PathVariable(name = "id") Long id) {

		Optional<Usuario> opt = repo.findById(id);

		if (opt.isPresent()) {
			return ResponseEntity.ok(opt.get());
		}

		return ResponseEntity.notFound().build();
	}

	@PostMapping(path = "/login", consumes = "application/json")
	public ResponseEntity<Usuario> login(@RequestBody Map<String, String> credenciais) {

		String email = credenciais.get("email");
		String senha = credenciais.get("senha");

		Optional<Usuario> opt = repo.findByEmail(email);

		if (opt.isEmpty() || !opt.get().getSenha().equals(senha)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}

		Usuario usuario = opt.get();

		if (usuario.getStatus() == StatusUsuario.PENDENTE) {
			throw new NegocioException("Sua conta ainda está pendente de aprovação pelo gerente.");
		}

		if (usuario.getStatus() == StatusUsuario.REJEITADO) {
			throw new NegocioException("Sua abertura de conta foi rejeitada. Procure o banco para mais informações.");
		}

		return ResponseEntity.ok(usuario);
	}
}
