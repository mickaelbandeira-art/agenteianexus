"use client";

import AutoScroll from "embla-carousel-auto-scroll";
import { Link } from "react-router-dom";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";

interface Logo {
    id: string;
    description: string;
    image: string;
    className?: string;
    href?: string;
}

interface Logos3Props {
    heading?: string;
    logos?: Logo[];
    className?: string;
}

const Logos3 = ({
    heading = "Trusted by these companies",
    logos = [],
}: Logos3Props) => {
    return (
        <section className="py-16">
            <div className="container flex flex-col items-center text-center">
                <h2 className="my-6 text-3xl font-bold text-pretty lg:text-5xl">
                    {heading}
                </h2>
            </div>
            <div className="pt-10 md:pt-16 lg:pt-20">
                <div className="relative mx-auto flex items-center justify-center lg:max-w-5xl">
                    <Carousel
                        opts={{ loop: true }}
                        plugins={[AutoScroll({ playOnInit: true, speed: 1 })]}
                    >
                        <CarouselContent className="ml-0">
                            {logos.map((logo) => (
                                <CarouselItem
                                    key={logo.id}
                                    className="flex basis-1/2 justify-center pl-0 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
                                >
                                    <div className="mx-16 flex shrink-0 items-center justify-center">
                                        {logo.href ? (
                                            <Link to={logo.href} className="block transition-transform hover:scale-110">
                                                <img
                                                    src={logo.image}
                                                    alt={logo.description}
                                                    className={logo.className || "h-12 w-auto"}
                                                />
                                            </Link>
                                        ) : (
                                            <img
                                                src={logo.image}
                                                alt={logo.description}
                                                className={logo.className || "h-12 w-auto"}
                                            />
                                        )}
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                    <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent pointer-events-none"></div>
                    <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent pointer-events-none"></div>
                </div>
            </div>
        </section>
    );
};

export { Logos3 };
