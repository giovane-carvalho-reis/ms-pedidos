/**
 * main.ts
 *
 * Ponto de entrada da aplicação NestJS.
 * Aqui inicializamos o servidor HTTP, configuramos validação global
 * e definimos a porta em que o serviço vai escutar.
 *
 * No NestJS, o processo de inicialização é chamado de "bootstrap".
 * A função NestFactory.create() cria a instância da aplicação a partir
 * do módulo raiz (AppModule), que por sua vez importa todos os outros módulos.
 */

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  // Cria a aplicação NestJS passando o módulo raiz
  const app = await NestFactory.create(AppModule);

  /**
   * ValidationPipe aplica automaticamente as regras de validação definidas
   * nos DTOs usando os decorators do pacote class-validator.
   *
   * - whitelist: remove campos não declarados no DTO
   * - forbidNonWhitelisted: retorna erro 400 se houver campos extras
   * - transform: converte os dados recebidos para os tipos TypeScript declarados
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Define o prefixo global de todas as rotas (ex: /api/orders)
  app.setGlobalPrefix('api');

  // Lê a porta da variável de ambiente ou usa 3000 como padrão
  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`🚀 Serviço de Pedidos rodando em: http://localhost:${port}/api`);
}

bootstrap();
