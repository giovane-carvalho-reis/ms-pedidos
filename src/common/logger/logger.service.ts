/**
 * logger.service.ts
 *
 * Serviço de logger compartilhado da aplicação.
 *
 * Encapsula o Logger nativo do NestJS para ser reutilizado em qualquer
 * módulo da aplicação. Centralizar o logger em um único serviço facilita
 * a troca da implementação no futuro (ex: usar Winston, Pino, etc.)
 * sem precisar alterar o código de cada serviço.
 *
 * No NestJS, um serviço marcado com @Injectable() pode ser injetado
 * em qualquer outro componente (controller, service, etc.) via o
 * sistema de Injeção de Dependência (DI).
 */

import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggerService {
  // Instancia o Logger nativo do NestJS com um contexto padrão
  private readonly logger = new Logger(LoggerService.name);

  /**
   * Registra uma mensagem informativa no console.
   * Usado para eventos normais do sistema.
   *
   * @param message - Mensagem a ser registrada
   * @param context - Contexto opcional (ex: nome do serviço que chamou o log)
   */
  log(message: string, context?: string): void {
    this.logger.log(message, context);
  }

  /**
   * Registra uma mensagem de erro no console.
   * Usado quando ocorre uma exceção ou falha inesperada.
   *
   * @param message - Mensagem de erro
   * @param trace - Stack trace do erro (opcional)
   * @param context - Contexto opcional
   */
  error(message: string, trace?: string, context?: string): void {
    this.logger.error(message, trace, context);
  }

  /**
   * Registra um aviso no console.
   * Usado para situações que não são erros, mas merecem atenção.
   *
   * @param message - Mensagem de aviso
   * @param context - Contexto opcional
   */
  warn(message: string, context?: string): void {
    this.logger.warn(message, context);
  }

  /**
   * Registra uma mensagem de debug no console.
   * Usado durante o desenvolvimento para inspecionar o estado da aplicação.
   *
   * @param message - Mensagem de debug
   * @param context - Contexto opcional
   */
  debug(message: string, context?: string): void {
    this.logger.debug(message, context);
  }
}
