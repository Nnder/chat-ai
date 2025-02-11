import { Body, Controller, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller('chat')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('question')
  async newQuestion(@Res() res: Response, @Body() body) {
    res.setHeader('Content-Type', 'text/plain');
    const completion = await this.appService.newQuestion(body.question)
      for await (const chunk of completion) {
        const content = chunk.choices[0]?.delta?.content || '';
        res.write(content);
      }
    res.end();
  }
}
