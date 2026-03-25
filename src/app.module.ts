
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import rabbitmqConfig from './config/rabbitmq.config';
import { DatabaseModule } from './common/database/database.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [rabbitmqConfig],
    }),
    DatabaseModule,
    OrdersModule,
  ],
})
export class AppModule {}
