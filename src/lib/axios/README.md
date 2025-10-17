# Configuração Axios - API REST com API_KEY

Este diretório contém toda a configuração do Axios para o projeto, adaptada para usar API_KEY em vez de tokens JWT.

## 📁 Estrutura

```
src/lib/axios/
├── index.ts                    # Exports principais e configuração
├── axios-client.ts            # Cliente para uso no frontend (Client Components)
├── server-axios-client.ts     # Cliente para uso no servidor (Server Components/API Routes)
├── base-api-service.ts        # Classe base para criar serviços
├── api-key-utils.ts           # Utilitários para gerenciar API_KEY
├── product-service-example.ts # Exemplo de implementação de serviço
└── README.md                  # Esta documentação
```

## 🔧 Configuração

### Variáveis de Ambiente

Adicione no seu arquivo `.env`:

```env
# API_KEY para autenticação (obrigatória)
API_KEY=sua_chave_api_aqui

# Base URL da API (opcional, padrão: http://localhost:3333/api)
API_BASE_URL=https://api.seudominio.com/api

# Para uso no frontend (opcional, se necessário)
NEXT_PUBLIC_API_KEY=sua_chave_publica_aqui
```

### Como a API_KEY é Enviada

- **POST/PUT/PATCH**: API_KEY é adicionada ao `body` da requisição
- **GET/DELETE**: API_KEY é adicionada aos `query parameters`

```javascript
// Exemplo POST
{
  "name": "Produto",
  "price": 100,
  "API_KEY": "sua_chave_aqui"
}

// Exemplo GET
GET /products?API_KEY=sua_chave_aqui&category=1
```

## 🚀 Como Usar

### 1. Client Components (Frontend)

```typescript
'use client';

import { axiosClient } from '@/lib/axios';

export default function MyComponent() {
  const fetchData = async () => {
    try {
      const response = await axiosClient.get('/products');
      console.log(response.data);
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  return <button onClick={fetchData}>Buscar Produtos</button>;
}
```

### 2. Server Components

```typescript
import { serverAxiosClient } from '@/lib/axios';

export default async function ServerComponent() {
  try {
    const response = await serverAxiosClient.get('/products');
    const products = response.data;

    return (
      <div>
        {products.map((product) => (
          <div key={product.id}>{product.name}</div>
        ))}
      </div>
    );
  } catch (error) {
    return <div>Erro ao carregar produtos</div>;
  }
}
```

### 3. API Routes

```typescript
// app/api/products/route.ts
import { serverAxiosClient } from '@/lib/axios';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await serverAxiosClient.get('/products');
    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar produtos' },
      { status: 500 }
    );
  }
}
```

### 4. Criando Serviços Customizados

```typescript
import { BaseApiService } from '@/lib/axios';

interface User {
  id: number;
  name: string;
  email: string;
}

class UserService extends BaseApiService {
  async getUsers(): Promise<User[]> {
    const response = await this.get<{ data: User[] }>('/users');
    return response.data || [];
  }

  async createUser(userData: Omit<User, 'id'>): Promise<User> {
    const response = await this.post<{ data: User }>('/users', userData);
    return response.data;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const response = await this.put<{ data: User }>(`/users/${id}`, userData);
    return response.data;
  }

  async deleteUser(id: number): Promise<boolean> {
    await this.delete(`/users/${id}`);
    return true;
  }
}

export const userService = new UserService();
```

### 5. Usando Hooks React

```typescript
'use client';

import { useApiCall } from '@/hooks/use-api';
import { userService } from '@/lib/services/user-service';

export default function UserList() {
  const { data: users, loading, error, execute } = useApiCall();

  const loadUsers = () => {
    execute(() => userService.getUsers());
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      <button onClick={loadUsers}>Carregar Usuários</button>
      {users?.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

## 🔍 Monitoramento e Debug

### Logs Automáticos

Em desenvolvimento, os clientes logam automaticamente:

```
🚀 [POST] /products     # Requisição enviada
✅ [200] /products      # Resposta recebida
❌ [404] /products      # Erro na requisição
```

### Verificação da API_KEY

```typescript
import { isApiKeyConfigured, warnIfApiKeyMissing } from '@/lib/axios';

// Verificar se está configurada
if (!isApiKeyConfigured()) {
  console.warn('API_KEY não configurada!');
}

// Log de aviso automático
warnIfApiKeyMissing();
```

## 🛡️ Tratamento de Erros

Os clientes tratam automaticamente:

- **400**: Requisição inválida
- **401**: API_KEY inválida ou ausente
- **403**: API_KEY sem permissões suficientes
- **404**: Endpoint não encontrado
- **429**: Rate limit excedido
- **500+**: Erros do servidor

## 📊 Performance

### Timeouts Configurados

- **Cliente (Frontend)**: 15 segundos
- **Servidor**: 30 segundos
- **Upload**: 60 segundos

### Cache Simples

Use o hook `useApiResource` para cache automático:

```typescript
const { executeWithCache, clearCache } = useApiResource();

// Executa com cache
const data = await executeWithCache('users', () => userService.getUsers());

// Limpa cache específico
clearCache('users');
```

## 🔄 Migração do JWT

Se você estava usando JWT antes, as principais mudanças são:

1. ✅ **API_KEY no body/params** em vez de header Authorization
2. ✅ **Sem lógica de refresh token**
3. ✅ **Sem armazenamento de token**
4. ✅ **Configuração mais simples**

## 🚨 Importante

- Nunca exponha a API_KEY no código cliente se ela for sensível
- Use `NEXT_PUBLIC_API_KEY` apenas se necessário para o frontend
- A API_KEY é automaticamente adicionada às requisições
- Sempre valide respostas da API no seu código