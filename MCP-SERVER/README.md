# MCP Server - Friendly Greeter

Este é um servidor MCP (Model Context Protocol) que implementa um serviço de saudações amigáveis em múltiplos idiomas. O servidor foi desenvolvido usando o SDK TypeScript do MCP e oferece tanto ferramentas quanto recursos.

## Funcionalidades

### 1. Ferramenta de Saudação (`friendly_greeting`)

Uma ferramenta que gera saudações personalizadas com as seguintes características:

- **Nome**: `friendly_greeting`
- **Descrição**: Retorna uma saudação amigável com data e hora atual
- **Parâmetros**:
  - `name` (obrigatório): Nome da pessoa para cumprimentar
  - `language` (opcional): Idioma da saudação (padrão: "pt")
    - Opções: "pt" (Português), "en" (Inglês), "es" (Espanhol)
- **Características**:
  - Saudação personalizada baseada no horário do dia
  - Data e hora formatadas de acordo com o idioma selecionado
  - Mensagem amigável com emojis

### 2. Recurso de Saudação Dinâmica

Um recurso que pode ser acessado via URI para obter saudações:

- **URI Template**: `greeting://{name}/{language?}`
- **Descrição**: Gerador dinâmico de saudações
- **Parâmetros na URI**:
  - `name`: Nome da pessoa
  - `language` (opcional): Idioma (pt, en, ou es)

## Como Integrar

### 1. Usando STDIO Transport (Linha de Comando)

```typescript
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

// Criar e configurar o cliente
const client = new Client({
  name: "example-client",
  version: "1.0.0"
});

// Conectar via STDIO
const transport = new StdioClientTransport({
  command: "node",
  args: ["index.js"]
});
await client.connect(transport);

// Chamar a ferramenta de saudação
const result = await client.callTool({
  name: "friendly_greeting",
  arguments: {
    name: "João",
    language: "pt"
  }
});

console.log(result.content[0].text);
```

### 2. Usando HTTP Transport (Web)

```typescript
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

// Criar e configurar o cliente
const client = new Client({
  name: "web-client",
  version: "1.0.0"
});

// Conectar via HTTP
const transport = new StreamableHTTPClientTransport(
  new URL("http://localhost:3000/mcp")
);
await client.connect(transport);

// Acessar o recurso de saudação
const resource = await client.readResource({
  uri: "greeting://Maria/pt"
});

console.log(resource.contents[0].text);
```

### 3. Usando MCP Inspector

1. Instale o MCP Inspector globalmente:
   ```bash
   npm install -g @modelcontextprotocol/inspector
   ```

2. Configure o arquivo `.mcp-inspector`:
   ```json
   {
     "servers": {
       "friendly-greeter": {
         "command": "node",
         "args": ["index.js"]
       }
     }
   }
   ```

3. Execute o MCP Inspector:
   ```bash
   mcp-inspector
   ```

4. Acesse a interface web do Inspector em http://localhost:6274

## Exemplos de Uso

### 1. Chamada da Ferramenta

```typescript
// Exemplo de chamada em português
const ptResult = await client.callTool({
  name: "friendly_greeting",
  arguments: {
    name: "Maria",
    language: "pt"
  }
});

// Exemplo de chamada em inglês
const enResult = await client.callTool({
  name: "friendly_greeting",
  arguments: {
    name: "John",
    language: "en"
  }
});

// Exemplo de chamada em espanhol
const esResult = await client.callTool({
  name: "friendly_greeting",
  arguments: {
    name: "Carlos",
    language: "es"
  }
});
```

### 2. Acesso ao Recurso

```typescript
// Acessar recurso em português
const ptResource = await client.readResource({
  uri: "greeting://Maria/pt"
});

// Acessar recurso em inglês
const enResource = await client.readResource({
  uri: "greeting://John/en"
});

// Acessar recurso em espanhol
const esResource = await client.readResource({
  uri: "greeting://Carlos/es"
});
```

## Notas de Implementação

- O servidor utiliza o Zod para validação de entrada
- As saudações são contextuais ao horário do dia (bom dia/boa tarde/boa noite)
- Suporte completo a internacionalização (i18n) para datas e mensagens
- Implementação de acordo com as mais recentes especificações do MCP
