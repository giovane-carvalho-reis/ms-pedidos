import { Injectable, Logger } from '@nestjs/common';

// Wrapper simples para manter um ponto unico de logs da aplicacao.
@Injectable()
export class LoggerService {
  private readonly logger = new Logger('OrderService');

  log(message: string): void {
    this.logger.log(message);
  }

  error(message: string, trace?: string): void {
    this.logger.error(message, trace);
  }
}
