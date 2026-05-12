import { OpenAIStream, StreamingTextResponse } from "ai";
import OpenAI from "openai";

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages, repoId } = await req.json();

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
          content: `You are Forge Intelligence, an expert developer assistant for the repository with ID ${repoId}. 
          You have access to the code context and can help with reviews, debugging, and feature implementation.
          Keep your responses concise, professional, and formatted in Markdown.`,
        },
        ...messages,
      ],
    });

    const stream = OpenAIStream(response as any);
    return new StreamingTextResponse(stream);
  } catch (error: any) {
    console.error("OpenAI Error:", error.message);
    
    // If it's a quota error, return a friendly mock response
    if (error.status === 429 || error.message?.includes("quota")) {
      const mockText = "👋 **Forge Intelligence (Mock Mode)**: Your OpenAI quota has been exceeded. \n\nTo enable my full GPT-4o intelligence, please add credits to your OpenAI account. In the meantime, I'm here to help you test the interface!";
      
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          const parts = mockText.split(" ");
          for (const part of parts) {
            controller.enqueue(encoder.encode(part + " "));
            await new Promise((r) => setTimeout(r, 40)); // Simulate typing
          }
          controller.close();
        },
      });
      
      return new StreamingTextResponse(stream);
    }
    
    return new Response(error.message || "An error occurred", { status: 500 });
  }
}
