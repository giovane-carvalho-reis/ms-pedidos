# ms-pedidos

> Microserviço de Pedidos — parte da arquitetura de e-commerce.

Gerencia o carrinho e o fluxo de fechamento de compra.

## 📋 Propósito do Projeto

O `ms-pedidos` é um microserviço responsável por gerenciar os pedidos de um sistema de e-commerce. Ele faz parte de uma arquitetura de microsserviços e expõe uma API REST para criação e consulta de pedidos.

Conforme o modelo C4:

```
Container(order, "Serviço de Pedidos", "Node.js / NestJS", "Gerencia o carrinho e o fluxo de fechamento de compra.")
ContainerDb(order_db, "Banco de Dados de Pedidos", "PostgreSQL", "Armazena transações e itens do pedido.")
```

## 🏗️ Arquitetura

O projeto segue uma **arquitetura em camadas** inspirada em Clean Architecture:

```
HTTP Request
     │
     ▼
┌─────────────┐
│  Controller │  ← Recebe e responde requisições HTTP
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Service   │  ← Aplica regras de negócio
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Repository  │  ← Acessa o banco de dados
└──────┬──────┘
       │
       ▼
  PostgreSQL
```

Cada camada tem responsabilidade única e se comunica apenas com a camada imediatamente abaixo.

Veja a documentação completa de arquitetura em [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md).

## 📁 Estrutura de Pastas

```
ms-pedidos/
├── src/
│   ├── main.ts                          # Ponto de entrada — bootstrap da aplicação
│   ├── app.module.ts                    # Módulo raiz — conecta todos os módulos
│   │
│   ├── config/
│   │   └── database.config.ts           # Configuração do PostgreSQL (TypeORM)
│   │
│   ├── orders/                          # Módulo de negócio: Pedidos
│   │   ├── orders.module.ts             # Módulo NestJS que agrupa os componentes
│   │   ├── controllers/
│   │   │   └── orders.controller.ts     # HTTP: POST /orders, GET /orders, GET /orders/:id
│   │   ├── services/
│   │   │   └── orders.service.ts        # Regras de negócio (ex: cálculo do total)
│   │   ├── repositories/
│   │   │   └── orders.repository.ts     # Acesso ao banco de dados via TypeORM
│   │   ├── entities/
│   │   │   └── order.entity.ts          # Mapeamento da tabela "orders" no PostgreSQL
│   │   └── dto/
│   │       └── create-order.dto.ts      # Validação dos dados da requisição
│   │
│   └── common/                          # Componentes compartilhados
│       ├── database/
│       │   └── database.module.ts       # Módulo de configuração do banco de dados
│       └── logger/
│           └── logger.service.ts        # Serviço de logging centralizado
│
├── test/
│   ├── app.e2e-spec.ts                  # Testes end-to-end (integração)
│   └── jest-e2e.json                    # Configuração do Jest para testes e2e
│
├── docs/
│   └── ARCHITECTURE.md                  # Documentação de arquitetura detalhada
│
├── Dockerfile                           # Imagem Docker multi-stage para produção
├── docker-compose.yml                   # Orquestra app + PostgreSQL localmente
├── .env.example                         # Modelo do arquivo de variáveis de ambiente
├── package.json                         # Dependências e scripts npm
├── tsconfig.json                        # Configuração do TypeScript
└── nest-cli.json                        # Configuração do NestJS CLI
```

## 🛠️ Pré-requisitos

- [Node.js](https://nodejs.org/) >= 20 LTS
- [npm](https://www.npmjs.com/) >= 9
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) (para o banco de dados)

## ⚙️ Configuração do `.env`

1. Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

2. Edite o arquivo `.env` com os valores do seu ambiente:

```env
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=ms_pedidos
```

> **⚠️ Importante:** Nunca commite o arquivo `.env` no repositório. Ele já está no `.gitignore`.

## 🚀 Como Instalar as Dependências

```bash
npm install
```

## 🐳 Como Iniciar o Banco de Dados com Docker

Para subir apenas o PostgreSQL (recomendado para desenvolvimento):

```bash
docker-compose up postgres -d
```

Para verificar se o banco está rodando:

```bash
docker-compose ps
docker-compose logs postgres
```

Para parar o banco de dados:

```bash
docker-compose down
```

> **Os dados são persistidos** em um volume Docker chamado `ms-pedidos-postgres-data`. Eles não são perdidos ao parar o container.

## ▶️ Como Iniciar o Serviço

### Desenvolvimento (com hot-reload)

```bash
npm run start:dev
```

### Produção (compilado)

```bash
npm run build
npm run start:prod
```

### Com Docker Compose (app + banco juntos)

```bash
docker-compose up --build
```

A API estará disponível em: **http://localhost:3000/api**

## 🧪 Como Rodar os Testes

### Testes unitários

```bash
npm run test
```

### Testes unitários com cobertura

```bash
npm run test:cov
```

### Testes end-to-end (integração)

```bash
npm run test:e2e
```

## 📡 Endpoints da API

### `POST /api/orders` — Criar Pedido

Cria um novo pedido.

**Request Body:**

```json
{
  "customerName": "João Silva",
  "deliveryAddress": "Rua das Flores, 123 - São Paulo/SP",
  "items": [
    {
      "productId": "prod-001",
      "productName": "Tênis Esportivo",
      "quantity": 2,
      "unitPrice": 149.99
    },
    {
      "productId": "prod-002",
      "productName": "Meia Esportiva",
      "quantity": 3,
      "unitPrice": 19.99
    }
  ]
}
```

**Response (201 Created):**

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "customerName": "João Silva",
  "deliveryAddress": "Rua das Flores, 123 - São Paulo/SP",
  "items": [
    {
      "productId": "prod-001",
      "productName": "Tênis Esportivo",
      "quantity": 2,
      "unitPrice": 149.99
    },
    {
      "productId": "prod-002",
      "productName": "Meia Esportiva",
      "quantity": 3,
      "unitPrice": 19.99
    }
  ],
  "totalAmount": "359.95",
  "status": "PENDING",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

### `GET /api/orders` — Listar Pedidos

Retorna todos os pedidos cadastrados, ordenados do mais recente ao mais antigo.

**Response (200 OK):**

```json
[
  {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "customerName": "João Silva",
    "deliveryAddress": "Rua das Flores, 123 - São Paulo/SP",
    "items": [...],
    "totalAmount": "359.95",
    "status": "PENDING",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

---

### `GET /api/orders/:id` — Buscar Pedido por ID

Retorna um pedido específico pelo seu UUID.

**Exemplo:** `GET /api/orders/a1b2c3d4-e5f6-7890-abcd-ef1234567890`

**Response (200 OK):**

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "customerName": "João Silva",
  "deliveryAddress": "Rua das Flores, 123 - São Paulo/SP",
  "items": [...],
  "totalAmount": "359.95",
  "status": "PENDING",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Response (404 Not Found)** — quando o ID não existe:

```json
{
  "statusCode": 404,
  "message": "Pedido com ID \"id-invalido\" não encontrado",
  "error": "Not Found"
}
```

## 🔄 Fluxo de Comunicação entre as Camadas

```
Cliente HTTP
     │
     │  POST /api/orders { ... }
     ▼
OrdersController          → valida o DTO via ValidationPipe
     │                       extrai o body da requisição
     │  createOrderDto
     ▼
OrdersService             → calcula o valor total (regra de negócio)
     │
     │  createOrderDto + totalAmount
     ▼
OrdersRepository          → chama orderRepository.create() + .save()
     │
     │  SQL INSERT INTO orders ...
     ▼
PostgreSQL                → persiste o registro
     │
     │  registro criado com ID e timestamps
     ▼
OrdersRepository          → retorna o objeto Order
     ▼
OrdersService             → retorna o objeto Order
     ▼
OrdersController          → serializa e retorna HTTP 201 Created
     │
     ▼
Cliente HTTP              ← { id, customerName, totalAmount, status, ... }
```

## 📚 Tecnologias

| Tecnologia       | Propósito                                  |
|------------------|--------------------------------------------|
| NestJS 10        | Framework backend com DI e módulos         |
| TypeScript 5     | Tipagem estática e código mais seguro       |
| TypeORM 0.3      | ORM para acesso ao PostgreSQL              |
| PostgreSQL 15    | Banco de dados relacional                  |
| class-validator  | Validação automática de DTOs               |
| class-transformer| Transformação de tipos nos DTOs            |
| Docker           | Containerização da aplicação               |
| Jest             | Framework de testes unitários e e2e        |
