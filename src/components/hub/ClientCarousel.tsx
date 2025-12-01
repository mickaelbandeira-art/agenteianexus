"use client";

import React from "react";
import { GradientHeading } from "@/components/ui/gradient-heading";
import { LogoCarousel } from "@/components/ui/logo-carousel";
import {
    ClaroIcon,
    IFoodIcon,
    IFoodPagoIcon,
    InterIcon,
    TonIcon,
} from "@/components/hub/ClientIcons";

const allLogos = [
    { name: "Claro", id: 1, img: ClaroIcon, href: "/claro" },
    { name: "iFood", id: 2, img: IFoodIcon, href: "/ifood" },
    { name: "iFood Pago", id: 3, img: IFoodPagoIcon, href: "/ifood-pago" },
    { name: "Inter", id: 4, img: InterIcon, href: "/inter" },
    { name: "Ton", id: 5, img: TonIcon, href: "/ton" },
];

export function ClientCarousel() {
    return (
        <div className="space-y-8 py-24">
            <div className="mx-auto flex w-full max-w-screen-lg flex-col items-center space-y-8">
                <div className="text-center">
                    <GradientHeading variant="secondary">
                        Os melhores já estão aqui
                    </GradientHeading>
                    <GradientHeading size="xl">Escolha seu cliente</GradientHeading>
                </div>

                <LogoCarousel columnCount={2} logos={allLogos} />
            </div>
        </div>
    );
}
