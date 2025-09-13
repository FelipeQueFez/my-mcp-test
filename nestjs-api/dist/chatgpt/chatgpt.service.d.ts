export declare class ChatgptService {
    private openai;
    constructor();
    createChatCompletion(prompt: string): Promise<string>;
}
