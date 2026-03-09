# Arquitetura do ms-pedidos

## Visão Geral

Este documento descreve a arquitetura do microserviço de pedidos (`ms-pedidos`) no contexto de um sistema de e-commerce.

## C4 Model - Nível de Container

```
┌─────────────────────────────────────────────────────────────────┐
│                        E-commerce System                         │
│                                                                   │
│   ┌─────────────────────────────┐    ┌────────────────────────┐  │
│   │    Serviço de Pedidos       │    │  Banco de Dados de     │  │
│   │    (ms-pedidos)             │───▶│  Pedidos               │  │
│   │    Node.js / NestJS         │    │  PostgreSQL            │  │
│   │                             │    │                        │  │
│   │  Gerencia o carrinho e      │    │  Armazena transações   │  │
│   │  o fluxo de fechamento      │    │  e itens do pedido     │  │
│   │  de compra                  │    │                        │  │
│   └─────────────────────────────┘    └────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Arquitetura em Camadas (Layered Architecture)

O projeto segue uma arquitetura em camadas inspirada em Clean Architecture, com as seguintes camadas:

```
┌────────────────────────────────────────────┐
│           HTTP Request / Response           │
└────────────────────┬───────────────────────┘
                     │
┌────────────────────▼───────────────────────┐
│              CONTROLLER LAYER               │
│         (src/orders/controllers/)           │
│                                             │
│  Responsabilidade:                          │
│  • Receber requisições HTTP                 │
│  • Extrair dados (body, params, query)      │
│  • Delegar para o Service                   │
│  • Retornar respostas HTTP                  │
└────────────────────┬───────────────────────┘
                     │
┌────────────────────▼───────────────────────┐
│               SERVICE LAYER                 │
│          (src/orders/services/)             │
│                                             │
│  Responsabilidade:                          │
│  • Aplicar regras de negócio                │
│  • Calcular valores totais                  │
│  • Orquestrar chamadas ao repositório       │
│  • Lançar exceções de negócio               │
└────────────────────┬───────────────────────┘
                     │
┌────────────────────▼───────────────────────┐
│            REPOSITORY LAYER                 │
│        (src/orders/repositories/)           │
│                                             │
│  Responsabilidade:                          │
│  • Encapsular operações de banco de dados   │
│  • Traduzir queries TypeORM                 │
│  • Mapear entidades para objetos de domínio │
└────────────────────┬───────────────────────┘
                     │
┌────────────────────▼───────────────────────┐
│               DATABASE LAYER                │
│            PostgreSQL via TypeORM           │
│                                             │
│  Tabelas:                                   │
│  • orders - Pedidos                         │
└────────────────────────────────────────────┘
```

## Tabela de Banco de Dados

### Tabela: `orders`

| Coluna            | Tipo          | Descrição                           |
|-------------------|---------------|-------------------------------------|
| id                | UUID (PK)     | Identificador único do pedido       |
| customer_name     | VARCHAR       | Nome do cliente                     |
| delivery_address  | VARCHAR       | Endereço de entrega                 |
| items             | JSONB         | Lista de itens (JSON)               |
| total_amount      | DECIMAL(10,2) | Valor total do pedido               |
| status            | ENUM          | Status do pedido                    |
| created_at        | TIMESTAMP     | Data de criação (automático)        |
| updated_at        | TIMESTAMP     | Data de atualização (automático)    |

### Status do Pedido (Enum)

| Valor       | Descrição                              |
|-------------|----------------------------------------|
| PENDING     | Pedido criado, aguardando confirmação  |
| CONFIRMED   | Pedido confirmado pelo sistema         |
| SHIPPED     | Pedido enviado para entrega            |
| DELIVERED   | Pedido entregue ao cliente             |
| CANCELLED   | Pedido cancelado                       |

### Estrutura dos Itens (JSONB)

```json
[
  {
    "productId": "string",
    "productName": "string",
    "quantity": "number",
    "unitPrice": "number"
  }
]
```

## Injeção de Dependência no NestJS

O NestJS utiliza o padrão de Injeção de Dependência (DI) para desacoplar os componentes:

```
AppModule
    ├── DatabaseModule
    │       └── TypeOrmModule (conexão com PostgreSQL)
    └── OrdersModule
            ├── OrdersController
            │       └── injeta → OrdersService
            ├── OrdersService
            │       ├── injeta → OrdersRepository
            │       └── injeta → LoggerService
            └── OrdersRepository
                    └── injeta → Repository<Order> (TypeORM)
```

## Tecnologias Utilizadas

| Tecnologia      | Versão  | Propósito                           |
|-----------------|---------|-------------------------------------|
| Node.js         | 20 LTS  | Runtime JavaScript                  |
| NestJS          | 10.x    | Framework backend                   |
| TypeScript      | 5.x     | Superset tipado do JavaScript       |
| TypeORM         | 0.3.x   | ORM para acesso ao banco de dados   |
| PostgreSQL       | 15.x    | Banco de dados relacional           |
| class-validator | 0.14.x  | Validação de DTOs                   |
| Docker          | -       | Containerização                     |
| Docker Compose  | -       | Orquestração local dos containers   |
