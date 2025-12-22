import { motion } from "framer-motion";
import { ParticlesBackground } from "./ParticlesBackground";
import { DynamicMockup } from "./DynamicMockup";
import aecLogo from "@/assets/aec-logo-new.png";

export const BentoHeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Particles Background */}
      <ParticlesBackground />

      {/* Animated grid pattern */}
      <div className="absolute inset-0 opacity-[0.15]">
        <div
          className="absolute inset-0 animate-pulse"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(96, 165, 250, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(96, 165, 250, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            animation: "grid-flow 20s linear infinite",
          }}
        />
      </div>

      {/* Dynamic gradient orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: "2s" }} />

      {/* Gradient overlays with depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950/90 z-[1]" />


      {/* Subtle scanline effect */}
      <div className="absolute inset-0 z-[1] opacity-[0.03]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-16 pb-0 lg:pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8 text-center lg:text-left"
          >
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight"
              >
                <span className="text-white">Portal Inteligente</span>
                <br />
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  de Treinamento
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg md:text-xl text-slate-300 max-w-lg mx-auto lg:mx-0 leading-relaxed"
              >
                Plataforma unificada de treinamento com IA integrada para
                múltiplos clientes.{" "}
                <span className="text-cyan-400 font-medium">
                  Aprenda, evolua e conquiste
                </span>{" "}
                com tecnologia de ponta.
              </motion.p>
            </div>

            {/* Stats or Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap justify-center lg:justify-start gap-8 pt-4"
            >
              {[
                { value: "5+", label: "Clientes" },
                { value: "IA", label: "Integrada" },
                { value: "24/7", label: "Disponível" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Side - Dynamic Mockup + AeC Logo */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="flex flex-col gap-6"
          >
            {/* Dynamic Mockup */}
            <DynamicMockup />


          </motion.div>
        </div>
      </div>
    </section>
  );
};
