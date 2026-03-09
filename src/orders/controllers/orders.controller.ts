/**
 * orders.controller.ts
 *
 * Controller responsável por receber e responder as requisições HTTP
 * relacionadas aos pedidos.
 *
 * Na arquitetura em camadas, o Controller é a camada mais externa da aplicação.
 * Ele é a porta de entrada para as requisições HTTP e a porta de saída para
 * as respostas HTTP.
 *
 * Responsabilidades do Controller:
 * - Receber requisições HTTP (GET, POST, PUT, DELETE, etc.)
 * - Extrair dados da requisição (body, params, query, headers)
 * - Delegar o processamento ao Service
 * - Retornar a resposta HTTP adequada
 * - NÃO deve conter lógica de negócio (isso é responsabilidade do Service)
 * - NÃO deve acessar o banco de dados diretamente (isso é responsabilidade do Repository)
 *
 * Fluxo:
 * HTTP Request -> Controller -> Service -> Repository -> Banco de Dados
 * Banco de Dados -> Repository -> Service -> Controller -> HTTP Response
 *
 * Endpoints disponíveis:
 * POST   /api/orders        - Cria um novo pedido
 * GET    /api/orders        - Lista todos os pedidos
 * GET    /api/orders/:id    - Busca um pedido específico pelo ID
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { OrdersService } from '../services/orders.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { Order } from '../entities/order.entity';

/**
 * @Controller('orders') define o prefixo de rota para este controller.
 * Combinado com o prefixo global 'api' definido no main.ts,
 * todas as rotas aqui ficam disponíveis em /api/orders.
 */
@Controller('orders')
export class OrdersController {
  constructor(
    /**
     * Injeção de Dependência: O NestJS injeta automaticamente a instância
     * do OrdersService. O controller não sabe como o service é criado,
     * apenas usa a interface pública dele.
     */
    private readonly ordersService: OrdersService,
  ) {}

  /**
   * POST /api/orders
   *
   * Cria um novo pedido.
   *
   * @Body() extrai o corpo da requisição HTTP e o converte para o tipo CreateOrderDto.
   * O ValidationPipe (configurado no main.ts) valida automaticamente o DTO
   * antes de este método ser executado. Se a validação falhar, retorna HTTP 400.
   *
   * @HttpCode(HttpStatus.CREATED) define que a resposta de sucesso será HTTP 201 Created
   * em vez do padrão HTTP 200 OK.
   *
   * @param createOrderDto - Dados validados do novo pedido
   * @returns Promise<Order> - Pedido criado com ID e timestamps
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.ordersService.create(createOrderDto);
  }

  /**
   * GET /api/orders
   *
   * Retorna a lista de todos os pedidos.
   * Resposta padrão HTTP 200 OK (não precisamos usar @HttpCode aqui).
   *
   * @returns Promise<Order[]> - Lista de todos os pedidos
   */
  @Get()
  async findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }

  /**
   * GET /api/orders/:id
   *
   * Busca um pedido específico pelo seu ID (UUID).
   *
   * @Param('id') extrai o parâmetro de rota ":id" da URL.
   * Por exemplo, em GET /api/orders/abc-123, o id será "abc-123".
   *
   * Se o pedido não for encontrado, o service lança NotFoundException
   * que é automaticamente convertida pelo NestJS em HTTP 404 Not Found.
   *
   * @param id - UUID do pedido
   * @returns Promise<Order> - Pedido encontrado
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Order> {
    return this.ordersService.findById(id);
  }
}
