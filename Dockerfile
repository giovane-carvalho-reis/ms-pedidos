# ============================================================
# Dockerfile - ms-pedidos
# ============================================================
# Imagem multi-stage para otimizar o tamanho da imagem final.
# Multi-stage build: compilamos o TypeScript na primeira etapa
# e apenas copiamos os arquivos JS compilados para a imagem final.
# Isso garante que ferramentas de desenvolvimento (ts-node, etc.)
# não sejam incluídas na imagem de produção.
# ============================================================

# ===================
# STAGE 1: Builder
# ===================
# Usamos a imagem oficial do Node.js LTS (Long Term Support)
# A variante "alpine" é menor e mais segura (sem pacotes desnecessários)
FROM node:20-alpine AS builder

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia apenas os arquivos de dependências primeiro.
# Esta ordem é importante para aproveitar o cache do Docker:
# se o package.json não mudou, o Docker reutiliza a camada de instalação.
COPY package*.json ./

# Instala todas as dependências (incluindo devDependencies para compilar)
RUN npm ci

# Copia o restante do código-fonte
COPY . .

# Compila o TypeScript para JavaScript
RUN npm run build

# ===================
# STAGE 2: Production
# ===================
FROM node:20-alpine AS production

# Metadados da imagem
LABEL maintainer="ms-pedidos"
LABEL description="Microserviço de Pedidos - E-commerce"

# Cria um usuário sem privilégios de root para maior segurança
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001

WORKDIR /app

# Copia apenas as dependências de produção (sem devDependencies)
COPY package*.json ./
RUN npm ci --only=production

# Copia os arquivos compilados do stage anterior
COPY --from=builder /app/dist ./dist

# Muda a propriedade dos arquivos para o usuário sem privilégios
RUN chown -R nestjs:nodejs /app

# Usa o usuário sem privilégios de root
USER nestjs

# Expõe a porta que o serviço usa
EXPOSE 3000

# Define variável de ambiente de produção
ENV NODE_ENV=production

# Comando para iniciar a aplicação em produção
# Executa diretamente o JavaScript compilado (sem ts-node)
CMD ["node", "dist/main"]
