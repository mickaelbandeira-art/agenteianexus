import Groq from 'groq-sdk';
import { ChatMessage, ChatOptions } from './gemini';
import { getRAGContext } from './rag';

const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY || '',
    dangerouslyAllowBrowser: true // Allow running in browser for this demo/app
});

/**
 * Chat com Groq usando streaming
 */
export async function* chatWithGroq(
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
        console.log('Iniciando chat com Groq...');

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

        const systemPrompt = `Você é um assistente de treinamento especializado da ${clientName}.

Seu papel é ajudar colaboradores com:
- Dúvidas sobre treinamentos e processos
- Orientações sobre políticas e procedimentos
- Suporte técnico e troubleshooting
- Desenvolvimento de habilidades

${ragContext ? `\n## Documentação Relevante:\n${ragContext}\n` : ''}

Seja sempre profissional, claro e objetivo.`;

        // Montar histórico de chat para Groq
        const messages = [
            { role: 'system', content: systemPrompt },
            ...history.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'assistant',
                content: msg.content
            } as const)),
            { role: 'user', content: message }
        ];

        console.log('Enviando mensagem para Groq API...');

        const chatCompletion = await groq.chat.completions.create({
            messages: messages as any,
            model: 'llama-3.3-70b-versatile',
            temperature: temperature,
            max_tokens: 2048,
            stream: true,
        });

        console.log('Recebendo stream...');

        for await (const chunk of chatCompletion) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
                yield content;
            }
        }

        console.log('Stream finalizado com sucesso.');
    } catch (error) {
        console.error('Erro CRÍTICO no chat com Groq:', error);
        throw error;
    }
}

/**
 * Gera resposta completa (sem streaming)
 */
export async function generateResponseWithGroq(
    message: string,
    history: ChatMessage[],
    options: ChatOptions
): Promise<string> {
    let fullResponse = '';

    for await (const chunk of chatWithGroq(message, history, options)) {
        fullResponse += chunk;
    }

    return fullResponse;
}

/**
 * Gera quiz automaticamente baseado em conteúdo
 */
export async function generateQuizWithGroq(
    content: string,
    clientName: string,
    numQuestions: number = 5
): Promise<any> {
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

    const completion = await groq.chat.completions.create({
        messages: [
            { role: 'system', content: 'Você é um gerador de quizzes educacionais. Responda apenas com JSON válido.' },
            { role: 'user', content: prompt }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.2,
        response_format: { type: 'json_object' }
    });

    const text = completion.choices[0]?.message?.content || '{}';
    return JSON.parse(text);
}

/**
 * Analisa resposta do usuário e fornece feedback
 */
export async function analyzeUserAnswerWithGroq(
    question: string,
    userAnswer: string,
    correctAnswer: string,
    clientName: string
): Promise<string> {
    const prompt = `Como instrutor da ${clientName}, analise a resposta do usuário e forneça feedback construtivo.

Pergunta: ${question}
Resposta do usuário: ${userAnswer}
Resposta correta: ${correctAnswer}

Forneça feedback breve e educativo (máximo 2-3 frases).`;

    const completion = await groq.chat.completions.create({
        messages: [
            { role: 'system', content: 'Você é um instrutor atencioso.' },
            { role: 'user', content: prompt }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.5,
    });

    return completion.choices[0]?.message?.content || '';
}
