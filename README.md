# Dasafio - Testes Unitários e Integação

## Fin-API

Foi disponibilizado um template com uma API já pronta. para exercitar o conteúdo de Testes Unitários e de Integração com Jest visto na trilha Ignite-Nodejs da Rocketseat.

O objetivo foi realizar a configuração do Jest, as configurações necessárias para conectar ao banco de dados Postgres com o TypeORM e desenvolver os testes para as funcionalidade da API disponibilizada.

## Descrição das Rotas da API Disponibilizada para Desenvolvimento dos Testes

### POST `/api/v1/users`

A rota recebe `name`, `email` e `password` dentro do corpo da requisição, salva o usuário criado no banco e retorna uma resposta vazia com status `201`. 

### POST `/api/v1/sessions`

A rota recebe `email` e `password` no corpo da requisição e retorna os dados do usuário autenticado junto à um token JWT. 

### GET `/api/v1/profile`

A rota recebe um token JWT pelo header da requisição e retorna as informações do usuário autenticado.

### GET `/api/v1/statements/balance`

A rota recebe um token JWT pelo header da requisição e retorna uma lista com todas as operações de depósito e saque do usuário autenticado e também o saldo total numa propriedade `balance`.

### POST `/api/v1/statements/deposit`

A rota recebe um token JWT pelo header e `amount` e `description` no corpo da requisição, registra a operação de depósito do valor e retorna as informações do depósito criado com status `201`.

### POST `/api/v1/statements/withdraw`

A rota recebe um token JWT pelo header e `amount` e `description` no corpo da requisição, registra a operação de saque do valor (caso o usuário possua saldo válido) e retorna as informações do saque criado com status `201`. 

### GET `/api/v1/statements/:statement_id`

A rota recebe um token JWT pelo header e o id de uma operação registrada (saque ou depósito) na URL da rota e retorna as informações da operação encontrada.

## Código dos Testes Desenvolvidos

Os Códigos encontram-se nas pastas: src/modules/users/useCases/ e src/modules/users/statements/useCases.

Dentro das pastas de cada caso de uso seguem o seguinte padrão: 

NomeDaFuncionalidadeUseCase.spec.ts - para os testes unitários

NomeDaFuncionalidadeController.spec.ts - para os testes de integração

## Instalação e Execução

- Faça o clone do repositório com o comando git clone.
- use o comando npm install/yarn no terminal para instalar as dependências.
- para rodar a aplicação utilize o comando: npm run dev / yarn dev.
- para executar os testes utilize o comando: npm run test / yarn test.
