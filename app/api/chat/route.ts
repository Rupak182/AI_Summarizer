import { createGoogleGenerativeAI   } from '@ai-sdk/google';
import { generateText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';

// Allow streaming responses up to 30 seconds

export const maxDuration = 30;




export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }


     const google = createGoogleGenerativeAI({
    // custom settings
    });


const model = google('gemini-2.0-flash-001');
  const {text:result} = await generateText({
    model,
    messages:[
      { role: "system", content: `You are an expert note summarizer.
      
      **Task:** Summarize the following document as clear, well-structured, and visually appealing markdown.
      
      **Instructions:**
      - Use top-level headings (##) for main sections.
      - Use subheadings (###) for subsections.
      - Use bullet points ( - or * ) for lists.
      - Bold key terms or section titles.
      - Use tables if you need to present tabular data.
      - Do NOT wrap the output in triple backticks or code blocks.
      - Make sure the markdown is valid and renders nicely in modern markdown renderers.
      
      `},
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Summarize the following note in mdx format.Keep them in separate points and make it presentable and easly readable",
          },
          {
            type: "file",
            data: await file.arrayBuffer(),
            mimeType: "application/pdf",
          },
        ],
      }
    ],
  });

  const summary = result || "No summary generated.";

  return NextResponse.json({ summary });
}