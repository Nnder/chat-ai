import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';
import OpenAI from 'openai';
import { Response } from 'express';

@Controller('chat')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Post('question')
  async newQuestion(@Res() res: Response, @Body() dto: any) {
    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.DEEPSEEK_API_KEY ?? '',
    })

    res.setHeader('Content-Type', 'text/plain');

      const completion = await openai.chat.completions.create({
        model: "qwen/qwen-vl-plus:free",
        // model: "meta-llama/llama-3.2-3b-instruct:free",
        messages: [
          {
            "role": "user",
            "content": "расскажи про языки программирования, напиши подробно минимум 50 предложений, в каждом предложении минимум 300 символов"
          }
        ],
        stream: true,
      })

      for await (const chunk of completion) {
        const content = chunk.choices[0]?.delta?.content || '';
        console.log(content)
        res.write(content);
      }

      res.end();

  }
}
