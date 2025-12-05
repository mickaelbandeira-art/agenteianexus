import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

// Import client card images
import claroCard from "@/assets/cards/claro-card.png";
import ifoodCard from "@/assets/cards/ifood-card.png";
import ifoodPagoCard from "@/assets/cards/ifood-pago-card.png";
import tonCard from "@/assets/cards/ton-card.png";
import interCard from "@/assets/cards/inter-card.png";

const clients = [
  {
    name: "Claro",
    image: claroCard,
    href: "/clients/claro",
  },
  {
    name: "iFood",
    image: ifoodCard,
    href: "/clients/ifood",
  },
  {
    name: "iFood Pago",
    image: ifoodPagoCard,
    href: "/clients/ifood-pago",
  },
  {
    name: "Ton",
    image: tonCard,
    href: "/clients/ton",
  },
  {
    name: "Inter",
    image: interCard,
    href: "/clients/inter",
  },
];

export const ClientCarousel3D = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    onSelect();

    // Auto-play
    const autoplay = setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0);
      }
    }, 5000);

    return () => {
      clearInterval(autoplay);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const getCardStyle = (index: number) => {
    const distance = Math.abs(index - selectedIndex);
    const isActive = index === selectedIndex;

    // Handle wrap-around for loop
    const adjustedDistance = Math.min(
      distance,
      clients.length - distance
    );

    return {
      transform: isActive
        ? "scale(1) translateZ(0)"
        : `scale(${1 - adjustedDistance * 0.12}) translateZ(${-adjustedDistance * 50}px)`,
      opacity: isActive ? 1 : 1 - adjustedDistance * 0.25,
      filter: isActive ? "none" : `blur(${adjustedDistance * 1.5}px)`,
      zIndex: 10 - adjustedDistance,
    };
  };

  return (
    <div className="relative w-full py-8">
      {/* Carousel Container */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4 md:gap-6 lg:gap-8 items-center">
          {clients.map((client, index) => (
            <motion.div
              key={client.name}
              className="flex-[0_0_70%] md:flex-[0_0_45%] lg:flex-[0_0_35%] min-w-0"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              style={getCardStyle(index)}
            >
              <Link
                to={client.href}
                className="block relative group"
              >
                <motion.div
                  className="relative overflow-hidden rounded-2xl"
                  whileHover={{
                    scale: 1.03,
                    transition: { duration: 0.3 },
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Card Image */}
                  <img
                    src={client.image}
                    alt={`${client.name} Portal`}
                    className="w-full h-auto object-cover transition-all duration-500"
                    draggable={false}
                  />

                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 via-transparent to-transparent" />
                    <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(34,211,238,0.3)]" />
                  </div>

                  {/* Bottom Glow Bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-center items-center gap-4 mt-8">
        {/* Previous Button */}
        <motion.button
          onClick={scrollPrev}
          className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 backdrop-blur-sm"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft className="w-6 h-6 text-cyan-400" />
        </motion.button>

        {/* Dots */}
        <div className="flex gap-2">
          {scrollSnaps.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => scrollTo(index)}
              className={`h-3 rounded-full transition-all duration-300 ${
                index === selectedIndex
                  ? "w-8 bg-cyan-400"
                  : "w-3 bg-white/30 hover:bg-white/50"
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>

        {/* Next Button */}
        <motion.button
          onClick={scrollNext}
          className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 backdrop-blur-sm"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight className="w-6 h-6 text-cyan-400" />
        </motion.button>
      </div>
    </div>
  );
};
