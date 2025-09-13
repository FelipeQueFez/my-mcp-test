import { Controller, Post, Body } from '@nestjs/common';
import { ChatgptService } from './chatgpt.service';

@Controller('chatgpt')
export class ChatgptController {
  constructor(private readonly chatgptService: ChatgptService) {}

  @Post('completions')
  async createChatCompletion(@Body('prompt') prompt: string) {
    return this.chatgptService.createChatCompletion(prompt);
  }
}
