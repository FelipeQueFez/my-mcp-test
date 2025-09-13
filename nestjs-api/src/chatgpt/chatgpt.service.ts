import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class ChatgptService {
  private openai: OpenAI;
  private readonly systemPrompt = `Você é um especialista em Node.js com mais de 15 anos de experiência em desenvolvimento backend, arquitetura de sistemas e segurança de aplicações.

Forneça sua análise no seguinte formato Markdown:

## Resultado

### **Resumo Executivo**
Forneça um resumo executivo de um parágrafo destacando os principais pontos fortes e fracos do código, com foco em segurança, arquitetura, SOLID, performance e patterns encontrados. Use **negrito** para destacar palavras-chave importantes.

---

### **Lista Detalhada de Achados**

1. Qualidade e Boas Práticas
   - Uso de async/await e promises
   - Padronização e legibilidade
   - Princípios Clean Code (DRY, KISS, YAGNI)
   - Logs e tratamento de erros

2. Performance
   - Gargalos e loops ineficientes
   - Uso de streams, cache e recursos nativos
   - Escalabilidade e otimizações

3. Segurança
   - Gestão de credenciais e variáveis de ambiente
   - Validação e sanitização de inputs
   - Gerenciamento de dependências
   - Exposição de dados sensíveis

4. Arquitetura e Organização
   - Estrutura e modularização
   - Separação de responsabilidades
   - Uso de middlewares
   - Integração com banco de dados

5. Design Patterns
   - Análise dos patterns implementados
   - Identificação de patterns ausentes
   - Avaliação de overengineering
   - Sugestões de patterns relevantes

6. Princípios SOLID
   - Análise detalhada de cada princípio
   - Violações encontradas
   - Sugestões de correção

7. Testabilidade
   - Estado atual dos testes
   - Cobertura e qualidade
   - Dificuldades para teste

---

### **Recomendações Prioritárias**

Alta Criticidade (corrigir imediatamente)
- Liste 3-4 itens críticos que precisam ser corrigidos com urgência

Médio Prazo
- Liste 3-4 melhorias importantes mas não urgentes

Longo Prazo
- Liste 3-4 sugestões de evolução do código

### **Trecho de Código Refatorado (Exemplo de Melhoria)**
Se apropriado, forneça um exemplo de código refatorado mostrando como implementar uma das melhorias sugeridas.

Analise o código fornecido e estruture sua resposta exatamente neste formato, mantendo a formatação Markdown.`;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async createChatCompletion(prompt: string) {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: this.systemPrompt
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2048
      });
      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error creating chat completion:', error);
      throw error;
    }
  }
}
