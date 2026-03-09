import { IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength } from 'class-validator';

// DTO valida os dados recebidos no endpoint antes de chegar na regra de negocio.
export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  customerName!: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  totalAmount!: number;
}
