import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useClient } from '@/hooks/useClients';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { BookOpen, Trophy, MessageSquare, BarChart, Gamepad2 } from 'lucide-react';

const ClientPortal = () => {
    const { clientSlug } = useParams<{ clientSlug: string }>();
    const navigate = useNavigate();
    const { client, loading, error } = useClient(clientSlug || '');

    useEffect(() => {
        if (client) {
            // Aplicar tema do cliente
            document.documentElement.style.setProperty('--client-primary', client.theme_config.primaryColor);
            document.documentElement.style.setProperty('--client-secondary', client.theme_config.secondaryColor);
            document.documentElement.style.setProperty('--client-accent', client.theme_config.accentColor || client.theme_config.primaryColor);
        }
    }, [client]);

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 container mx-auto px-4 py-8">
                    <Skeleton className="h-64 w-full mb-8" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} className="h-48" />
                        ))}
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (error || !client) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold mb-4">Cliente não encontrado</h1>
                        <Button onClick={() => navigate('/')}>Voltar ao Hub</Button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const menuItems = [
        {
            title: 'Treinamentos',
            description: 'Acesse cursos e materiais',
            icon: BookOpen,
            path: `/clients/${clientSlug}/trainings`,
            gradient: `linear-gradient(135deg, ${client.theme_config.primaryColor}20, ${client.theme_config.secondaryColor}20)`
        },
        {
            title: 'Ranking',
            description: 'Veja sua posição',
            icon: Trophy,
            path: `/clients/${clientSlug}/leaderboard`,
            gradient: `linear-gradient(135deg, ${client.theme_config.accentColor || client.theme_config.primaryColor}20, ${client.theme_config.primaryColor}20)`
        },
        {
            title: 'Assistente IA',
            description: 'Chat inteligente',
            icon: MessageSquare,
            path: `/clients/${clientSlug}/chat`,
            gradient: `linear-gradient(135deg, ${client.theme_config.secondaryColor}20, ${client.theme_config.accentColor || client.theme_config.secondaryColor}20)`
        },
        {
            title: 'Meu Progresso',
            description: 'Acompanhe sua evolução',
            icon: BarChart,
            path: `/clients/${clientSlug}/progress`,
            gradient: `linear-gradient(135deg, ${client.theme_config.primaryColor}20, ${client.theme_config.accentColor || client.theme_config.primaryColor}20)`
        },
        {
            title: 'Simuladores',
            description: 'Pratique com cenários reais',
            icon: Gamepad2,
            path: `/clients/${clientSlug}/simulators`,
            gradient: `linear-gradient(135deg, ${client.theme_config.secondaryColor}20, ${client.theme_config.primaryColor}20)`
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />

            <main className="flex-1">
                {/* Hero Banner */}
                <section
                    className="relative h-64 flex items-center justify-center overflow-hidden"
                    style={{
                        background: `linear-gradient(135deg, ${client.theme_config.gradientFrom || client.theme_config.primaryColor}, ${client.theme_config.gradientTo || client.theme_config.secondaryColor})`
                    }}
                >
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="relative z-10 text-center text-white">
                        {client.logo_url && (
                            <motion.img
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                src={client.logo_url}
                                alt={client.name}
                                className="h-24 mx-auto mb-4 filter brightness-0 invert"
                            />
                        )}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-bold"
                        >
                            Portal {client.name}
                        </motion.h1>
                    </div>
                </section>

                {/* Menu Grid */}
                <section className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {menuItems.map((item, index) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card
                                    className="h-48 p-6 cursor-pointer hover:shadow-lg transition-all duration-300 group"
                                    style={{ background: item.gradient }}
                                    onClick={() => navigate(item.path)}
                                >
                                    <div className="flex flex-col h-full">
                                        <div
                                            className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                                            style={{ backgroundColor: `${client.theme_config.primaryColor}30` }}
                                        >
                                            <item.icon
                                                className="w-6 h-6"
                                                style={{ color: client.theme_config.primaryColor }}
                                            />
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                        <p className="text-sm text-muted-foreground">{item.description}</p>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Quick Stats */}
                <section className="bg-muted/30 py-12">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl font-bold mb-6">Seu Resumo</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="p-6">
                                <div className="text-3xl font-bold mb-2">0</div>
                                <div className="text-sm text-muted-foreground">Treinamentos Concluídos</div>
                            </Card>
                            <Card className="p-6">
                                <div className="text-3xl font-bold mb-2">Nível 1</div>
                                <div className="text-sm text-muted-foreground">Seu Nível Atual</div>
                            </Card>
                            <Card className="p-6">
                                <div className="text-3xl font-bold mb-2">0 pts</div>
                                <div className="text-sm text-muted-foreground">Pontos Totais</div>
                            </Card>
                        </div>
                    </div>
                </section>
            </main>

            {/* Floating Chat IA Button */}
            <Button
                className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
                size="icon"
                style={{ backgroundColor: client.theme_config.primaryColor }}
                onClick={() => navigate(`/clients/${clientSlug}/chat`)}
            >
                <MessageSquare className="h-6 w-6 text-white" />
            </Button>

            <Footer />
        </div>
    );
};

export default ClientPortal;
