import { motion } from "framer-motion";
import { ParticlesBackground } from "./ParticlesBackground";
import { ClientBlock } from "./ClientBlock";
import aecLogo from "@/assets/aec-logo-new.png";

const clients = [
  {
    name: "Claro",
    logo: "/logos/claro.png",
    color: "#DA291C",
    href: "/clients/claro",
  },
  {
    name: "iFood",
    logo: "/logos/ifood.png",
    color: "#EA1D2C",
    href: "/clients/ifood",
  },
  {
    name: "iFood Pago",
    logo: "/logos/ifood-pago.png",
    color: "#6C1D45",
    href: "/clients/ifood-pago",
  },
  {
    name: "Ton",
    logo: "/logos/ton.png",
    color: "#00C853",
    href: "/clients/ton",
  },
  {
    name: "Inter",
    logo: "/logos/inter.png",
    color: "#FF7A00",
    href: "/clients/inter",
  },
];

export const BentoHeroSection = () => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Particles Background */}
      <ParticlesBackground />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/80 z-[1]" />
      <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-cyan-500/5 to-transparent z-[1]" />
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-purple-500/5 to-transparent z-[1]" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100vh-8rem)]">
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

          {/* Right Side - Bento Grid + AeC Logo */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="flex flex-col gap-6"
          >
            {/* Bento Grid */}
            <div className="grid grid-cols-3 grid-rows-3 gap-3 h-[400px] md:h-[450px] lg:h-[500px]">
              {/* Claro - Column 1, Rows 1-2 */}
              <ClientBlock
                name={clients[0].name}
                logo={clients[0].logo}
                color={clients[0].color}
                href={clients[0].href}
                index={0}
                className="col-span-1 row-span-2"
              />

              {/* iFood - Columns 2-3, Row 1 */}
              <ClientBlock
                name={clients[1].name}
                logo={clients[1].logo}
                color={clients[1].color}
                href={clients[1].href}
                index={1}
                className="col-span-2 row-span-1"
              />

              {/* iFood Pago - Column 2, Row 2 */}
              <ClientBlock
                name={clients[2].name}
                logo={clients[2].logo}
                color={clients[2].color}
                href={clients[2].href}
                index={2}
                className="col-span-1 row-span-1"
              />

              {/* Ton - Column 3, Row 2 */}
              <ClientBlock
                name={clients[3].name}
                logo={clients[3].logo}
                color={clients[3].color}
                href={clients[3].href}
                index={3}
                className="col-span-1 row-span-1"
              />

              {/* Inter - Columns 1-3, Row 3 */}
              <ClientBlock
                name={clients[4].name}
                logo={clients[4].logo}
                color={clients[4].color}
                href={clients[4].href}
                index={4}
                className="col-span-3 row-span-1"
              />
            </div>

            {/* AeC Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex justify-end items-center gap-3"
            >
              <span className="text-slate-400 text-sm">Powered by</span>
              <img
                src={aecLogo}
                alt="AeC"
                className="h-10 md:h-12 object-contain opacity-90 hover:opacity-100 transition-opacity"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
