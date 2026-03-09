import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from '../dto/create-order.dto';
import { Order } from '../entities/order.entity';
import { OrdersRepository } from '../repositories';
import {
  ORDER_EVENTS_PUBLISHER,
  OrderEventsPublisher,
} from '../contracts/order-events.publisher';

// Service aplica regras de negocio e coordena fluxo entre controller e repository.
@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    @Inject(ORDER_EVENTS_PUBLISHER)
    private readonly eventsPublisher: OrderEventsPublisher,
  ) {}

  async createOrder(data: CreateOrderDto): Promise<Order> {
    const order = await this.ordersRepository.create(data);
    await this.eventsPublisher.publishOrderCreated(order, data.paymentToken);
    return order;
  }

  async getOrders(): Promise<Order[]> {
    return this.ordersRepository.findAll();
  }

  async getOrderById(id: string): Promise<Order> {
    const order = await this.ordersRepository.findOneById(id);

    if (!order) {
      throw new NotFoundException(`Pedido com id ${id} nao encontrado`);
    }

    return order;
  }
}
