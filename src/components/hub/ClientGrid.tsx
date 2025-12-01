import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useClients } from '@/hooks/useClients';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight } from 'lucide-react';

export const ClientGrid = () => {
    const navigate = useNavigate();
    const { clients, loading } = useClients();

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-64 rounded-xl" />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((client, index) => (
                <motion.div
                    key={client.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="cursor-pointer"
                    onClick={() => navigate(`/clients/${client.slug}`)}
                >
                    <Card
                        className="relative h-64 overflow-hidden group border-2 hover:border-primary/50 transition-all duration-300"
                        style={{
                            background: `linear-gradient(135deg, ${client.theme_config.gradientFrom || client.theme_config.primaryColor}15, ${client.theme_config.gradientTo || client.theme_config.secondaryColor}15)`
                        }}
                    >
                        {/* Gradient overlay */}
                        <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            style={{
                                background: `linear-gradient(135deg, ${client.theme_config.primaryColor}20, ${client.theme_config.secondaryColor}20)`
                            }}
                        />

                        {/* Content */}
                        <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
                            {/* Logo */}
                            {client.logo_url ? (
                                <div className="w-32 h-32 flex items-center justify-center">
                                    <img
                                        src={client.logo_url}
                                        alt={client.name}
                                        className="max-w-full max-h-full object-contain filter group-hover:brightness-110 transition-all"
                                    />
                                </div>
                            ) : (
                                <div
                                    className="w-32 h-32 rounded-2xl flex items-center justify-center text-4xl font-bold"
                                    style={{
                                        background: `linear-gradient(135deg, ${client.theme_config.primaryColor}, ${client.theme_config.secondaryColor})`,
                                        color: 'white'
                                    }}
                                >
                                    {client.name.charAt(0)}
                                </div>
                            )}

                            {/* Arrow indicator */}
                            <motion.div
                                initial={{ x: 0 }}
                                whileHover={{ x: 5 }}
                                className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <div
                                    className="p-2 rounded-full"
                                    style={{ backgroundColor: `${client.theme_config.primaryColor}20` }}
                                >
                                    <ArrowRight
                                        className="w-5 h-5"
                                        style={{ color: client.theme_config.primaryColor }}
                                    />
                                </div>
                            </motion.div>

                            {/* Shine effect */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 group-hover:translate-x-full transition-transform duration-1000" />
                            </div>
                        </div>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
};
