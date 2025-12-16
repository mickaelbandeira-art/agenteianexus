import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User } from "lucide-react";

interface Gestor {
    nome: string;
    cargo: string;
    foto: string;
}

const gestores: Gestor[] = [
    {
        nome: "Jonathan Lins da Silva",
        cargo: "Gerente",
        foto: ""
    },
    {
        nome: "Kelciane Cavalcante de Lima",
        cargo: "Coordenadora",
        foto: ""
    },
    {
        nome: "Izaura de Araújo Bezerra",
        cargo: "Coordenadora",
        foto: ""
    },
    {
        nome: "Maria Clara da Silva Santos",
        cargo: "Supervisora",
        foto: ""
    },
    {
        nome: "Mariana Pereira Veras",
        cargo: "Supervisora",
        foto: ""
    },
    {
        nome: "Silvia Rafaela Santos Silva",
        cargo: "Supervisora",
        foto: ""
    },
    {
        nome: "Paulo Guilherme dos Anjos Castiliani",
        cargo: "Supervisor",
        foto: ""
    },
    {
        nome: "Julio Cesar Alves da Silva Santos",
        cargo: "Supervisor",
        foto: ""
    },
    {
        nome: "Elielza Karolyne dos Santos",
        cargo: "Supervisora",
        foto: ""
    }
];

export const GestoresCarousel = () => {
    const [activeGestor, setActiveGestor] = useState<string | null>(null);

    const handleAvatarClick = (nome: string) => {
        setActiveGestor(activeGestor === nome ? null : nome);
    };

    return (
        <div className="w-full relative py-12" style={{
            backgroundImage: "radial-gradient(#ffffff20 1px, transparent 1px)",
            backgroundSize: "20px 20px"
        }}>
            <div className="flex gap-6 overflow-x-auto scroll-smooth py-12 px-4 no-scrollbar items-center justify-start lg:justify-center">
                {gestores.map((gestor, index) => (
                    <div key={index} className="relative flex-shrink-0 group">
                        {/* Card Popup */}
                        <AnimatePresence>
                            {activeGestor === gestor.nome && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute -top-32 left-1/2 -translate-x-1/2 w-64 bg-black/70 backdrop-blur-md rounded-xl p-4 shadow-xl z-20 border border-white/10 flex flex-col items-center text-center"
                                >
                                    <h3 className="text-white font-semibold text-sm mb-1 leading-tight">
                                        {gestor.nome}
                                    </h3>
                                    <p className="text-gray-300 text-xs mb-3">{gestor.cargo}</p>

                                    <button className="bg-white text-black text-xs font-semibold rounded-lg px-4 py-2 shadow hover:bg-gray-100 transition-colors w-full">
                                        👉 Ver mais sobre {gestor.nome.split(" ")[0]}
                                    </button>

                                    {/* Arrow Indicator */}
                                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-black/70 backdrop-blur-md rotate-45 border-r border-b border-white/10"></div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Avatar Circle */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAvatarClick(gestor.nome)}
                            className={`w-24 h-24 rounded-full shadow-lg cursor-pointer transition-all duration-300 border-2 overflow-hidden flex items-center justify-center bg-slate-800 ${activeGestor === gestor.nome
                                    ? "border-cyan-400 ring-4 ring-cyan-400/20 scale-105"
                                    : "border-slate-700 hover:border-slate-500"
                                }`}
                        >
                            {gestor.foto ? (
                                <img
                                    src={gestor.foto}
                                    alt={gestor.nome}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User className="w-10 h-10 text-slate-400" />
                            )}
                        </motion.div>

                        {/* Name label below (optional, not strictly requested but good for UX if card is hidden) */}
                        {!activeGestor && (
                            <p className="mt-3 text-center text-xs text-slate-400 font-medium max-w-[96px] truncate opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-8 left-1/2 -translate-x-1/2">
                                {gestor.nome.split(" ")[0]}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
