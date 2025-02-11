import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AppService {
  getData(): { message: string } {
    return { message: 'Hello API' };
  }

  async newQuestion(question: string) {
    const openai = new OpenAI({
      baseURL: process.env.BASE_URL ?? '',
      apiKey: process.env.OPENAI_API_KEY ?? '',
    })
    const completion = await openai.chat.completions.create({
      model: process.env.MODEL,
      messages: [
        {
          "role": "user",
          "content": question
        }
      ],
      stream: true,
    })

    return completion
  }
}
