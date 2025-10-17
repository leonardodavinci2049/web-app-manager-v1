# API Reference - Especificações da API REST

## Base URL

```markdown
http://localhost:3333/api
```

## Estrutura Padrão

### 🔑 Códigos de Respostas

Todas as respostas seguem o padrão:

```json
{
  "statusCode": 100200,
  "message": "Informações processadas com sucesso",
  "recordId": "[ID do registro]",
  "data": ["[dados principais]", "[feedback/status]", "[metadata mysql]"],
  "quantity": "[quantidade de registros]",
  "info1": "[informação adicional]"
}
```

### 🔑 Códigos de Status

- `100200`: Sucesso
- `100400`: Erro de validação
- `100401`: Não autorizado
- `100404`: Não encontrado
- `100500`: Erro interno

---

### 🛡️ Autenticação e Segurança

Para endpoints protegidos, sempre incluir:

```markdown
Authorization: Bearer {API_KEY}
```

### Parâmetros Fixos

Em todas as requisições, usar:

```json

{
  "pe_app_id": valor da variável de ambiente APP_ID,
  "pe_system_client_id": valor da variável de ambiente SYSTEM_CLIENT_ID,
  "pe_store_id": valor da variável de ambiente STORE_ID,

  "pe_organization_id": "ORG_12345",
  "pe_member_id": "MBR_67890",
  "pe_user_id": "[ID do usuário logado]"

  "pe_person_id": 29014
}
```


**🚨 NUNCA:**
- Expor credenciais guest no client-side

## Api Endpoints


### Endpoints api-category-reference.md

- Para informações detalhadas sobre endpois de category, consulte: [api-category-reference](.github/api-category-reference.md)

