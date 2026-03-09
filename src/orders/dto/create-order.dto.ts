/**
 * create-order.dto.ts
 *
 * DTO (Data Transfer Object) para criação de um novo pedido.
 *
 * DTOs são objetos simples usados para definir a forma dos dados que chegam
 * nas requisições HTTP. Eles servem como contrato entre o cliente e a API.
 *
 * Utilizamos os decorators do pacote class-validator para validar
 * automaticamente os dados antes de chegarem ao service.
 * O ValidationPipe configurado no main.ts é responsável por disparar
 * essas validações e retornar erros 400 caso os dados sejam inválidos.
 *
 * Utilizamos class-transformer para converter os tipos dos dados recebidos.
 *
 * Fluxo: HTTP Request -> Controller -> ValidationPipe valida o DTO -> Service
 */

import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsNumber,
  IsPositive,
  ValidateNested,
  ArrayMinSize,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO para cada item dentro de um pedido.
 * ValidateNested + @Type(ItemDto) permitem validar objetos aninhados.
 */
export class OrderItemDto {
  /**
   * @IsString() - Valida que o valor é uma string
   * @IsNotEmpty() - Valida que a string não está vazia
   */
  @IsString()
  @IsNotEmpty({ message: 'O ID do produto não pode estar vazio' })
  productId: string;

  @IsString()
  @IsNotEmpty({ message: 'O nome do produto não pode estar vazio' })
  productName: string;

  /**
   * @IsNumber() - Valida que o valor é um número
   * @IsPositive() - Valida que o número é positivo (> 0)
   * @Min(1) - Valida que a quantidade é no mínimo 1
   */
  @IsNumber({}, { message: 'A quantidade deve ser um número' })
  @Min(1, { message: 'A quantidade mínima é 1' })
  quantity: number;

  @IsNumber({}, { message: 'O preço unitário deve ser um número' })
  @IsPositive({ message: 'O preço unitário deve ser positivo' })
  unitPrice: number;
}

/**
 * DTO principal para criação de um pedido.
 * Define os campos obrigatórios que o cliente deve enviar no corpo da requisição.
 */
export class CreateOrderDto {
  /**
   * Nome do cliente que está realizando o pedido.
   * A validação garante que este campo está presente e não está vazio.
   */
  @IsString()
  @IsNotEmpty({ message: 'O nome do cliente é obrigatório' })
  customerName: string;

  /**
   * Endereço de entrega do pedido.
   */
  @IsString()
  @IsNotEmpty({ message: 'O endereço de entrega é obrigatório' })
  deliveryAddress: string;

  /**
   * Lista de itens do pedido.
   *
   * @IsArray() - Valida que o valor é um array
   * @ArrayMinSize(1) - Valida que o array tem pelo menos 1 item
   * @ValidateNested({ each: true }) - Valida cada item do array usando o DTO OrderItemDto
   * @Type(() => OrderItemDto) - Converte cada item para a classe OrderItemDto
   *   (necessário para que o ValidateNested funcione corretamente)
   */
  @IsArray({ message: 'Os itens devem ser um array' })
  @ArrayMinSize(1, { message: 'O pedido deve ter pelo menos 1 item' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
