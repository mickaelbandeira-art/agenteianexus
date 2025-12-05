import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BentoHeroSection } from "@/components/hub/BentoHeroSection";
import { AnimatedMarqueeHero } from "@/components/ui/hero-3";
import { motion } from "framer-motion";

const Hub = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1">
        {/* Bento Grid Hero Section */}
        <BentoHeroSection />

        {/* Events Carousel */}
        <AnimatedMarqueeHero
          tagline="Treinamentos AeC"
          title={
            <>
              Nossos Eventos de
              <br />
              Treinamento
            </>
          }
          description="Capacitação de excelência para equipes de alta performance. Veja momentos dos nossos treinamentos presenciais e workshops."
          ctaText="Saiba Mais"
          images={[
            "/eventos/evento-1.jpg",
            "/eventos/evento-2.jpg",
            "/eventos/evento-3.jpg",
            "/eventos/evento-4.jpg",
            "/eventos/evento-5.jpg",
            "/eventos/evento-6.jpg",
            "/eventos/evento-7.jpg",
            "/eventos/evento-8.jpg",
            "/eventos/evento-9.jpg",
            "/eventos/evento-10.jpg",
            "/eventos/evento-11.jpg",
            "/eventos/evento-12.jpg",
            "/eventos/evento-13.jpg",
            "/eventos/evento-14.jpg",
          ]}
        />

        {/* Features Section */}
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              <div className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-3xl">🤖</span>
                </div>
                <h3 className="text-xl font-bold mb-2">IA Contextual</h3>
                <p className="text-muted-foreground">
                  Assistente inteligente com conhecimento específico de cada
                  cliente
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                  <span className="text-3xl">🎮</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Gamificação</h3>
                <p className="text-muted-foreground">
                  Conquistas, pontos, níveis e ranking para motivar seu
                  aprendizado
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-3xl">📚</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Conteúdo Adaptativo</h3>
                <p className="text-muted-foreground">
                  Treinamentos personalizados baseados no seu progresso e
                  desempenho
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Hub;
