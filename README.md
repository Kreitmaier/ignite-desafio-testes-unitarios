# Fin-API

Foi disponibilizado um template com uma API já pronta. para exercitar o conteúdo de Testes Unitários e de Integração com Jest visto na trilha Ignite-Nodejs da Rocketseat.
O objetivo foi realizar a configuração do Jest, as configurações necessárias para conectar ao banco de dados Postgres com o TypeORM e desenvolver os testes para as funcionalidade da API disponibilizada.

Ao decorrer do curso foi solicitado a realização de mais um desafio que deveria ser realizado através desta mesma API.
O Desafio consiste em adicionar uma nova funcionalidade nesta API de transferência de valores entre os usuários.
Mais detalhes sobre este desafio poderá ser visto após a descrição de desafio de testes unitário e integração.

# ****Dasafio - Testes Unitários e Integação****
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

## Código dos Testes Desenvolvido

Os Códigos encontram-se nas pastas: src/modules/users/useCases/ e src/modules/users/statements/useCases.

Dentro das pastas de cada caso de uso seguem o seguinte padrão: 

NomeDaFuncionalidadeUseCase.spec.ts - para os testes unitários

NomeDaFuncionalidadeController.spec.ts - para os testes de integração

# ****Dasafio - Transferências com a FinAPI****

## Descrição do desafio:

A nova funcionalidade deverá permitir a transferência de valores entre contas. Para isso, você pode pensar na melhor forma de construir essa solução mas alguns requisitos deverão ser cumpridos:

- Não deve ser possível transferir valores superiores ao disponível no saldo de uma conta;
- O balance (obtido através da rota `/api/v1/statements/balance`) deverá considerar também todos os valores transferidos ou recebidos através de transferências ao exibir o saldo de um usuário;
- As informações para realizar uma transferência serão:
    
    ```json
    {
    	"amount": 100,
    	"description": "Descrição da transferência"
    }
    ```
    
    Você pode passar o `id` do usuário destinatário via parâmetro na rota (exemplo: `/api/v1/statements/transfers/:user_id`) e o id do usuário remetente poderá ser obtido através do token JWT enviado no header da requisição;
    
- Ao mostrar o balance de um usuário, operações do tipo `transfer` deverão possuir os seguintes campos:
    
    ```json
    {
      "id": "4d04b6ec-2280-4dc2-9432-8a00f64e7930",
    	"sender_id": "cfd06865-11b9-412a-aa78-f47cc3e52905"
      "amount": 100,
      "description": "Transferência de valor",
      "type": "transfer",
      "created_at": "2021-03-26T21:33:11.370Z",
      "updated_at": "2021-03-26T21:33:11.370Z"
    }
    ```
    
    Observe o campo `sender_id`. Esse deverá ser o `id` do usuário que enviou a transferência.
    O campo `type` também deverá exibir o tipo da operação, que nesse caso é `transfer`.
    

## Código Desenvolvido da Nova Funcionalidade

Os arquivos referente a funcionalidade adicionada encontram-se em: /*src/modules/statements/useCases/createTransferStatement*

Para desenvolver esta funcionalidade procurei seguir os padrões que ja encontravam-se no projeto fazendo somente as adições e alterações onde era pertinente, as alterações foram: 

- Na migration de criação da tabela statements onde foi adicionado a coluna sender_id podendo ser null, e alterado a coluna type adicionando o tipo enum ‘transfer’.

- Na entidade Statement também foi adionado o campo sender_id e adicionado o tipo enum ‘transfer’.

- No StatementsRepository foi criado a função createTransfer que persiste as informações no banco de dados.

- Foi criado o arquivo CreateTransferStatementError para tratar os errors da funcionalidade.

- Adicionei também, afim de exercitar o contúdo de testes aprendido anterirormente, teste unitário para esta funcionalidade e para isso foi necessário fazer uma alteração no InMemoryStatementsRepository criando a função createTransfer.

## Instalação e Execução

- Faça o clone do repositório com o comando git clone.
- use o comando npm install/yarn no terminal para instalar as dependências.
- para rodar a aplicação utilize o comando: npm run dev / yarn dev.
