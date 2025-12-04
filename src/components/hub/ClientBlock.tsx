import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

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
    >
      <Link to={href} className="block w-full h-full">
        <motion.div
          className={cn(
            "relative w-full h-full rounded-2xl overflow-hidden cursor-pointer group",
            "flex items-center justify-center",
            "shadow-lg"
          )}
          style={{ backgroundColor: color }}
          whileHover={{
            scale: 1.03,
            boxShadow: `0 0 40px ${color}60`,
          }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Shine effect on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </div>

          {/* Logo */}
          <img
            src={logo}
            alt={name}
            className="h-10 md:h-14 lg:h-16 object-contain filter brightness-0 invert drop-shadow-lg transition-transform duration-300 group-hover:scale-110"
          />

          {/* Name overlay on hover */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-white font-semibold text-sm md:text-base">
              {name}
            </span>
          </div>

          {/* Arrow icon */}
          <motion.div
            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={{ x: -5, y: 5 }}
            whileHover={{ x: 0, y: 0 }}
          >
            <div className="p-1.5 bg-white/20 rounded-full backdrop-blur-sm">
              <ArrowUpRight className="text-white w-4 h-4 md:w-5 md:h-5" />
            </div>
          </motion.div>
        </motion.div>
      </Link>
    </motion.div>
  );
};
