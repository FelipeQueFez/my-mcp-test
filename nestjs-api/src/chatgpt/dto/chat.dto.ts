import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateChatDto {
  @ApiProperty({
    description: 'The prompt to send to ChatGPT',
    example: 'What is the capital of France?',
  })
  @IsString()
  @IsNotEmpty()
  prompt: string;
}

export class ChatResponseDto {
  @ApiProperty({
    description: 'The response from ChatGPT',
  })
  content: string;
}
