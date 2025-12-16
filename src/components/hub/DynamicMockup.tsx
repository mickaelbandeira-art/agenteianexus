import { motion } from "framer-motion";
import heroCharacter from "@/assets/hero-character.png";

export const DynamicMockup = () => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] flex items-center justify-center p-4"
        >
            {/* Main futuristic panel */}
            <div className="relative w-full h-full max-h-[600px] rounded-[48px] overflow-hidden">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e27] via-[#1a0b2e] to-[#0f172a] opacity-95" />

                {/* Animated Pulsing Shadow/Glow */}
                <motion.div
                    animate={{
                        boxShadow: [
                            "0 0 60px rgba(0, 255, 255, 0.4), inset 0 0 80px rgba(0, 255, 255, 0.05)",
                            "0 0 100px rgba(0, 255, 255, 0.6), inset 0 0 100px rgba(0, 255, 255, 0.1)",
                            "0 0 60px rgba(0, 255, 255, 0.4), inset 0 0 80px rgba(0, 255, 255, 0.05)"
                        ]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-[48px]"
                />

                {/* Holographic Overlay Animation */}
                <motion.div
                    animate={{
                        opacity: [0.3, 0.6, 0.3],
                        backgroundPosition: ["0% 0%", "100% 100%"]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-500/10 to-purple-500/10"
                />

                {/* Glow Orbs */}
                <motion.div
                    animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, -30, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-20 -left-20 w-80 h-80 bg-cyan-500/20 rounded-full blur-[80px]"
                />
                <motion.div
                    animate={{ scale: [1, 1.1, 1], x: [0, -30, 0], y: [0, 30, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -bottom-20 -right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]"
                />

                {/* Scanline Effect */}
                <motion.div
                    animate={{ top: ["-100%", "100%"] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute w-full h-[20%] bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent left-0"
                />

            </div>


            {/* Floating Character Image */}
            <motion.div
                animate={{ y: [-15, 15, -15] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center justify-center z-10"
            >
                <img
                    src={heroCharacter}
                    alt="AI Training Platform Character"
                    className="max-w-[140%] max-h-[150%] object-contain drop-shadow-2xl filter"
                    style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.6))' }}
                />
            </motion.div>
        </motion.div>
    );
};
