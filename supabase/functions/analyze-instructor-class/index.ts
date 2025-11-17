import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { aula_id, video_url, titulo_aula } = await req.json();

    console.log(`Processando avaliação da aula: ${titulo_aula}`);

    // Aqui você integraria com uma API de transcrição (Whisper, etc)
    // e depois com uma IA para análise (OpenAI, Gemini, etc)
    
    // Por enquanto, retornamos uma análise simulada
    const analise = {
      pontuacoes: {
        clareza: 8.5,
        didatica: 9.0,
        engajamento: 7.5,
        dominio: 9.5,
        exemplos: 8.0,
        linguagem: 8.5
      },
      pontuacao_geral: 8.5,
      feedback_positivo: "Excelente domínio do conteúdo técnico. A explicação foi clara e estruturada, demonstrando profundo conhecimento do tema. Boa utilização de terminologia técnica adequada.",
      feedback_melhorias: "Pode aumentar a interação com os alunos através de mais perguntas reflexivas. Incluir mais pausas estratégicas para verificação de entendimento ajudaria no engajamento.",
      recomendacoes: "Sugestões práticas: 1) Incluir mais casos reais de atendimento ao cliente para contextualizar a teoria, 2) Utilizar recursos visuais adicionais como diagramas e infográficos, 3) Implementar exercícios práticos ao final de cada módulo."
    };

    // Salvar resultado no banco
    const { data, error } = await supabase
      .from('avaliacoes_instrutor')
      .update({
        avaliacao_ia: analise,
        pontuacao_geral: analise.pontuacao_geral,
        pontuacao_clareza: analise.pontuacoes.clareza,
        pontuacao_didatica: analise.pontuacoes.didatica,
        pontuacao_engajamento: analise.pontuacoes.engajamento,
        pontuacao_dominio: analise.pontuacoes.dominio,
        feedback_positivo: analise.feedback_positivo,
        feedback_melhorias: analise.feedback_melhorias,
        recomendacoes: analise.recomendacoes,
        status: 'concluido'
      })
      .eq('id', aula_id)
      .select();

    if (error) {
      console.error('Erro ao salvar avaliação:', error);
      throw error;
    }

    console.log('Avaliação salva com sucesso');

    return new Response(JSON.stringify({ 
      success: true, 
      data,
      message: 'Análise concluída com sucesso' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erro na análise:', error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
