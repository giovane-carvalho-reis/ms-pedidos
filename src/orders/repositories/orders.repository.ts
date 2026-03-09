/**
 * orders.repository.ts
 *
 * Repositório responsável por toda a comunicação com o banco de dados
 * para a entidade Order (Pedido).
 *
 * Na arquitetura em camadas (Layered Architecture), o repositório é a camada
 * mais próxima do banco de dados. Ele encapsula as operações de persistência
 * e impede que a lógica de banco vaze para as camadas superiores (service, controller).
 *
 * Fluxo de chamada:
 * Controller -> Service -> Repository -> Banco de Dados (PostgreSQL via TypeORM)
 *
 * O TypeORM fornece o Repository<T> com métodos prontos para CRUD:
 * - find()    : busca múltiplos registros
 * - findOneBy(): busca um registro por critério
 * - save()    : cria ou atualiza um registro
 * - remove()  : remove um registro
 *
 * @Injectable() permite que este repositório seja injetado no OrdersService
 * via o sistema de Injeção de Dependência do NestJS.
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { CreateOrderDto } from '../dto/create-order.dto';

@Injectable()
export class OrdersRepository {
  constructor(
    /**
     * @InjectRepository(Order) injeta o repositório do TypeORM para a entidade Order.
     * O NestJS cuida de criar e gerenciar esta instância automaticamente.
     * Este é o padrão de Injeção de Dependência do NestJS para repositórios TypeORM.
     */
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  /**
   * Busca todos os pedidos cadastrados no banco de dados.
   * Ordena pelos mais recentes primeiro (created_at DESC).
   *
   * @returns Promise<Order[]> - Lista de todos os pedidos
   */
  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Busca um pedido específico pelo seu ID (UUID).
   * Lança NotFoundException se o pedido não for encontrado,
   * o que resulta automaticamente em uma resposta HTTP 404.
   *
   * @param id - UUID do pedido
   * @returns Promise<Order> - Pedido encontrado
   * @throws NotFoundException se o pedido não existir
   */
  async findById(id: string): Promise<Order> {
    const order = await this.orderRepository.findOneBy({ id });

    if (!order) {
      throw new NotFoundException(`Pedido com ID "${id}" não encontrado`);
    }

    return order;
  }

  /**
   * Cria e persiste um novo pedido no banco de dados.
   *
   * O TypeORM separa a criação do objeto em memória (create) da persistência
   * no banco (save). Isso permite manipular o objeto antes de salvar.
   *
   * @param createOrderDto - Dados validados do novo pedido
   * @param totalAmount - Valor total calculado pelo service
   * @returns Promise<Order> - Pedido criado com ID e timestamps preenchidos
   */
  async create(
    createOrderDto: CreateOrderDto,
    totalAmount: number,
  ): Promise<Order> {
    // Cria uma instância da entidade em memória (sem salvar no banco ainda)
    const order = this.orderRepository.create({
      customerName: createOrderDto.customerName,
      deliveryAddress: createOrderDto.deliveryAddress,
      items: createOrderDto.items,
      totalAmount,
    });

    // Persiste o registro no banco de dados e retorna o objeto com ID gerado
    return this.orderRepository.save(order);
  }
}
