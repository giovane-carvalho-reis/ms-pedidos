import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/database.config';
import rabbitmqConfig from './config/rabbitmq.config';
import { DatabaseModule } from './common/database/database.module';
import { OrdersModule } from './orders';
import { LoggerService } from './common/logger';

// AppModule e o modulo raiz que conecta os modulos de infraestrutura e negocio.
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, rabbitmqConfig],
    }),
    DatabaseModule,
    OrdersModule,
  ],
  providers: [LoggerService],
})
export class AppModule {}
