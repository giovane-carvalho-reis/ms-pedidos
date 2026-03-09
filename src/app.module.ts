/**
 * app.module.ts
 *
 * Módulo raiz da aplicação.
 * No NestJS, tudo é organizado em módulos. O AppModule é o ponto central
 * que importa e conecta todos os outros módulos da aplicação.
 *
 * Aqui configuramos:
 * - ConfigModule: para leitura de variáveis de ambiente (.env)
 * - DatabaseModule: para conexão com o PostgreSQL
 * - OrdersModule: módulo de negócio responsável pelos pedidos
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './common/database/database.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    /**
     * ConfigModule.forRoot() carrega as variáveis de ambiente do arquivo .env
     * e as disponibiliza em toda a aplicação via ConfigService.
     * isGlobal: true significa que não precisamos reimportar o ConfigModule
     * em cada módulo filho.
     */
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Módulo compartilhado que configura a conexão com o banco de dados PostgreSQL
    DatabaseModule,

    // Módulo de negócio de pedidos (controllers, services, repositories)
    OrdersModule,
  ],
})
export class AppModule {}
