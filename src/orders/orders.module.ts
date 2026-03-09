/**
 * orders.module.ts
 *
 * Módulo que agrupa todos os componentes relacionados à funcionalidade de Pedidos.
 *
 * No NestJS, a aplicação é organizada em módulos. Cada módulo é uma unidade
 * coesa que encapsula um conjunto de funcionalidades relacionadas.
 * Um módulo pode importar outros módulos, exportar providers e declarar controllers.
 *
 * O OrdersModule une:
 * - Controller: recebe as requisições HTTP
 * - Service: aplica a lógica de negócio
 * - Repository: acessa o banco de dados
 * - Entity: define a estrutura da tabela no banco
 *
 * TypeOrmModule.forFeature([Order]) registra o repositório TypeORM da entidade Order
 * e o torna disponível para injeção neste módulo via @InjectRepository(Order).
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrdersController } from './controllers/orders.controller';
import { OrdersService } from './services/orders.service';
import { OrdersRepository } from './repositories/orders.repository';
import { LoggerService } from '../common/logger/logger.service';

@Module({
  imports: [
    /**
     * TypeOrmModule.forFeature([Order]) disponibiliza o Repository<Order>
     * do TypeORM para ser injetado via @InjectRepository(Order) no OrdersRepository.
     * Cada módulo que precisa acessar uma entidade deve registrá-la aqui.
     */
    TypeOrmModule.forFeature([Order]),
  ],

  /**
   * controllers: Lista de controllers que pertencem a este módulo.
   * O NestJS registra automaticamente as rotas definidas nesses controllers.
   */
  controllers: [OrdersController],

  /**
   * providers: Lista de serviços e repositórios que o NestJS deve criar e gerenciar.
   * Todos os providers listados aqui podem ser injetados uns nos outros dentro deste módulo.
   */
  providers: [OrdersService, OrdersRepository, LoggerService],
})
export class OrdersModule {}
