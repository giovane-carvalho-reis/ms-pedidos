import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

// Entity mapeia a tabela orders no PostgreSQL para um objeto TypeScript.
@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 120 })
  customerName!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount!: number;

  @Column({ type: 'varchar', length: 50, default: 'PENDING' })
  status!: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;
}
