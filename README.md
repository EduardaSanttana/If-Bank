# IFBank

Sistema de Internet Banking desenvolvido como projeto da disciplina de Programação com Frameworks Web.

**UTILIZE A BRANCH DEV PARA TESTES**

## Tecnologias utilizadas

### Backend

* Java 21
* Spring Boot
* Spring Data JPA
* Gradle

### Frontend

* Angular 21
* TypeScript

### Banco de Dados

* Banco de dados relacional (MySQL)

---

# Funcionalidades

* Login e Logout
* Cadastro de usuários
* Upload de foto de perfil
* Aprovação de contas (Gerente)
* Transferências entre contas
* Investimentos
* Extrato com filtro por período
* Atualização de dados pessoais
* Mensagens de feedback
* Paginação de tabelas

---

# Como executar o projeto

## 1. Backend

Abra um terminal na pasta do backend e execute os seguintes comandos:

```bash
./gradlew build
```

Após a conclusão do build:

```bash
./gradlew bootRun
```

O backend ficará disponível na porta configurada da aplicação.

---

## 2. Frontend

Abra outro terminal na pasta do frontend e execute:

```bash
ng serve
```

Após iniciar, acesse:

```text
http://localhost:4200
```

---

# Estrutura do Projeto

```text
IFBank
├── backend
│   ├── src
│   ├── build.gradle
│   └── ...
│
└── frontend
    ├── src
    ├── angular.json
    └── ...
```

---

# Integrantes

* Bruno Possar
* Eduarda Santana
* Guilherme Crespo
* Luana Melissa

---

# Observações

Este projeto foi desenvolvido exclusivamente para fins acadêmicos como trabalho final da disciplina de Programação com Frameworks Web.
