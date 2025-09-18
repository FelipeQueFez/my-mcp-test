import { Controller, Post, Body } from '@nestjs/common';
import { ChatgptService } from './chatgpt.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChatResponseDto, CreateChatDto } from './dto/chat.dto';

@ApiTags('ChatGPT')
@Controller('chatgpt')
export class ChatgptController {
  constructor(private readonly chatgptService: ChatgptService) {}

  @Post('completions')
  @ApiOperation({
    summary: 'Create a chat completion',
    description: 'Sends a prompt to ChatGPT and receives a response',
  })
  @ApiResponse({
    status: 200,
    description: 'The chat completion response',
    type: ChatResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async createChatCompletion(
    @Body() dto: CreateChatDto,
  ): Promise<ChatResponseDto> {
    const content = await this.chatgptService.createChatCompletion(dto.prompt);
    return { content };
  }

  @Post('code-generation')
  @ApiOperation({
    summary: 'Generate code from requirements',
    description:
      'Sends non-technical requirements to ChatGPT and receives a code response',
  })
  @ApiResponse({
    status: 200,
    description: 'The generated code response',
    type: ChatResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async generateCodeFromRequirements(
    @Body() dto: CreateChatDto,
  ): Promise<ChatResponseDto> {
    // ETAPA 1: Gerar a especificação técnica a partir do pedido do usuário
    const technicalSpec =
      await this.chatgptService.generateTechnicalSpecification(dto.prompt);

    // Transformar o JSON da especificação em um prompt de texto detalhado
    const detailedPrompt = `
      Crie o seguinte recurso em NestJS com base nesta especificação:
      - Módulo: ${technicalSpec.module}
      - Controller (${technicalSpec.controller.fileName}):
        - Endpoints: ${technicalSpec.controller.endpoints.map((e) => `${e.method} ${e.path}`).join(', ')}
      - Serviço (${technicalSpec.service.fileName}):
        - Métodos: ${technicalSpec.service.methods.join(', ')}
      - DTO (${technicalSpec.dto.fileName}):
        - Campos: ${technicalSpec.dto.fields.map((f) => `${f.name} (${f.type}) com validação: ${f.validation}`).join('; ')}
      - Regras de Negócio: ${technicalSpec.businessLogic.join('. ')}
      - Armazenamento: ${technicalSpec.database}
    `;

    // ETAPA 2: Gerar o código a partir da especificação detalhada
    const content =
      await this.chatgptService.generateCodeFromRequirements(detailedPrompt);

    return { content };
  }
}
