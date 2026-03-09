/**
 * database.module.ts
 *
 * Módulo compartilhado responsável por configurar e disponibilizar
 * a conexão com o banco de dados PostgreSQL para toda a aplicação.
 *
 * Utilizamos o TypeORM (Object-Relational Mapper) integrado ao NestJS
 * via o pacote @nestjs/typeorm.
 *
 * TypeOrmModule.forRootAsync() permite configurar o TypeORM de forma
 * assíncrona, o que é necessário quando precisamos injetar serviços
 * (como o ConfigService) para ler variáveis de ambiente.
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { databaseConfig } from '../../config/database.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      /**
       * imports: [ConfigModule] torna o ConfigService disponível
       * para ser injetado na função useFactory abaixo.
       */
      imports: [ConfigModule],

      /**
       * useFactory é uma função fábrica que retorna a configuração do TypeORM.
       * O NestJS injeta automaticamente o ConfigService quando listado em inject[].
       */
      useFactory: databaseConfig,

      // Lista de dependências que serão injetadas na função useFactory
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
