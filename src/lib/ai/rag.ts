import { supabase } from '@/integrations/supabase/client';
import { generateEmbedding } from './embeddings';

/**
 * Busca documentos similares usando RAG
 */
export async function getRAGContext(
    query: string,
    clientId: string,
    matchThreshold: number = 0.7,
    matchCount: number = 5
): Promise<string> {
    try {
        // 1. Gerar embedding da query
        const queryEmbedding = await generateEmbedding(query);

        // 2. Buscar documentos similares usando a função RPC
        const { data, error } = await supabase.rpc('match_documents', {
            query_embedding: queryEmbedding,
            match_threshold: matchThreshold,
            match_count: matchCount,
            filter_client_id: clientId
        });

        if (error) {
            console.error('Erro ao buscar documentos:', error);
            return '';
        }

        if (!data || data.length === 0) {
            return '';
        }

        // 3. Concatenar contexto dos documentos encontrados
        const context = data
            .map((doc: any, index: number) => {
                return `[Documento ${index + 1}: ${doc.document_name}]\n${doc.chunk_text}`;
            })
            .join('\n\n---\n\n');

        return context;
    } catch (error) {
        console.error('Erro no RAG:', error);
        return '';
    }
}

/**
 * Salva documento processado no banco com embeddings
 */
export async function saveDocumentEmbeddings(
    clientId: string,
    documentName: string,
    chunks: Array<{ chunk: string; embedding: number[]; index: number }>,
    documentType: string = 'other',
    metadata: Record<string, any> = {}
) {
    try {
        const embeddings = chunks.map(({ chunk, embedding, index }) => ({
            client_id: clientId,
            document_name: documentName,
            document_type: documentType,
            chunk_text: chunk,
            chunk_index: index,
            embedding: JSON.stringify(embedding), // pgvector aceita array ou string
            metadata
        }));

        const { error } = await supabase
            .from('documents_embeddings')
            .insert(embeddings);

        if (error) {
            console.error('Erro ao salvar embeddings:', error);
            throw error;
        }

        return { success: true, count: embeddings.length };
    } catch (error) {
        console.error('Erro ao salvar documento:', error);
        throw error;
    }
}

/**
 * Lista documentos de um cliente
 */
export async function listClientDocuments(clientId: string) {
    const { data, error } = await supabase
        .from('documents_embeddings')
        .select('document_name, document_type, created_at')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Erro ao listar documentos:', error);
        return [];
    }

    // Agrupar por nome de documento
    const uniqueDocs = data.reduce((acc: any[], curr) => {
        if (!acc.find(d => d.document_name === curr.document_name)) {
            acc.push(curr);
        }
        return acc;
    }, []);

    return uniqueDocs;
}

/**
 * Remove documento e seus embeddings
 */
export async function deleteDocument(clientId: string, documentName: string) {
    const { error } = await supabase
        .from('documents_embeddings')
        .delete()
        .eq('client_id', clientId)
        .eq('document_name', documentName);

    if (error) {
        console.error('Erro ao deletar documento:', error);
        throw error;
    }

    return { success: true };
}
