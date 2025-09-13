import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateChatCompletionDto {
  @ApiProperty({
    description: 'The prompt to send to ChatGPT',
    example: 'What is the capital of France?',
  })
  @IsString()
  @IsNotEmpty()
  prompt: string;
}

export class ChatCompletionResponseDto {
  @ApiProperty({
    description: 'The response from ChatGPT',
    example: 'The capital of France is Paris.',
  })
  content: string;
}
