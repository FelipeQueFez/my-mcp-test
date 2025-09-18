import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import axios from 'axios';

// Create an MCP server
const server = new McpServer({
    name: "riachuelo_mcp_server",
    version: "1.0.0"
});

server.registerTool(
    "riachuelo_code_review",
    {
        title: "Chat with Riachuelo",
        description: "Sends a prompt to the NestJS API and gets a response from Custom API.",
        inputSchema: {
            prompt: z.string().describe("The prompt to send to Riachuelo.")
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

server.registerTool(
    "riachuelo_code_generator",
    {
        title: "Riachuelo Code Generator",
        description: "Generates code from non-technical requirements using the Riachuelo standards.",
        inputSchema: {
            prompt: z.string().describe("The non-technical requirements to generate code from.")
        }
    },
    async ({ prompt }) => {
        try {
            const response = await axios.post('http://localhost:3000/chatgpt/code-generation', { prompt });
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
                        text: "Invalid response format from the code generation service"
                    }]
                };
            }
        } catch (error) {
            console.error('Error communicating with NestJS API for code generation:', error);
            return {
                content: [{
                    type: "text",
                    text: "Sorry, I couldn't connect to the code generation service."
                }]
            };
        }
    }
);

// Start receiving messages on stdin and sending messages on stdout
console.error('Iniciando servidor MCP...');
const transport = new StdioServerTransport();

try {
    await server.connect(transport);
    console.error('Servidor MCP iniciado com sucesso!');
    console.error('Ferramentas disponíveis:');
    console.error('- riachuelo_code_review');
    console.error('- riachuelo_code_generator');
} catch (error) {
    console.error('Erro ao iniciar o servidor:', error);
    process.exit(1);
}