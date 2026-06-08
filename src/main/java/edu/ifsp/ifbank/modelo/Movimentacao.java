package edu.ifsp.ifbank.modelo;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import edu.ifsp.ifbank.modelo.enums.TipoMovimentacao;
import jakarta.persistence.*;

@Entity
@Table(name = "movimentacao")
public class Movimentacao {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Enumerated(EnumType.STRING)
	private TipoMovimentacao tipo;

	private BigDecimal valor;

	private String descricao;

	private LocalDateTime data;

	@ManyToOne
	@JoinColumn(name = "conta_id")
	private Conta conta;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public TipoMovimentacao getTipo() {
		return tipo;
	}

	public void setTipo(TipoMovimentacao tipo) {
		this.tipo = tipo;
	}

	public BigDecimal getValor() {
		return valor;
	}

	public void setValor(BigDecimal valor) {
		this.valor = valor;
	}

	public String getDescricao() {
		return descricao;
	}

	public void setDescricao(String descricao) {
		this.descricao = descricao;
	}

	public LocalDateTime getData() {
		return data;
	}

	public void setData(LocalDateTime data) {
		this.data = data;
	}

	public Conta getConta() {
		return conta;
	}

	public void setConta(Conta conta) {
		this.conta = conta;
	}
}