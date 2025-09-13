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
}
