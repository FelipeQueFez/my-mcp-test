import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import axios from 'axios';

// Create an MCP server
const server = new McpServer({
    name: "friendly-greeter",
    version: "1.0.0"
});

// Add a greeting tool with input validation
server.registerTool(
    "friendly_greeting",
    {
        title: "Friendly Greeting Tool", 
        description: "Retorna uma saudação amigável com data e hora atual",
        inputSchema: { 
            name: z.string().describe("Nome da pessoa para cumprimentar"),
            language: z.enum(["en", "pt", "es"]).optional().default("pt").describe("Idioma da saudação (en, pt, ou es)")
        }
    },
    async ({ name, language }) => {
        const now = new Date();
        const hora = now.getHours();
        
        const periodos = {
            pt: {
                manha: "bom dia",
                tarde: "boa tarde",
                noite: "boa noite"
            },
            en: {
                manha: "good morning",
                tarde: "good afternoon",
                noite: "good evening"
            },
            es: {
                manha: "buenos días",
                tarde: "buenas tardes",
                noite: "buenas noches"
            }
        };

        let periodoDia;
        if (hora >= 5 && hora < 12) {
            periodoDia = periodos[language].manha;
        } else if (hora >= 12 && hora < 18) {
            periodoDia = periodos[language].tarde;
        } else {
            periodoDia = periodos[language].noite;
        }

        const locales = {
            pt: 'pt-BR',
            en: 'en-US',
            es: 'es-ES'
        };

        const greetings = {
            pt: `Olá ${name}, ${periodoDia}! 🌟\n\nÉ um grande prazer te encontrar aqui no dia ${now.toLocaleDateString(locales[language])} às ${now.toLocaleTimeString(locales[language])}.\nEspero que você esteja tendo um dia incrível! 🌈✨`,
            en: `Hello ${name}, ${periodoDia}! 🌟\n\nIt's a great pleasure to meet you here on ${now.toLocaleDateString(locales[language])} at ${now.toLocaleTimeString(locales[language])}.\nI hope you're having an amazing day! 🌈✨`,
            es: `¡Hola ${name}, ${periodoDia}! 🌟\n\nEs un gran placer encontrarte aquí el día ${now.toLocaleDateString(locales[language])} a las ${now.toLocaleTimeString(locales[language])}.\n¡Espero que estés teniendo un día increíble! 🌈✨`
        };

        return {
            content: [{ 
                type: "text", 
                text: greetings[language]
            }]
        };
    }
);

server.registerTool(
    "chat_with_gpt",
    {
        title: "Chat with GPT",
        description: "Sends a prompt to the NestJS API and gets a response from ChatGPT.",
        inputSchema: {
            prompt: z.string().describe("The prompt to send to ChatGPT.")
        }
    },
    async ({ prompt }) => {
        try {
            const response = await axios.post('http://localhost:3000/chatgpt/completions', { prompt });
            // The response.data contains the content object directly
            if (response.data && response.data.content) {
                return {
                    content: [{
                        type: "text",
                        text: response.data.content
                    }]
                };
            } else {
                return {
                    content: [{
                        type: "text",
                        text: "Invalid response format from the chat service"
                    }]
                };
            }
        } catch (error) {
            console.error('Error communicating with NestJS API:', error);
            return {
                content: [{
                    type: "text",
                    text: "Sorry, I couldn't connect to the chat service."
                }]
            };
        }
    }
);

// Add a dynamic greeting resource
server.registerResource(
    "greeting",
    new ResourceTemplate("greeting://{name}/{language?}", { list: undefined }),
    {
        title: "Greeting Resource",
        description: "Gerador dinâmico de saudações"
    },
    async (uri, { name, language = "pt" }) => {
        const now = new Date();
        const hora = now.getHours();
        
        const periodos = {
            pt: {
                manha: "bom dia",
                tarde: "boa tarde",
                noite: "boa noite"
            },
            en: {
                manha: "good morning",
                tarde: "good afternoon",
                noite: "good evening"
            },
            es: {
                manha: "buenos días",
                tarde: "buenas tardes",
                noite: "buenas noches"
            }
        };

        let periodoDia;
        if (hora >= 5 && hora < 12) {
            periodoDia = periodos[language].manha;
        } else if (hora >= 12 && hora < 18) {
            periodoDia = periodos[language].tarde;
        } else {
            periodoDia = periodos[language].noite;
        }

        const locales = {
            pt: 'pt-BR',
            en: 'en-US',
            es: 'es-ES'
        };

        const greetings = {
            pt: `Olá ${name}, ${periodoDia}! 🌟\n\nÉ um grande prazer te encontrar aqui no dia ${now.toLocaleDateString(locales[language])} às ${now.toLocaleTimeString(locales[language])}.\nEspero que você esteja tendo um dia incrível! 🌈✨`,
            en: `Hello ${name}, ${periodoDia}! 🌟\n\nIt's a great pleasure to meet you here on ${now.toLocaleDateString(locales[language])} at ${now.toLocaleTimeString(locales[language])}.\nI hope you're having an amazing day! 🌈✨`,
            es: `¡Hola ${name}, ${periodoDia}! 🌟\n\nEs un gran placer encontrarte aquí el día ${now.toLocaleDateString(locales[language])} a las ${now.toLocaleTimeString(locales[language])}.\n¡Espero que estés teniendo un día increíble! 🌈✨`
        };

        return {
            contents: [{
                uri: uri.href,
                text: greetings[language]
            }]
        };
    }
);

// Start receiving messages on stdin and sending messages on stdout
console.error('Iniciando servidor MCP...');
const transport = new StdioServerTransport();

try {
    await server.connect(transport);
    console.error('Servidor MCP iniciado com sucesso!');
    console.error('Ferramentas disponíveis:');
    console.error('- friendly_greeting');
} catch (error) {
    console.error('Erro ao iniciar o servidor:', error);
    process.exit(1);
}