import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

// Cada item representa uma linha do carrinho no momento do checkout.
export class CreateOrderItemDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  bookId!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(180)
  title!: string;

  @IsInt()
  @Min(1)
  quantity!: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price!: number;
}

// DTO valida os dados recebidos no endpoint antes de chegar na regra de negocio.
export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  customerId!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  paymentToken!: string;

  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  @ArrayMinSize(1)
  items!: CreateOrderItemDto[];
}
