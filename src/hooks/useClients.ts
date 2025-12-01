import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
                setClients(data || []);
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
                setClient(data);
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
