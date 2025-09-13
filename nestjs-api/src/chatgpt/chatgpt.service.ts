import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class ChatgptService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, // Use an environment variable for the API key
    });
  }

  // A) RECOMMENDED: Responses API (single-shot)
  async respond(prompt: string) {
    const res = await this.openai.responses.create({
      model: 'gpt-4o',
      input: prompt,
      // optionally: instructions: 'You are a helpful assistant.'
    });
    // SDK convenience field with the final composed text
    return res.output_text; // string
  }

  // B) Legacy but supported: Chat Completions API
  async createChatCompletion(prompt: string) {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      });
      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error creating chat completion:', error);
      throw error;
    }
  }
}
