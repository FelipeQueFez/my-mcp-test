import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChatgptModule } from './chatgpt/chatgpt.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make the config module global
    }),
    ChatgptModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
