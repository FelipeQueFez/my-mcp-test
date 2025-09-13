import { ChatgptService } from './chatgpt.service';
export declare class ChatgptController {
    private readonly chatgptService;
    constructor(chatgptService: ChatgptService);
    createChatCompletion(prompt: string): Promise<string>;
}
