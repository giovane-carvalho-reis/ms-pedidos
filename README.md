# ms-pedidos

Microservico de pedidos de um e-commerce, implementado com NestJS e PostgreSQL.
Este servico gerencia o fluxo de criacao e consulta de pedidos durante o checkout.

## Proposito do Projeto

No modelo C4 da arquitetura, este repositorio representa:

- Container: **Servico de Pedidos** (`Node.js / NestJS`)
- Banco: **Banco de Dados de Pedidos** (`PostgreSQL`)

Responsabilidade principal:

- Gerenciar carrinho e fluxo de fechamento de compra na perspectiva de pedidos.

## Arquitetura

Estrutura inspirada em clean architecture / layered architecture, simplificada para facilitar manutencao:

- `Controller`: camada HTTP (entrada e saida da API)
- `Service`: camada de regra de negocio
- `Repository`: camada de acesso a dados
- `Porta de Eventos`: contrato para publicar eventos sem acoplar o dominio ao RabbitMQ
- `Producer`: adapter de infraestrutura que implementa a porta de eventos
- `Database`: infraestrutura de banco (TypeORM + PostgreSQL)

Fluxo de comunicacao entre camadas:

`Controller -> Service -> Repository -> Database`

## Estrutura de Pastas

```text
src/
	main.ts
	app.module.ts
	config/
		database.config.ts
	orders/
		orders.module.ts
		contracts/
			order-events.publisher.ts
		controllers/
			orders.controller.ts
		events/
			order-created.event.ts
		services/
			orders.service.ts
		producers/
			orders-events.producer.ts
		repositories/
			orders.repository.ts
		entities/
			order.entity.ts
		dto/
			create-order.dto.ts
	common/
		database/
			database.module.ts
		logger/
			logger.service.ts

test/
docs/
	architecture.md
```

## Tecnologias

- Node.js
- NestJS (TypeScript)
- TypeORM
- PostgreSQL
- RabbitMQ
- Docker / Docker Compose

## Como Instalar Dependencias

```bash
npm install
```

## Configuracao de Ambiente (.env)

1. Crie o arquivo `.env` baseado no exemplo:

```bash
cp .env.example .env
```

2. Ajuste os valores se necessario:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=orders_db
RABBITMQ_URL=amqp://guest:guest@localhost:5672
RABBITMQ_EXCHANGE=orders.exchange
RABBITMQ_ROUTING_KEY=order.created
```

## Como Iniciar o Servico

Modo desenvolvimento:

```bash
npm run start:dev
```

Build e execucao em modo producao:

```bash
npm run build
npm run start
```

API disponivel em:

- `http://localhost:3000/api`

## Como Iniciar o Banco com Docker

Subir banco e servico juntos:

```bash
docker compose up --build
```

Subir apenas o PostgreSQL:

```bash
docker compose up postgres
```

Subir apenas o RabbitMQ:

```bash
docker compose up rabbitmq
```

Painel do RabbitMQ Management:

- `http://localhost:15672`
- Usuario: `guest`
- Senha: `guest`

## Evento RabbitMQ (Producer)

Quando um pedido e criado no endpoint `POST /orders`, o `OrdersService` publica um evento simples no RabbitMQ.

- Exchange: `orders.exchange` (tipo `topic`)
- Routing key: `order.created`
- Origem: `livraria-online.order-service`

Exemplo de payload publicado:

```json
{
	"eventType": "order.created",
	"source": "livraria-online.order-service",
	"occurredAt": "2026-03-08T16:15:00.000Z",
	"data": {
		"orderId": "a1b2c3d4",
		"customerId": "cust-123",
		"items": [
			{
				"bookId": "book_1",
				"title": "Clean Architecture",
				"quantity": 2,
				"price": 79.9
			}
		],
		"totalAmount": 159.8,
		"status": "PENDING_PAYMENT",
		"paymentToken": "tok_abc123"
	}
}
```

## Endpoints de Exemplo

Base URL:

- `http://localhost:3000/api`

### POST /orders

Cria um novo pedido.

Exemplo de request:

```bash
curl -X POST http://localhost:3000/api/orders \
	-H "Content-Type: application/json" \
	-d '{
		"customerId": "cust-123",
		"paymentToken": "tok_abc123",
		"items": [
			{
				"bookId": "book_1",
				"title": "Clean Architecture",
				"quantity": 2,
				"price": 79.90
			},
			{
				"bookId": "book_2",
				"title": "Domain-Driven Design",
				"quantity": 1,
				"price": 39.90
			}
		]
	}'
```

Observacao: `totalAmount` e calculado automaticamente pelo servico com base em `items`.

### GET /orders

Lista todos os pedidos.

```bash
curl http://localhost:3000/api/orders
```

### GET /orders/:id

Busca um pedido por ID.

```bash
curl http://localhost:3000/api/orders/<ORDER_ID>
```

## Observacoes de Boas Praticas

- Os DTOs usam `class-validator` para validacao de entrada.
- O `ValidationPipe` global remove campos nao permitidos e bloqueia payloads invalidos.
- O NestJS usa injeção de dependencia para montar os objetos de cada camada automaticamente.
- O `OrdersRepository` concentra operacoes de persistencia e mantem o `OrdersService` focado em regras de negocio.
