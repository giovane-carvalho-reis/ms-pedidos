/**
 * database.config.ts
 *
 * Arquivo de configuração do banco de dados PostgreSQL.
 *
 * Utiliza o ConfigService do NestJS para ler as variáveis de ambiente
 * de forma segura e tipada. Essas variáveis são definidas no arquivo .env
 * (veja .env.example como referência).
 *
 * Esta função retorna um objeto TypeOrmModuleOptions com os parâmetros
 * de conexão necessários para o TypeORM conectar ao PostgreSQL.
 */

import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Order } from '../orders/entities/order.entity';

/**
 * Fábrica de configuração do banco de dados.
 * Recebe o ConfigService via injeção de dependência e retorna as opções do TypeORM.
 *
 * @param configService - Serviço do NestJS para leitura de variáveis de ambiente
 * @returns TypeOrmModuleOptions - Configurações de conexão com o PostgreSQL
 */
export const databaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',

  // Host do banco de dados (ex: localhost ou nome do container Docker)
  host: configService.get<string>('DB_HOST', 'localhost'),

  // Porta do PostgreSQL (padrão: 5432)
  port: configService.get<number>('DB_PORT', 5432),

  // Nome do usuário do banco de dados
  username: configService.get<string>('DB_USERNAME', 'postgres'),

  // Senha do usuário do banco de dados
  password: configService.get<string>('DB_PASSWORD', 'postgres'),

  // Nome do banco de dados a ser utilizado
  database: configService.get<string>('DB_DATABASE', 'ms_pedidos'),

  /**
   * Lista de entidades que o TypeORM deve mapear para tabelas no banco.
   * Cada entidade representa uma tabela e seus campos.
   */
  entities: [Order],

  /**
   * synchronize: true faz o TypeORM criar/atualizar as tabelas automaticamente
   * com base nas entidades definidas.
   *
   * ⚠️ ATENÇÃO: Nunca use synchronize: true em produção!
   * Em produção, use migrations para controlar as alterações no banco de dados.
   */
  synchronize: configService.get<string>('NODE_ENV') !== 'production',

  // Exibe as queries SQL no console (útil para desenvolvimento e debug)
  logging: configService.get<string>('NODE_ENV') === 'development',
});
