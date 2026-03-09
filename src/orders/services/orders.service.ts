/**
 * orders.service.ts
 *
 * Serviço responsável por toda a lógica de negócio relacionada aos pedidos.
 *
 * Na arquitetura em camadas, o Service é a camada intermediária entre
 * o Controller (que recebe as requisições HTTP) e o Repository (que acessa o banco).
 *
 * Responsabilidades do Service:
 * - Aplicar regras de negócio (ex: cálculo do valor total do pedido)
 * - Orquestrar chamadas ao repositório
 * - Lançar exceções de negócio quando necessário
 * - NÃO deve conter lógica de banco de dados (isso é responsabilidade do Repository)
 * - NÃO deve conter lógica de HTTP/requisição (isso é responsabilidade do Controller)
 *
 * Fluxo:
 * Controller recebe requisição -> Service aplica regras de negócio -> Repository acessa o banco
 *
 * @Injectable() permite que o NestJS gerencie o ciclo de vida deste serviço
 * e o injete nos controllers ou outros serviços que precisem dele.
 */

import { Injectable } from '@nestjs/common';
import { Order } from '../entities/order.entity';
import { OrdersRepository } from '../repositories/orders.repository';
import { CreateOrderDto } from '../dto/create-order.dto';
import { LoggerService } from '../../common/logger/logger.service';

@Injectable()
export class OrdersService {
  constructor(
    /**
     * Injeção de Dependência: O NestJS injeta automaticamente as instâncias
     * de OrdersRepository e LoggerService aqui.
     * Não precisamos usar "new OrdersRepository()" manualmente.
     * Isso facilita testes unitários pois podemos substituir as dependências por mocks.
     */
    private readonly ordersRepository: OrdersRepository,
    private readonly logger: LoggerService,
  ) {}

  /**
   * Retorna a lista de todos os pedidos.
   * Delega diretamente ao repositório pois não há regra de negócio complexa aqui.
   *
   * @returns Promise<Order[]> - Lista de pedidos
   */
  async findAll(): Promise<Order[]> {
    this.logger.log('Buscando todos os pedidos', OrdersService.name);
    return this.ordersRepository.findAll();
  }

  /**
   * Busca um pedido específico pelo ID.
   * O repositório já lança NotFoundException se não encontrado.
   *
   * @param id - UUID do pedido
   * @returns Promise<Order> - Pedido encontrado
   */
  async findById(id: string): Promise<Order> {
    this.logger.log(`Buscando pedido com ID: ${id}`, OrdersService.name);
    return this.ordersRepository.findById(id);
  }

  /**
   * Cria um novo pedido aplicando a regra de negócio de cálculo do valor total.
   *
   * Regra de negócio: O valor total é calculado multiplicando a quantidade
   * pelo preço unitário de cada item e somando todos os valores.
   * Esta lógica pertence ao Service, não ao Controller nem ao Repository.
   *
   * @param createOrderDto - Dados validados do novo pedido
   * @returns Promise<Order> - Pedido criado com ID gerado pelo banco
   */
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    this.logger.log(
      `Criando novo pedido para: ${createOrderDto.customerName}`,
      OrdersService.name,
    );

    // Regra de negócio: calcula o valor total do pedido
    const totalAmount = this.calculateTotal(createOrderDto);

    // Delega a persistência ao repositório
    const order = await this.ordersRepository.create(createOrderDto, totalAmount);

    this.logger.log(
      `Pedido criado com sucesso. ID: ${order.id}`,
      OrdersService.name,
    );

    return order;
  }

  /**
   * Calcula o valor total do pedido somando (quantidade * preço unitário) de cada item.
   *
   * Este método é privado pois é um detalhe de implementação do Service.
   * Separar em um método próprio facilita a leitura e os testes unitários.
   *
   * @param createOrderDto - DTO com os itens do pedido
   * @returns number - Valor total calculado
   */
  private calculateTotal(createOrderDto: CreateOrderDto): number {
    return createOrderDto.items.reduce((total, item) => {
      return total + item.quantity * item.unitPrice;
    }, 0);
  }
}
