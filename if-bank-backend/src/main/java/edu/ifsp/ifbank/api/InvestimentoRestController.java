package edu.ifsp.ifbank.api;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import edu.ifsp.ifbank.modelo.Conta;
import edu.ifsp.ifbank.modelo.Investimento;
import edu.ifsp.ifbank.modelo.Movimentacao;
import edu.ifsp.ifbank.modelo.Usuario;
import edu.ifsp.ifbank.modelo.enums.TipoMovimentacao;
import edu.ifsp.ifbank.persistence.ContaRepositorio;
import edu.ifsp.ifbank.persistence.InvestimentoRepositorio;
import edu.ifsp.ifbank.persistence.MovimentacaoRepositorio;
import edu.ifsp.ifbank.persistence.UsuarioRepositorio;

@RestController
@RequestMapping(path = "/api/investimento", produces = "application/json")
public class InvestimentoRestController {

	@Autowired
	private InvestimentoRepositorio repo;
	@Autowired
	private MovimentacaoRepositorio movimentacaoRepo;
	@Autowired
	private ContaRepositorio contaRepo;
	
	@Autowired
	private UsuarioRepositorio usuarioRepo;

	@GetMapping
	public List<Investimento> getAll() {
		return repo.findAll();
	}
	
	@GetMapping("/usuario/{id}")
	public List<Investimento> getByUsuario(@PathVariable Long id) {
	    return repo.findByUsuarioId(id);
	}

	@PostMapping(consumes = "application/json")
	@ResponseStatus(HttpStatus.CREATED)
	public Investimento save(@RequestBody Investimento invest) {
		
		Usuario usuario = buscarUsuario(invest.getUsuario().getId());

	    descontarSaldo(usuario.getConta(), invest.getValorAplicado());

	    invest.setUsuario(usuario);

	    criarMovimentacao(usuario, invest);
	    
	    calcularRendimento(invest);
		
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
	
	@GetMapping("/usuario/{id}/periodo")
	public List<Investimento> buscarPorPeriodo(
	        @PathVariable Long id,
	        @RequestParam LocalDate inicio,
	        @RequestParam LocalDate fim) {

	    LocalDateTime dataInicio = inicio.atStartOfDay();
	    LocalDateTime dataFim = fim.atTime(23, 59, 59);

	    return repo.findByUsuarioIdAndDataAplicacaoBetween(
	            id,
	            dataInicio,
	            dataFim
	    );
	}
	
	private Usuario buscarUsuario(Long usuarioId) {

	    Optional<Usuario> opt = usuarioRepo.findById(usuarioId);

	    if (opt.isEmpty()) {
	        return null;
	    }

	    return opt.get();
	}
	
	private boolean validarSaldo(Conta conta, BigDecimal valor) {
		
		return conta.getSaldo().compareTo(valor) >= 0;
	}
	
	private void descontarSaldo(Conta conta, BigDecimal valor){
		
		 if(!validarSaldo(conta, valor)) {
			 throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Saldo insuficiente para realizar o investimento.");
		 }
		 
		 conta.setSaldo(conta.getSaldo().subtract(valor));

		 contaRepo.save(conta);
	}
	
	private void criarMovimentacao(Usuario usuario, Investimento investimento) {

	    Movimentacao mov = new Movimentacao();
	    mov.setConta(usuario.getConta());
	    mov.setTipo(TipoMovimentacao.INVESTIMENTO);
	    mov.setValor(investimento.getValorAplicado());
	    mov.setDescricao("Aplicação em " + investimento.getTipo());
	    mov.setDataMovimentacao(LocalDateTime.now());

	    movimentacaoRepo.save(mov);
	}
	
	private void calcularRendimento(Investimento invest) {

	    BigDecimal taxa;

	    switch (invest.getTipo()) {

	        case "CDB":
	            taxa = new BigDecimal("0.10");
	            break;

	        case "LCI":
	            taxa = new BigDecimal("0.12");
	            break;

	        case "Tesouro Direto":
	            taxa = new BigDecimal("0.08");
	            break;

	        default:
	            taxa = new BigDecimal("0.05");
	    }

	    invest.setRendimento(
	        invest.getValorAplicado().multiply(taxa)
	    );
	}
}
