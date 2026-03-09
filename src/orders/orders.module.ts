import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './controllers';
import { OrdersService } from './services';
import { OrdersRepository } from './repositories';
import { Order } from './entities/order.entity';
import { OrdersEventsProducer } from './producers/orders-events.producer';
import { ORDER_EVENTS_PUBLISHER } from './contracts/order-events.publisher';

// Modulo de pedidos: registra controller, regras de negocio e acesso ao banco.
@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    OrdersRepository,
    {
      provide: ORDER_EVENTS_PUBLISHER,
      useClass: OrdersEventsProducer,
    },
  ],
})
export class OrdersModule {}
