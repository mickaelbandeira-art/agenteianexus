import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type ClientRow = Tables<'clients'>;

export interface Client {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  theme_config: {
    primaryColor: string;
    secondaryColor: string;
    accentColor?: string;
    gradientFrom?: string;
    gradientTo?: string;
  };
  ai_config: {
    model: string;
    temperature: number;
    contextWindow: number;
  };
  is_active: boolean;
}

function parseClient(row: ClientRow): Client {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    logo_url: row.logo_url,
    theme_config: (row.theme_config as Client['theme_config']) || {
      primaryColor: '#000',
      secondaryColor: '#fff',
    },
    ai_config: (row.ai_config as Client['ai_config']) || {
      model: 'gpt-4',
      temperature: 0.7,
      contextWindow: 4096,
    },
    is_active: row.is_active ?? true,
  };
}

/**
 * Hook para buscar clientes
 */
export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchClients() {
      try {
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .eq('is_active', true)
          .order('name');

        if (error) throw error;
        setClients((data || []).map(parseClient));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchClients();
  }, []);

  return { clients, loading, error };
}

/**
 * Hook para buscar cliente específico
 */
export function useClient(slug: string) {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchClient() {
      try {
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) throw error;
        setClient(parseClient(data));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchClient();
    }
  }, [slug]);

  return { client, loading, error };
}
