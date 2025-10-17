# API Reference - Api Endpoints das Taxonomies

## Base URL

```markdown
http://localhost:3333/api

```

## Endpoints das Taxonomies

### Endpoint 01 - Listar Taxonomies para Menu

Buscar estrutura hierárquica de Taxonomies

- **Método**: `POST`
- **Endpoint**: `/taxonomy/v2/taxonomy-find-menu`
- **Headers**: `Authorization: Bearer {API_KEY}`

 **Body**:

```json
{
  "pe_app_id": 1,
  "pe_system_client_id": 1,
  "pe_store_id": 1,

  "pe_organization_id": "ORG_12345",
  "pe_member_id": "MBR_67890",
  "pe_user_id": "USR_54321",

  "pe_person_id": 29014,
  "pe_id_tipo": 1,
  "pe_parent_id": 0
}

```

**Parâmetros do Body:**

- `pe_app_id`: (valor da variável de ambiente APP_ID)
- `pe_system_client_id`:(valor da variável de ambiente SYSTEM_CLIENT_ID)
- `pe_store_id`: (valor da variável de ambiente STORE_ID)

- `pe_organization_id`:(valor da variável de ambiente ORGANIZATION_ID)
- `pe_member_id`: (valor da variável de ambiente MBR_67890)
- `pe_user_id`: ID do usuário logado (vem do login)

- `pe_person_id`: 29014 (fixo)
- `pe_id_tipo`: 1 (fixo)
- `pe_parent_id`: 0 ( valor 0 para raiz da árvore)

- **Response**:

```json
{
    "statusCode": 100200,
    "message": "Cadastro Carregados com sucesso",
    "recordId": 825,
    "data": [
        [
            {
                "ID_TAXONOMY": 825,
                "PARENT_ID": 0,
                "TAXONOMIA": "A CLASSIFICAR",
                "PATH_IMAGEM": null,
                "SLUG": null,
                "LEVEL": 1,
                "ORDEM": 0,
                "ID_IMAGEM": null,
                "QT_RECORDS": null
            },
            ....
    ],
    {
      "fieldCount": 0,
      "affectedRows": 0,
      "insertId": 0,
      "info": "",
      "serverStatus": 34,
      "warningStatus": 0,
      "changedRows": 0
    }
  ],
  "quantity": 179,
  "info1": ""
}

```


### Endpoint 02 - Listar Taxonomies 

Lista as categorias cadastradas

- **Método**: `POST`
- **Endpoint**: `/taxonomy/v2/taxonomy-find`
- **Headers**: `Authorization: Bearer {API_KEY}`

 **Body**:

```json
{
  "pe_app_id": 1,
  "pe_system_client_id": 1,
  "pe_store_id": 1,

  "pe_organization_id": "ORG_12345",
  "pe_member_id": "MBR_67890",
  "pe_user_id": "USR_54321",

  "pe_person_id": 29014,

  "pe_id_parent": 0,
  "pe_id_taxonomy": 0,
  "pe_taxonomia": "",

  "pe_flag_inativo": 0,

  "pe_qt_registros": 20,
  "pe_pagina_id": 1,
  "pe_coluna_id": 2,
  "pe_ordem_id": 1
}

```

**Parâmetros do Body:**

- `pe_app_id`: (valor da variável de ambiente APP_ID)
- `pe_system_client_id`:(valor da variável de ambiente SYSTEM_CLIENT_ID)
- `pe_store_id`: (valor da variável de ambiente STORE_ID)

- `pe_organization_id`:(valor da variável de ambiente ORGANIZATION_ID)
- `pe_member_id`: (valor da variável de ambiente MBR_67890)
- `pe_user_id`: ID do usuário logado (vem do login)

- `pe_person_id`: 29014 (fixo)

- `pe_id_parent`:  valor 0 para raiz da árvore
- `pe_id_taxonomy`:  pode filtrar por ID da categoria
- `pe_taxonomia`: pode filtrar por nome da categoria

- `pe_flag_inativo`: valor 0 todos - valor 1 inativos

- `pe_qt_registros`: quantidade de registros por página padrão 20
- `pe_pagina_id`: a página atual padrão 1
- `pe_coluna_id`: coluna para ordenação padrão 2
- `pe_ordem_id`: ordem padrão 1



- **Response**:

```json

{
    "statusCode": 100200,
    "message": "Produtos carregado com sucesso",
    "recordId": 3360,
    "data": [
        [
            {
                "ID_TAXONOMY": 3360,
                "PARENT_ID": 187,
                "TAXONOMIA": "COMPUTADOR E NOTEBOOK",
                "ANOTACOES": null,
                "PATH_IMAGEM": null,
                "SLUG": null,
                "LEVEL": null,
                "ORDEM": 0,
                "ID_IMAGEM": null,
                "QT_RECORDS": null,
                "META_TITLE": null,
                "META_DESCRIPTION": null
            },
            ....
    ],
    {
      "fieldCount": 0,
      "affectedRows": 0,
      "insertId": 0,
      "info": "",
      "serverStatus": 34,
      "warningStatus": 0,
      "changedRows": 0
    }
  ],
  "quantity": 179,
  "info1": ""
}

```


### Endpoint 03 - Detalhes da Categoria

Carregar informações específicas de uma categoria

- **Método**: `POST`
- **Endpoint**: `/taxonomy/v2/taxonomy-find-id`
- **Headers**: `Authorization: Bearer {API_KEY}`

 **Body**:


```json
{
  "pe_app_id": 1,
  "pe_system_client_id": 1,
  "pe_store_id": 1,

  "pe_organization_id": "ORG_12345",
  "pe_member_id": "MBR_67890",
  "pe_user_id": "USR_54321",

  "pe_person_id": 29014,
  "pe_id_taxonomy": 3406,
  "pe_slug_taxonomy": ""
}

```

**Parâmetros do Body:**

- `pe_app_id`: (valor da variável de ambiente APP_ID)
- `pe_system_client_id`:(valor da variável de ambiente SYSTEM_CLIENT_ID)
- `pe_store_id`: (valor da variável de ambiente STORE_ID)

- `pe_organization_id`:(valor da variável de ambiente ORGANIZATION_ID)
- `pe_member_id`: (valor da variável de ambiente MBR_67890)
- `pe_user_id`: ID do usuário logado (vem do login)

- `pe_person_id`: 29014 (fixo)
- `pe_id_taxonomy`: informado pelo usuário
- `pe_slug_taxonomy`: : informado pelo usuário, pode ser vazio



- **Response**:

```json

{
    "statusCode": 100200,
    "message": "Cadastro Carregados com sucesso",
    "recordId": 3398,
    "data": [
        [
            {
                "ID_TAXONOMY": 3398,
                "PARENT_ID": 3395,
                "TAXONOMIA": "GARRAFA",
                "ANOTACOES": null,
                "PATH_IMAGEM": null,
                "SLUG": null,
                "LEVEL": null,
                "ORDEM": 0,
                "ID_IMAGEM": null,
                "QT_RECORDS": null,
                "META_TITLE": null,
                "META_DESCRIPTION": null
            }
        ],
        [
            {
                "sp_return_id": 1,
                "sp_message": "Cadastro Carregados com sucesso",
                "sp_error_id": 0
            }
        ],
        {
            "fieldCount": 0,
            "affectedRows": 0,
            "insertId": 0,
            "info": "",
            "serverStatus": 2,
            "warningStatus": 0,
            "changedRows": 0
        }
    ],
    "quantity": 1,
    "info1": ""
}

```

### Endpoint 04 - Adicinar Taxonomy


Adicione uma nova categoria


- **Método**: `POST`
- **Endpoint**: `/taxonomy/v2/taxonomy-create`
- **Headers**: `Authorization: Bearer {API_KEY}`

 **Body**:


```json
{
  "pe_app_id": 1,
  "pe_system_client_id": 1,
  "pe_store_id": 1,

  "pe_organization_id": "ORG_12345",
  "pe_member_id": "MBR_67890",
  "pe_user_id": "USR_54321",

  "pe_person_id": 29014,

  "pe_id_tipo": 2,
  "pe_parent_id": 0,
  "pe_taxonomia": "Electronics",
  "pe_slug": "electronics-category",
  "pe_level": 1
}

```

**Parâmetros do Body:**

- `pe_app_id`: (valor da variável de ambiente APP_ID)
- `pe_system_client_id`:(valor da variável de ambiente SYSTEM_CLIENT_ID)
- `pe_store_id`: (valor da variável de ambiente STORE_ID)

- `pe_organization_id`:(valor da variável de ambiente ORGANIZATION_ID)
- `pe_member_id`: (valor da variável de ambiente MBR_67890)
- `pe_user_id`: ID do usuário logado (vem do login)

- `pe_person_id`: 29014 (fixo)

- `pe_id_tipo`: tipo da categoria - padrão 1 (fixo)
- `pe_parent_id`: valor 0 para raiz da árvore
- `pe_taxonomia`: Nome da categoria
- `pe_slug_taxonomy`:  slug da categoria
- `pe_level`: nivel da categoria

- **Response**:

```json

{
    "statusCode": 100200,
    "message": "Registro adicionado com sucesso",
    "recordId": 3409,
    "data": [
        [
            {
                "sp_return_id": 3409,
                "sp_message": "Registro adicionado com sucesso",
                "sp_error_id": 0
            }
        ],
        {
            "fieldCount": 0,
            "affectedRows": 2,
            "insertId": 0,
            "info": "",
            "serverStatus": 34,
            "warningStatus": 0,
            "changedRows": 0
        }
    ],
    "quantity": 1,
    "info1": ""
}

```

### Endpoint 05 - update Taxonomy


Atualiza uma categoria existente

- **Método**: `POST`
- **Endpoint**: `/taxonomy/v2/taxonomy-update`
- **Headers**: `Authorization: Bearer {API_KEY}`

 **Body**:


```json
{
  "pe_app_id": 1,
  "pe_system_client_id": 1,
  "pe_store_id": 1,
  "pe_organization_id": "ORG_12345",
  "pe_member_id": "MBR_67890",
  "pe_user_id": "USR_54321",
  "pe_person_id": 999,

  "pe_id_taxonomy": 3408,
  "pe_parent_id": 0,
  "pe_taxonomia": "Electronics",

  "pe_slug": "electronics-category",
  "pe_path_imagem": "/images/categories/electronics.jpg",
  "pe_ordem": 1,

  "pe_meta_title": "Electronics Category - Best Products",
  "pe_meta_description": "Discover our wide range of electronic products including smartphones, laptops, and accessories.",
  "pe_inativo": 0,

  "pe_info": "Category for all electronic products"
}

```

**Parâmetros do Body:**

- `pe_app_id`: (valor da variável de ambiente APP_ID)
- `pe_system_client_id`:(valor da variável de ambiente SYSTEM_CLIENT_ID)
- `pe_store_id`: (valor da variável de ambiente STORE_ID)

- `pe_organization_id`:(valor da variável de ambiente ORGANIZATION_ID)
- `pe_member_id`: (valor da variável de ambiente MBR_67890)
- `pe_user_id`: ID do usuário logado (vem do login)

- `pe_person_id`: 29014 (fixo)

- `pe_id_taxonomy`: id da categoria a ser atualizada
- `pe_parent_id`:  valor 0 para raiz da árvore
- `pe_taxonomia`: Nome da categoria

- `pe_slug`:  slug da categoria
- `pe_path_imagem`:  path da imagem da categoria
- `pe_ordem`:  ordem da categoria


- `pe_meta_title`:  meta title para a página da categoria
- `pe_meta_description`:  meta description para a página da categoria

- `pe_inativo`: 0 ativo e 1 inativo


- `pe_info`: Informações adicionais da categoria


- **Response**:

```json

{
    "statusCode": 100200,
    "message": "Cadastro atualizado com sucesso",
    "recordId": 1,
    "data": [
        [
            {
                "sp_return_id": 1,
                "sp_message": "Cadastro atualizado com sucesso",
                "sp_error_id": 0
            }
        ],
        {
            "fieldCount": 0,
            "affectedRows": 3,
            "insertId": 0,
            "info": "",
            "serverStatus": 2,
            "warningStatus": 0,
            "changedRows": 0
        }
    ],
    "quantity": 1,
    "info1": ""
}

```

### Endpoint 06 - exclui Taxonomy


deleta uma categoria existente

- **Método**: `POST`
- **Endpoint**: `/taxonomy/v2/taxonomy-delete`
- **Headers**: `Authorization: Bearer {API_KEY}`

 **Body**:


```json
{
  "pe_app_id": 1,
  "pe_system_client_id": 1,
  "pe_store_id": 1,
  "pe_organization_id": "ORG_12345",
  "pe_member_id": "MBR_67890",
  "pe_user_id": "USR_54321",
  "pe_person_id": 999,

  "pe_id_taxonomy": 3408,

}

```

**Parâmetros do Body:**

- `pe_app_id`: (valor da variável de ambiente APP_ID)
- `pe_system_client_id`:(valor da variável de ambiente SYSTEM_CLIENT_ID)
- `pe_store_id`: (valor da variável de ambiente STORE_ID)

- `pe_organization_id`:(valor da variável de ambiente ORGANIZATION_ID)
- `pe_member_id`: (valor da variável de ambiente MBR_67890)
- `pe_user_id`: ID do usuário logado (vem do login)

- `pe_person_id`: 29014 (fixo)

- `pe_id_taxonomy`: id da categoria a ser excluida



- **Response**:

```json

{
    "statusCode": 100200,
    "message": "Registro deletado com sucesso",
    "recordId": 3408,
    "data": [
        [
            {
                "sp_return_id": 3408,
                "sp_message": "Registro deletado com sucesso",
                "sp_error_id": 0
            }
        ],
        {
            "fieldCount": 0,
            "affectedRows": 3,
            "insertId": 0,
            "info": "",
            "serverStatus": 2,
            "warningStatus": 0,
            "changedRows": 0
        }
    ],
    "quantity": 1,
    "info1": ""
}

```