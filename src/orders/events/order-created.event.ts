import { Order } from '../entities/order.entity';

export type OrderCreatedEvent = {
  eventType: 'order.created';
  source: 'livraria-online.order-service';
  occurredAt: string;
  data: {
    orderId: string;
    customerName: string;
    totalAmount: number;
    status: string;
  };
};

export function buildOrderCreatedEvent(order: Order): OrderCreatedEvent {
  return {
    eventType: 'order.created',
    source: 'livraria-online.order-service',
    occurredAt: new Date().toISOString(),
    data: {
      orderId: order.id,
      customerName: order.customerName,
      totalAmount: Number(order.totalAmount),
      status: order.status,
    },
  };
}
