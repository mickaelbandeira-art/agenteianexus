import { motion } from "framer-motion";
import { ParticlesBackground } from "./ParticlesBackground";
import { ClientCarousel3D } from "./ClientCarousel3D";
import aecLogo from "@/assets/aec-logo-new.png";

export const FuturisticHeroSection = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d1f35] to-[#0a1628] overflow-hidden">
      {/* Animated Particles Background */}
      <ParticlesBackground />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(34, 211, 238, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(34, 211, 238, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-20 pb-12">
        {/* Header with Title and Logo */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 mb-12">
          {/* Title Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-cyan-400 text-sm font-medium">
                Plataforma Integrada com IA
              </span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Portal Inteligente
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
                de Treinamento
              </span>
            </h1>

            <p className="text-slate-300 text-lg md:text-xl max-w-xl leading-relaxed">
              Plataforma unificada de capacitação com Inteligência Artificial
              integrada. Treinamentos personalizados para cada operação.
            </p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex gap-8 mt-8"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">5+</div>
                <div className="text-sm text-slate-400">Clientes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">IA</div>
                <div className="text-sm text-slate-400">Integrada</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">24/7</div>
                <div className="text-sm text-slate-400">Disponível</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="hidden md:block"
          >
            <img
              src={aecLogo}
              alt="AeC Logo"
              className="h-16 lg:h-20 object-contain filter brightness-110"
            />
          </motion.div>
        </div>

        {/* Carousel Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-2">
            Selecione seu Cliente
          </h2>
          <p className="text-slate-400">
            Clique em um card para acessar o portal exclusivo
          </p>
        </motion.div>

        {/* 3D Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <ClientCarousel3D />
        </motion.div>

        {/* Bottom Gradient Line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.2, duration: 1, ease: "easeOut" }}
          className="mt-12 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"
        />
      </div>

      {/* Corner Decorations */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-cyan-500/10 to-transparent blur-3xl" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-teal-500/10 to-transparent blur-3xl" />
    </section>
  );
};
