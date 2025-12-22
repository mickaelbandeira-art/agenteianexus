import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface Client {
    name: string;
    logo: string;
    color: string;
    href: string;
}

const clients: Client[] = [
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

export const ClientCards = () => {
    return (
        <section className="relative pt-0 pb-16 bg-gradient-to-b from-slate-950 to-slate-900">
            <div className="container mx-auto px-4">
                {/* Grid of client cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {clients.map((client, index) => (
                        <motion.div
                            key={client.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Link to={client.href}>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="relative group h-32 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
                                    style={{
                                        backgroundColor: client.color,
                                    }}
                                >
                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />

                                    {/* Logo container */}
                                    <div className="relative h-full flex items-center justify-center p-6">
                                        <img
                                            src={client.logo}
                                            alt={client.name}
                                            className="max-w-full max-h-full object-contain filter brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                                        />
                                    </div>

                                    {/* Glow effect on hover */}
                                    <motion.div
                                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        style={{
                                            boxShadow: `0 0 30px ${client.color}80`,
                                        }}
                                    />

                                    {/* Border */}
                                    <div className="absolute inset-0 rounded-2xl border-2 border-white/10 group-hover:border-white/30 transition-all duration-300" />
                                </motion.div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
