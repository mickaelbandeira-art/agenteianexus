import { GoogleGenerativeAI } from '@google/generative-ai';

// Inicializar cliente Gemini
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

/**
 * Gera embedding para um texto usando Gemini
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
    const result = await model.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.error('Erro ao gerar embedding:', error);
    throw new Error('Falha ao gerar embedding');
  }
}

/**
 * Divide texto em chunks para processamento
 */
export function splitIntoChunks(text: string, maxChunkSize: number = 500): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const chunks: string[] = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxChunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += sentence;
    }
  }

  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

/**
 * Processa documento e gera embeddings para cada chunk
 */
export async function processDocumentForRAG(
  text: string,
  documentName: string,
  chunkSize: number = 500
): Promise<Array<{ chunk: string; embedding: number[]; index: number }>> {
  const chunks = splitIntoChunks(text, chunkSize);
  const results = [];

  for (let i = 0; i < chunks.length; i++) {
    const embedding = await generateEmbedding(chunks[i]);
    results.push({
      chunk: chunks[i],
      embedding,
      index: i
    });
  }

  return results;
}
