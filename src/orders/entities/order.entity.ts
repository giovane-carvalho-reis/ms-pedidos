/**
 * order.entity.ts
 *
 * Entidade que representa a tabela "orders" no banco de dados PostgreSQL.
 *
 * No TypeORM, uma Entity é uma classe TypeScript decorada com @Entity()
 * que mapeia diretamente para uma tabela no banco de dados.
 * Cada propriedade decorada com @Column() representa uma coluna da tabela.
 *
 * O TypeORM usa essas definições para:
 * - Criar a tabela automaticamente (quando synchronize: true)
 * - Mapear os dados do banco para objetos TypeScript (ORM)
 * - Realizar operações CRUD tipadas
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Enum que representa os possíveis status de um pedido.
 * Usar enum garante que apenas valores válidos sejam armazenados no banco.
 */
export enum OrderStatus {
  PENDING = 'PENDING',     // Pedido criado, aguardando confirmação
  CONFIRMED = 'CONFIRMED', // Pedido confirmado pelo sistema
  SHIPPED = 'SHIPPED',     // Pedido enviado para entrega
  DELIVERED = 'DELIVERED', // Pedido entregue ao cliente
  CANCELLED = 'CANCELLED', // Pedido cancelado
}

/**
 * @Entity('orders') - Mapeia esta classe para a tabela "orders" no PostgreSQL.
 * Se o nome não for informado, o TypeORM usa o nome da classe em lowercase.
 */
@Entity('orders')
export class Order {
  /**
   * @PrimaryGeneratedColumn('uuid') - Define a coluna de chave primária.
   * O TypeORM gera automaticamente um UUID único para cada novo pedido.
   * UUID é preferível a IDs sequenciais em microserviços por evitar conflitos.
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * @Column() - Define uma coluna simples.
   * customerName armazena o nome do cliente que realizou o pedido.
   */
  @Column({ name: 'customer_name' })
  customerName: string;

  /**
   * Endereço de entrega do pedido.
   * nullable: false garante que este campo é obrigatório no banco.
   */
  @Column({ name: 'delivery_address' })
  deliveryAddress: string;

  /**
   * Lista de itens do pedido armazenada como JSON no banco de dados.
   * Usar 'jsonb' no PostgreSQL é mais eficiente do que 'json' simples,
   * pois permite indexação e busca dentro do JSON.
   *
   * Estrutura esperada de cada item:
   * { productId: string, productName: string, quantity: number, unitPrice: number }
   */
  @Column({ type: 'jsonb' })
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }>;

  /**
   * Valor total do pedido calculado em reais (BRL).
   * type: 'decimal' garante precisão para valores monetários.
   * precision: 10 = máximo de 10 dígitos; scale: 2 = 2 casas decimais.
   */
  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'total_amount' })
  totalAmount: number;

  /**
   * Status atual do pedido.
   * type: 'enum' cria uma coluna com restrição de valores no PostgreSQL.
   * default: OrderStatus.PENDING define o valor inicial de todo novo pedido.
   */
  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  /**
   * @CreateDateColumn() - O TypeORM preenche automaticamente esta coluna
   * com a data e hora de criação do registro.
   * Não precisamos setar este valor manualmente.
   */
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  /**
   * @UpdateDateColumn() - O TypeORM atualiza automaticamente esta coluna
   * sempre que o registro é modificado.
   */
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
