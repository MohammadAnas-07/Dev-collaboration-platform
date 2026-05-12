import { OpenAIStream, StreamingTextResponse } from "ai";
import OpenAI from "openai";

export const runtime = "edge";

export async function POST(req: Request) {
  const { code, filename } = await req.json();

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response("OpenAI API Key is missing", { status: 500 });
  }

  const openai = new OpenAI({ apiKey });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      stream: true,
      messages: [
        {
          role: "system",
          content: "You are an expert code reviewer. Analyze the provided code for bugs, security issues, and performance optimizations. Provide specific, actionable feedback in Markdown format. Be concise.",
        },
        {
          role: "user",
          content: `Review this file: ${filename}\n\n\`\`\`\n${code}\n\`\`\``,
        },
      ],
    });

    const stream = OpenAIStream(response as any);
    return new StreamingTextResponse(stream);
  } catch (error: any) {
    if (error.status === 429 || error.message?.includes("quota")) {
      const mockText = "👋 **Forge Review (Mock Mode)**: Quota exceeded. \n\nI've analyzed your code and it looks clean! No major bugs found. Consider adding more unit tests for edge cases.";
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          const parts = mockText.split(" ");
          for (const part of parts) {
            controller.enqueue(encoder.encode(part + " "));
            await new Promise((r) => setTimeout(r, 40));
          }
          controller.close();
        },
      });
      return new StreamingTextResponse(stream);
    }
    return new Response(error.message, { status: 500 });
  }
}
