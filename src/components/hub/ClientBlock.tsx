import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useState } from "react";

interface ClientBlockProps {
  name: string;
  logo: string;
  color: string;
  href: string;
  className?: string;
  index?: number;
}

export const ClientBlock = ({
  name,
  logo,
  color,
  href,
  className,
  index = 0,
}: ClientBlockProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Mouse position tracking for 3D tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), {
    stiffness: 150,
    damping: 15,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 150,
    damping: 15,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const x = (e.clientX - centerX) / (rect.width / 2);
    const y = (e.clientY - centerY) / (rect.height / 2);

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut",
      }}
      className={cn("relative", className)}
      style={{
        perspective: "1000px",
      }}
    >
      <Link to={href} className="block w-full h-full">
        <motion.div
          className={cn(
            "relative w-full h-full rounded-2xl overflow-hidden cursor-pointer group",
            "flex items-center justify-center",
            "shadow-lg",
          )}
          style={{
            backgroundColor: color,
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          whileHover={{
            scale: 1.05,
            transition: { duration: 0.3, ease: "easeOut" },
          }}
          whileTap={{ scale: 0.97 }}
        >
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Logo with enhanced effects */}
          <motion.div
            className="relative z-10"
            animate={{
              y: isHovered ? -5 : 0,
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <motion.img
              src={logo}
              alt={name}
              className="h-10 md:h-14 lg:h-16 object-contain filter brightness-0 invert drop-shadow-lg"
              animate={{
                scale: isHovered ? 1.1 : 1,
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </motion.div>

          {/* Premium name tag */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/50 to-transparent backdrop-blur-md"
            initial={{ y: "100%" }}
            animate={{ y: isHovered ? 0 : "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="flex items-center justify-between">
              <span className="text-white font-bold text-sm md:text-base tracking-wide">
                {name}
              </span>
              <Sparkles className="text-white/80 w-4 h-4" />
            </div>
          </motion.div>

          {/* Enhanced arrow icon */}
          <motion.div
            className="absolute top-4 right-4 z-20"
            initial={{ opacity: 0, x: -10, y: 10 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              x: isHovered ? 0 : -10,
              y: isHovered ? 0 : 10,
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <motion.div
              className="p-2 bg-white/25 rounded-full backdrop-blur-md border border-white/30 shadow-lg"
              whileHover={{ scale: 1.1, rotate: 45 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowUpRight className="text-white w-4 h-4 md:w-5 md:h-5" />
            </motion.div>
          </motion.div>

          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-16 h-16 opacity-0 group-hover:opacity-30 transition-opacity duration-500">
            <div className="absolute top-3 left-3 w-8 h-[2px] bg-white rounded-full" />
            <div className="absolute top-3 left-3 w-[2px] h-8 bg-white rounded-full" />
          </div>
          <div className="absolute bottom-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-30 transition-opacity duration-500">
            <div className="absolute bottom-3 right-3 w-8 h-[2px] bg-white rounded-full" />
            <div className="absolute bottom-3 right-3 w-[2px] h-8 bg-white rounded-full" />
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};
