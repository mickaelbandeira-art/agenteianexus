import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useClient } from "@/hooks/useClients";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { chatWithGroq } from "@/lib/ai/groq";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { supabase } from "@/integrations/supabase/client";

interface Message {
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

const ClientChat = () => {
    const { clientSlug } = useParams<{ clientSlug: string }>();
    const { client, loading: clientLoading } = useClient(clientSlug || "");
    const { user } = useAuth();
    const { toast } = useToast();

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (client) {
            // Aplicar tema do cliente
            document.documentElement.style.setProperty('--client-primary', client.theme_config.primaryColor);

            // Mensagem de boas-vindas
            if (messages.length === 0) {
                setMessages([{
                    role: "assistant",
                    content: `Olá! Sou o assistente inteligente do ${client.name}. Como posso ajudar você hoje?`,
                    timestamp: new Date()
                }]);
            }
        }
    }, [client]);

    // Carregar histórico de chat
    useEffect(() => {
        const loadHistory = async () => {
            if (!user) return;

            try {
                const { data, error } = await supabase
                    .from('chat_history')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: true });

                if (error) {
                    console.error('Erro ao carregar histórico:', error);
                    return;
                }

                if (data && data.length > 0) {
                    const historyMessages: Message[] = [];

                    data.forEach(record => {
                        // Adicionar mensagem do usuário
                        historyMessages.push({
                            role: 'user',
                            content: record.mensagem_usuario,
                            timestamp: new Date(record.created_at || Date.now())
                        });

                        // Adicionar resposta do assistente
                        historyMessages.push({
                            role: 'assistant',
                            content: record.resposta_nexus,
                            timestamp: new Date(record.created_at || Date.now())
                        });
                    });

                    setMessages(prev => {
                        // Manter mensagem de boas-vindas se for a única
                        if (prev.length <= 1) {
                            return [...prev.slice(0, 1), ...historyMessages];
                        }
                        return historyMessages;
                    });
                }
            } catch (error) {
                console.error('Erro ao processar histórico:', error);
            }
        };

        loadHistory();
    }, [user]);

    useEffect(() => {
        // Auto-scroll para última mensagem
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || !client || !user) return;

        const userMessage: Message = {
            role: "user",
            content: input.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            console.log('Enviando mensagem no componente...');
            // Criar mensagem do assistente vazia para streaming
            const assistantMessageIndex = messages.length + 1;
            setMessages(prev => [...prev, {
                role: "assistant",
                content: "",
                timestamp: new Date()
            }]);

            // Preparar histórico para a API (filtrar mensagem inicial do assistente se houver)
            // A API do Gemini exige que a primeira mensagem seja do usuário
            const history = messages
                .filter((_, index) => index > 0 || messages[0].role === 'user')
                .map(msg => ({
                    role: msg.role,
                    content: msg.content
                }));

            const options = {
                clientId: client.id,
                clientName: client.name,
                useRAG: true
            };

            let fullResponse = "";

            // Chat com streaming usando generator
            for await (const chunk of chatWithGroq(input.trim(), history, options)) {
                fullResponse += chunk;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[assistantMessageIndex] = {
                        role: "assistant",
                        content: fullResponse,
                        timestamp: new Date()
                    };
                    return newMessages;
                });
            }
            console.log('Mensagem enviada com sucesso no componente.');

            // Salvar no histórico
            if (user) {
                const { error } = await supabase
                    .from('chat_history')
                    .insert({
                        user_id: user.id,
                        mensagem_usuario: input.trim(),
                        resposta_nexus: fullResponse,
                        agente_utilizado: 'groq-llama-3.3',
                        // contexto: { clientId: client.id } // Opcional
                    });

                if (error) {
                    console.error('Erro ao salvar histórico:', error);
                }
            }

        } catch (error: any) {
            console.error("Erro capturado no ClientChat:", error);
            toast({
                title: "Erro ao enviar mensagem",
                description: error.message || "Verifique o console para mais detalhes",
                variant: "destructive"
            });

            // Remover mensagem de erro
            setMessages(prev => prev.slice(0, -1));
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (clientLoading) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 container mx-auto px-4 py-8">
                    <Skeleton className="h-full w-full" />
                </main>
                <Footer />
            </div>
        );
    }

    if (!client) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
                    <p>Cliente não encontrado</p>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-8 flex flex-col">
                {/* Header do Chat */}
                <div className="mb-4">
                    <h1 className="text-3xl font-bold mb-2">
                        Assistente IA - {client.name}
                    </h1>
                    <p className="text-muted-foreground">
                        Chat inteligente com contexto específico do {client.name}
                    </p>
                </div>

                {/* Área de Mensagens */}
                <Card className="flex-1 flex flex-col overflow-hidden">
                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    {message.role === "assistant" && (
                                        <div
                                            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                                            style={{ backgroundColor: `${client.theme_config.primaryColor}20` }}
                                        >
                                            <Bot
                                                className="w-5 h-5"
                                                style={{ color: client.theme_config.primaryColor }}
                                            />
                                        </div>
                                    )}

                                    <div
                                        className={`max-w-[70%] rounded-lg p-3 ${message.role === "user"
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted"
                                            }`}
                                    >
                                        {message.role === "assistant" ? (
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                className="prose prose-sm dark:prose-invert max-w-none"
                                            >
                                                {message.content}
                                            </ReactMarkdown>
                                        ) : (
                                            <p className="text-sm">{message.content}</p>
                                        )}
                                        <span className="text-xs opacity-70 mt-1 block">
                                            {message.timestamp.toLocaleTimeString('pt-BR', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>

                                    {message.role === "user" && (
                                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                                            <User className="w-5 h-5 text-primary-foreground" />
                                        </div>
                                    )}
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex gap-3 justify-start">
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center"
                                        style={{ backgroundColor: `${client.theme_config.primaryColor}20` }}
                                    >
                                        <Loader2
                                            className="w-5 h-5 animate-spin"
                                            style={{ color: client.theme_config.primaryColor }}
                                        />
                                    </div>
                                    <div className="bg-muted rounded-lg p-3">
                                        <p className="text-sm text-muted-foreground">Digitando...</p>
                                    </div>
                                </div>
                            )}

                            <div ref={scrollRef} />
                        </div>
                    </ScrollArea>

                    {/* Input de Mensagem */}
                    <div className="border-t p-4">
                        <div className="flex gap-2">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Digite sua mensagem..."
                                disabled={isLoading}
                                className="flex-1"
                            />
                            <Button
                                onClick={handleSend}
                                disabled={isLoading || !input.trim()}
                                style={{ backgroundColor: client.theme_config.primaryColor }}
                                className="text-white"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Send className="w-4 h-4" />
                                )}
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            Pressione Enter para enviar, Shift+Enter para nova linha
                        </p>
                    </div>
                </Card>
            </main>

            <Footer />
        </div>
    );
};

export default ClientChat;
