import { motion } from 'framer-motion';
import { Sparkles, Search, Users } from 'lucide-react';
import { AnimatedRobot } from '@/components/AnimatedRobot';
import { Cover } from '@/components/ui/cover';


export const HeroSection = () => {
    return (
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background/95 to-primary/5">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />

            {/* Floating particles effect */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-primary/30 rounded-full"
                        initial={{
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight,
                        }}
                        animate={{
                            y: [null, Math.random() * window.innerHeight],
                            x: [null, Math.random() * window.innerWidth],
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            repeatType: "reverse",
                        }}
                    />
                ))}
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-6 text-center lg:text-left"
                    >
                        {/* Main heading */}
                        <h1 className="text-5xl md:text-7xl font-bold">
                            <Cover>
                                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
                                    Portal Inteligente
                                </span>
                            </Cover>
                            <br />
                            <span className="text-foreground">de Treinamento</span>
                        </h1>

                        {/* Description */}
                        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto lg:mx-0">
                            Plataforma unificada de treinamento com IA integrada para múltiplos clientes.
                            Aprenda, evolua e conquiste com tecnologia de ponta.
                        </p>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex flex-wrap justify-center lg:justify-start gap-8 pt-4"
                        >
                            <div className="flex items-center gap-3 px-6 py-3 rounded-lg bg-card/50 backdrop-blur-sm border border-border">
                                <div className="p-2 rounded-full bg-primary/10">
                                    <Users className="w-5 h-5 text-primary" />
                                </div>
                                <div className="text-left">
                                    <div className="text-2xl font-bold">5</div>
                                    <div className="text-sm text-muted-foreground">Clientes</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 px-6 py-3 rounded-lg bg-card/50 backdrop-blur-sm border border-border">
                                <div className="p-2 rounded-full bg-accent/10">
                                    <Search className="w-5 h-5 text-accent" />
                                </div>
                                <div className="text-left">
                                    <div className="text-2xl font-bold">RAG</div>
                                    <div className="text-sm text-muted-foreground">IA Contextual</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 px-6 py-3 rounded-lg bg-card/50 backdrop-blur-sm border border-border">
                                <div className="p-2 rounded-full bg-primary/10">
                                    <Sparkles className="w-5 h-5 text-primary" />
                                </div>
                                <div className="text-left">
                                    <div className="text-2xl font-bold">Groq</div>
                                    <div className="text-sm text-muted-foreground">Powered</div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Robot */}
                    <div className="relative flex justify-center lg:justify-end">
                        <AnimatedRobot />

                        {/* CTA Button positioned at robot's legs */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="absolute bottom-52 left-1/4 transform -translate-x-1/2 sm:bottom-40 lg:bottom-44 lg:left-1/4"
                        >
                            <button className="group relative px-8 py-4 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                <span className="relative z-10 flex items-center gap-2">
                                    Agente IA AeC
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </span>
                                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </button>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-2"
                >
                    <motion.div className="w-1 h-2 bg-primary rounded-full" />
                </motion.div>
            </motion.div>
        </section>
    );
};
