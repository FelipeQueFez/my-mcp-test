# Servidor MCP e API NestJS - Integração Riachuelo

Este projeto demonstra a integração entre um servidor **MCP (Model Context Protocol)** e uma **API NestJS**, oferecendo ferramentas para revisão e geração de código através de um serviço customizado chamado "Riachuelo".

## Visão Geral da Arquitetura

O projeto é dividido em duas partes principais:

1.  **`MCP-SERVER/`**: Um servidor que implementa o Model Context Protocol. Ele atua como um gateway, expondo ferramentas que se comunicam com a API NestJS para executar tarefas complexas.
2.  **`nestjs-api/`**: Uma API web construída com o framework NestJS, que contém a lógica de negócio para interagir com os serviços de código (como o `chatgpt/completions` e `chatgpt/code-generation`).

---

## Conceitos Fundamentais

### Model Context Protocol (MCP)

O **Model Context Protocol (MCP)** é um padrão aberto projetado para facilitar a comunicação entre modelos de linguagem (LLMs) e serviços externos, conhecidos como "ferramentas". Ele cria um contrato claro para que os modelos possam descobrir e interagir com APIs de forma estruturada e segura.

Para saber mais, consulte a [documentação oficial do Model Context Protocol](https://microsoft.github.io/model-context-protocol/).

### Ferramentas (Tools)

No ecossistema MCP, uma **ferramenta** é uma função que o modelo pode invocar para realizar uma ação. Neste projeto, as ferramentas delegam a lógica para a API NestJS.

-   **Ferramenta Implementada: `riachuelo_code_review`**
    -   **Objetivo**: Envia um prompt (geralmente um trecho de código) para análise e recebe uma revisão como resposta.
    -   **Endpoint da API**: `http://localhost:3000/chatgpt/completions`

-   **Ferramenta Implementada: `riachuelo_code_generator`**
    -   **Objetivo**: Gera código a partir de requisitos não-técnicos, seguindo os padrões "Riachuelo".
    -   **Endpoint da API**: `http://localhost:3000/chatgpt/code-generation`

---

## Como Executar os Servidores

Para interagir com o projeto, você precisará executar o servidor MCP e a API NestJS separadamente.

### 1. Executando o Servidor MCP

O servidor MCP é responsável por expor as ferramentas `riachuelo_*`.

1.  Navegue até o diretório do servidor MCP:
    ```bash
    cd MCP-SERVER
    ```
2.  Instale as dependências (se for a primeira vez):
    ```bash
    npm install
    ```
3.  Inicie o servidor:
    ```bash
    node index.js
    ```
    O servidor começará a escutar por conexões via `stdio` e informará as ferramentas disponíveis.

### 2. Executando a API NestJS

A API NestJS é o backend que processa as solicitações das ferramentas.

1.  Navegue até o diretório da API:
    ```bash
    cd nestjs-api
    ```
2.  Instale as dependências (se for a primeira vez):
    ```bash
    npm install
    ```
3.  Inicie a API em modo de desenvolvimento:
    ```bash
    npm run start:dev
    ```
    A API estará disponível em `http://localhost:3000`.

### 3. Inspecionando o Servidor MCP

Para testar e interagir com o servidor MCP, você pode usar o **MCP Inspector**.

1.  Com o servidor MCP (`node index.js`) em execução, abra um **novo terminal**.
2.  Execute o MCP Inspector:
    ```bash
    npx @modelcontextprotocol/inspector
    ```
3.  Acesse a interface do Inspector no seu navegador (geralmente em **`http://localhost:6274`**) para interagir com as ferramentas `riachuelo_code_review` e `riachuelo_code_generator`.

---

## Documentação de Referência

-   **Model Context Protocol (MCP)**: [Especificação e Documentação](https://microsoft.github.io/model-context-protocol/)
-   **NestJS**: [Documentação Oficial](https://docs.nestjs.com/)
-   **Axios (HTTP Client)**: [Documentação do Axios](https://axios-http.com/docs/intro)
