import { registerAs } from '@nestjs/config';

// Centraliza configuracoes do banco para evitar valores espalhados no codigo.
export default registerAs('database', () => ({
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME ?? 'orders_db',
}));
