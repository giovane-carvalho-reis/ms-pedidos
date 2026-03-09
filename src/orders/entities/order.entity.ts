import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type OrderItemSnapshot = {
  bookId: string;
  title: string;
  quantity: number;
  price: number;
};

// Entity mapeia a tabela orders no PostgreSQL para um objeto TypeScript.
@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 80 })
  customerId!: string;

  // Snapshot dos itens para preservar o estado do carrinho na criacao do pedido.
  @Column({ type: 'jsonb' })
  items!: OrderItemSnapshot[];

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount!: number;

  @Column({ type: 'varchar', length: 50, default: 'PENDING_PAYMENT' })
  status!: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;
}
