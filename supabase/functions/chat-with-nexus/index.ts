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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Não autenticado' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { message } = await req.json();

    // Buscar perfil e roles do usuário
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('full_name, email, matricula, cpf, cargo, user_roles(role)')
      .eq('id', user.id)
      .single();

    // Buscar desempenho
    const { data: performance } = await supabaseClient
      .from('desempenho_usuarios')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Determinar agente baseado na pergunta
    let agente = 'Nexus Treinamento';
    const messageLower = message.toLowerCase();
    
    if (messageLower.includes('falta') || messageLower.includes('frequência')) {
      agente = 'Agente Inicial';
    } else if (messageLower.includes('recicl') || messageLower.includes('meta')) {
      agente = 'Agente Continuado';
    } else if (messageLower.includes('avalia') || messageLower.includes('desempenho')) {
      agente = 'Agente Continuado';
    }

    // Construir contexto
    const contexto = {
      perfil_tipo: profile?.cargo || 'novato',
      roles: profile?.user_roles?.map((r: any) => r.role) || [],
      desempenho: performance,
    };

    // Resposta contextualizada baseada no agente e perfil
    let resposta = '';
    
    if (agente === 'Agente Inicial') {
      resposta = `[${agente}] Entendi sua dúvida sobre "${message}". `;
      if (performance) {
        resposta += `Vejo que você tem ${performance.total_faltas} faltas registradas. `;
        if (performance.total_faltas > 3) {
          resposta += `Lembre-se que excesso de faltas pode impactar sua avaliação. Entre em contato com seu gestor para regularizar sua situação.`;
        } else {
          resposta += `Sua frequência está dentro do esperado. Continue assim!`;
        }
      }
    } else if (agente === 'Agente Continuado') {
      resposta = `[${agente}] Sobre "${message}": `;
      if (performance) {
        if (performance.csat_score) {
          resposta += `Seu CSAT atual é ${performance.csat_score}. `;
        }
        if (performance.taxa_reincidencia) {
          resposta += `Taxa de reincidência: ${performance.taxa_reincidencia}%. `;
        }
      }
      resposta += `Vou analisar seus dados e fornecer recomendações personalizadas.`;
    } else {
      resposta = `Olá ${profile?.full_name || 'usuário'}! Como posso ajudar você hoje? Posso responder dúvidas sobre treinamento, desempenho, reciclagens e muito mais.`;
    }

    // Salvar no histórico
    const startTime = Date.now();
    await supabaseClient
      .from('chat_history')
      .insert({
        user_id: user.id,
        mensagem_usuario: message,
        resposta_nexus: resposta,
        agente_utilizado: agente,
        contexto: contexto,
        tempo_resposta_ms: Date.now() - startTime,
      });

    return new Response(JSON.stringify({ 
      resposta,
      agente,
      contexto 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erro no chat:', error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
