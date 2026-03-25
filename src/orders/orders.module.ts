import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrdersController } from './controllers/orders.controller';

import { OrdersService } from './services/orders.service';
import { OrdersRepository } from './repositories/orders.repository';
import { LoggerService } from '../common/logger/logger.service';
import {HttpModule} from "@nestjs/axios";
import { OrdersEventsProducer } from './producers/orders-events.producer';
import { ORDER_EVENTS_PUBLISHER } from './contracts/order-events.publisher';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), HttpModule],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    OrdersRepository,
    LoggerService,
    OrdersEventsProducer,
    {
      provide: ORDER_EVENTS_PUBLISHER,
      useExisting: OrdersEventsProducer,
    },
  ],
})
export class OrdersModule {}
