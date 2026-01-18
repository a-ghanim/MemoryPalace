import Anthropic from "@anthropic-ai/sdk";

export interface ParsedMemoryChunk {
  content: string;
  title: string;
  mnemonic: string;
  keywords: string[];
  category: string;
}

export interface ParseContentResponse {
  chunks: ParsedMemoryChunk[];
  palaceTheme: string;
  suggestedRoomNames: string[];
}

const PARSING_PROMPT = `You are an expert memory palace architect. Your task is to parse content into logical memory chunks that can be placed in a 3D memory palace for memorization.

Analyze the provided content and break it into meaningful, memorable chunks. For each chunk:
1. Extract the core concept or fact
2. Create a short, vivid title (5-10 words)
3. Suggest a mnemonic device or visualization
4. Identify 2-4 keywords
5. Assign a category (concept, fact, definition, process, person, event, etc.)

Also suggest:
- An overall theme for the palace (based on content type)
- Room names that relate to the content categories

Respond with valid JSON only. No markdown, no explanations.

JSON Schema:
{
  "chunks": [
    {
      "content": "The original text chunk",
      "title": "Short memorable title",
      "mnemonic": "A vivid mental image or memory trick",
      "keywords": ["key1", "key2"],
      "category": "category name"
    }
  ],
  "palaceTheme": "suggested theme for the palace",
  "suggestedRoomNames": ["Room 1", "Room 2", "Room 3", "Room 4"]
}

Guidelines:
- Create 2-16 chunks depending on content length
- Each chunk should be self-contained and memorable
- Mnemonics should be vivid, unusual, or humorous for better recall
- Group related information together
- Keep chunks under 200 words each`;

export async function parseContentWithClaude(content: string): Promise<ParseContentResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY not configured");
  }

  const client = new Anthropic({
    apiKey,
  });

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `${PARSING_PROMPT}\n\nContent to parse:\n${content}`,
      },
    ],
  });

  const textContent = response.content.find((block) => block.type === "text");
  if (!textContent || textContent.type !== "text") {
    throw new Error("No text response from Claude");
  }

  try {
    const parsed = JSON.parse(textContent.text) as ParseContentResponse;
    
    if (!parsed.chunks || !Array.isArray(parsed.chunks)) {
      throw new Error("Invalid response structure");
    }

    parsed.chunks = parsed.chunks.slice(0, 16).map((chunk) => ({
      content: chunk.content || "",
      title: chunk.title || chunk.content?.substring(0, 30) || "Memory",
      mnemonic: chunk.mnemonic || "",
      keywords: chunk.keywords || [],
      category: chunk.category || "general",
    }));

    return parsed;
  } catch (e) {
    throw new Error("Failed to parse Claude response as JSON");
  }
}
