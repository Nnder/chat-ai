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
  async newQuestion(@Res() res: Response, @Body() body) {
    console.log(body.question)
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
            "content": body.question
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
