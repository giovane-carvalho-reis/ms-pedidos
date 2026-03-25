import { Order } from '../entities/order.entity';

export type OrderCreatedEvent = {
  orderId: string;
  customerEmail: string;
  amount: number;
};

export function buildOrderCreatedEvent(order: Order, paymentToken: string): OrderCreatedEvent {
  return {
    orderId: order.id,
    customerEmail: order.email,
    amount: Number(order.totalAmount),
  };
}
