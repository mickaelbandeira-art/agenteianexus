"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedMarqueeHeroProps {
    tagline: string;
    title: React.ReactNode;
    description: string;
    ctaText: string;
    images: string[];
    className?: string;
}

const ActionButton = ({ children }: { children: React.ReactNode }) => (
    <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-8 px-8 py-3 rounded-full bg-primary text-white font-semibold shadow-lg transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-75"
    >
        {children}
    </motion.button>
);

export const AnimatedMarqueeHero: React.FC<AnimatedMarqueeHeroProps> = ({
    tagline,
    title,
    description,
    ctaText,
    images,
    className,
}) => {
    const FADE_IN_ANIMATION_VARIANTS = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
    };

    const duplicatedImages = [...images, ...images];

    return (
        <section
            className={cn(
                "relative w-full overflow-hidden bg-background flex flex-col items-center justify-center text-center px-4 py-16",
                className
            )}
        >
            <div className="z-10 flex flex-col items-center mb-12">
                {/* Tagline */}
                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={FADE_IN_ANIMATION_VARIANTS}
                    className="mb-4 inline-block rounded-full border border-border bg-card/50 px-4 py-1.5 text-sm font-medium text-muted-foreground backdrop-blur-sm"
                >
                    {tagline}
                </motion.div>

                {/* Main Title */}
                <motion.h1
                    initial="hidden"
                    animate="show"
                    variants={{
                        hidden: {},
                        show: {
                            transition: {
                                staggerChildren: 0.1,
                            },
                        },
                    }}
                    className="text-4xl md:text-6xl font-bold tracking-tighter text-foreground"
                >
                    {typeof title === 'string' ? (
                        title.split(" ").map((word, i) => (
                            <motion.span
                                key={i}
                                variants={FADE_IN_ANIMATION_VARIANTS}
                                className="inline-block"
                            >
                                {word}&nbsp;
                            </motion.span>
                        ))
                    ) : (
                        title
                    )}
                </motion.h1>

                {/* Description */}
                <motion.p
                    initial="hidden"
                    animate="show"
                    variants={FADE_IN_ANIMATION_VARIANTS}
                    transition={{ delay: 0.5 }}
                    className="mt-6 max-w-xl text-lg text-muted-foreground"
                >
                    {description}
                </motion.p>

                {/* Call to Action Button */}
                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={FADE_IN_ANIMATION_VARIANTS}
                    transition={{ delay: 0.6 }}
                >
                    <ActionButton>{ctaText}</ActionButton>
                </motion.div>
            </div>

            {/* Animated Image Marquee */}
            <div className="relative w-full h-64 md:h-80 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]">
                <motion.div
                    className="flex gap-4"
                    animate={{
                        x: ["-100%", "0%"],
                        transition: {
                            ease: "linear",
                            duration: 40,
                            repeat: Infinity,
                        },
                    }}
                >
                    {duplicatedImages.map((src, index) => (
                        <div
                            key={index}
                            className="relative aspect-[3/4] h-48 md:h-64 flex-shrink-0"
                            style={{
                                rotate: `${(index % 2 === 0 ? -2 : 5)}deg`,
                            }}
                        >
                            <img
                                src={src}
                                alt={`Foto do evento ${index + 1}`}
                                className="w-full h-full object-cover rounded-2xl shadow-md"
                            />
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};
