import { GoogleGenerativeAI } from '@google/generative-ai';
import { getRAGContext } from './rag';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export interface ChatOptions {
    clientId: string;
    clientName: string;
    useRAG?: boolean;
    temperature?: number;
    maxTokens?: number;
}

/**
 * Chat com Gemini usando streaming
 */
export async function* chatWithGemini(
    message: string,
    history: ChatMessage[],
    options: ChatOptions
) {
    const {
        clientId,
        clientName,
        useRAG = true,
        temperature = 0.7,
    } = options;

    try {
        console.log('Iniciando chat com Gemini...');
        console.log('Opções:', { clientId, clientName, useRAG });

        // Buscar contexto RAG se habilitado
        let ragContext = '';
        if (useRAG) {
            try {
                console.log('Buscando contexto RAG...');
                ragContext = await getRAGContext(message, clientId);
                console.log('Contexto RAG encontrado:', ragContext ? 'Sim' : 'Não');
            } catch (ragError) {
                console.error('Erro ao buscar RAG (prosseguindo sem contexto):', ragError);
            }
        }

        // Montar prompt do sistema
        const systemPrompt = `Você é um assistente de treinamento especializado da ${clientName}.

Seu papel é ajudar colaboradores com:
- Dúvidas sobre treinamentos e processos
- Orientações sobre políticas e procedimentos
- Suporte técnico e troubleshooting
- Desenvolvimento de habilidades

${ragContext ? `\n## Documentação Relevante:\n${ragContext}\n` : ''}

Seja sempre profissional, claro e objetivo. Use a documentação fornecida quando disponível.`;

        console.log('Configurando modelo...');
        // Configurar modelo para gemini-pro (mais compatível)
        const model = genAI.getGenerativeModel({
            model: 'gemini-pro',
            generationConfig: {
                temperature,
                maxOutputTokens: 2048,
            },
        });

        // Montar histórico de chat
        const chatHistory = history.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
        }));

        // Para gemini-pro, injetamos o system prompt como primeira interação
        const historyWithSystem = [
            {
                role: 'user',
                parts: [{ text: systemPrompt }]
            },
            {
                role: 'model',
                parts: [{ text: 'Entendido. Estou pronto para ajudar como assistente especializado.' }]
            },
            ...chatHistory
        ];

        console.log('Iniciando sessão de chat...');
        // Iniciar chat
        const chat = model.startChat({
            history: historyWithSystem,
        });

        console.log('Enviando mensagem para API...');
        // Enviar mensagem com streaming
        const result = await chat.sendMessageStream(message);

        console.log('Recebendo stream...');
        // Yield chunks de resposta
        for await (const chunk of result.stream) {
            const text = chunk.text();
            // console.log('Chunk recebido:', text);
            yield text;
        }
        console.log('Stream finalizado com sucesso.');
    } catch (error) {
        console.error('Erro CRÍTICO no chat com Gemini:', error);
        throw error; // Re-throw para ser capturado no componente
    }
}

/**
 * Gera resposta completa (sem streaming)
 */
export async function generateResponse(
    message: string,
    history: ChatMessage[],
    options: ChatOptions
): Promise<string> {
    let fullResponse = '';

    for await (const chunk of chatWithGemini(message, history, options)) {
        fullResponse += chunk;
    }

    return fullResponse;
}

/**
 * Gera quiz automaticamente baseado em conteúdo
 */
export async function generateQuiz(
    content: string,
    clientName: string,
    numQuestions: number = 5
): Promise<any> {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Com base no seguinte conteúdo de treinamento da ${clientName}, gere ${numQuestions} questões de múltipla escolha.

Conteúdo:
${content}

Retorne um JSON válido no seguinte formato:
{
  "questions": [
    {
      "question": "Texto da pergunta",
      "options": ["Opção A", "Opção B", "Opção C", "Opção D"],
      "correctAnswer": 0,
      "explanation": "Explicação da resposta correta"
    }
  ]
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Extrair JSON da resposta
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
    }

    throw new Error('Falha ao gerar quiz');
}

/**
 * Analisa resposta do usuário e fornece feedback
 */
export async function analyzeUserAnswer(
    question: string,
    userAnswer: string,
    correctAnswer: string,
    clientName: string
): Promise<string> {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Como instrutor da ${clientName}, analise a resposta do usuário e forneça feedback construtivo.

Pergunta: ${question}
Resposta do usuário: ${userAnswer}
Resposta correta: ${correctAnswer}

Forneça feedback breve e educativo (máximo 2-3 frases).`;

    const result = await model.generateContent(prompt);
    return result.response.text();
}
