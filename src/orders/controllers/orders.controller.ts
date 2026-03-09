import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateOrderDto } from '../dto/create-order.dto';
import { Order } from '../entities/order.entity';
import { OrdersService } from '../services';

// Controller recebe requisicoes HTTP e delega a regra de negocio para o service.
@Controller('orders')
export class OrdersController {
  constructor(
    // Injeção de dependencia: OrdersService e fornecido pelo modulo de pedidos.
    private readonly ordersService: OrdersService,
  ) {}

  @Post()
  async create(@Body() dto: CreateOrderDto): Promise<Order> {
    return this.ordersService.createOrder(dto);
  }

  @Get()
  async findAll(): Promise<Order[]> {
    return this.ordersService.getOrders();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Order> {
    return this.ordersService.getOrderById(id);
  }
}
