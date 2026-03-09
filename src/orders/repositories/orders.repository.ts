import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from '../dto/create-order.dto';
import { Order } from '../entities/order.entity';

// Repository concentra acesso ao banco e querys da entidade de pedido.
@Injectable()
export class OrdersRepository {
  constructor(
    // NestJS injeta o repository do TypeORM da entidade Order automaticamente.
    @InjectRepository(Order)
    private readonly repository: Repository<Order>,
  ) {}

  async create(data: CreateOrderDto): Promise<Order> {
    const order = this.repository.create({
      customerName: data.customerName,
      totalAmount: data.totalAmount,
      status: 'PENDING',
    });

    return this.repository.save(order);
  }

  async findAll(): Promise<Order[]> {
    return this.repository.find({ order: { createdAt: 'DESC' } });
  }

  async findOneById(id: string): Promise<Order | null> {
    return this.repository.findOne({ where: { id } });
  }
}
