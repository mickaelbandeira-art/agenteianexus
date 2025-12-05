import React, { type SVGProps } from "react";

// Claro Logo
export function ClaroIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <img
            src="/logos/claro.png"
            alt="Claro"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            {...props as any}
        />
    );
}

// iFood Logo
export function IFoodIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <img
            src="/logos/ifood.png"
            alt="iFood"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            {...props as any}
        />
    );
}

// iFood Pago Logo
export function IFoodPagoIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <img
            src="/logos/ifood-pago-new.png"
            alt="iFood Pago"
            style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter: 'brightness(0) invert(1)'
            }}
            {...props as any}
        />
    );
}

// Inter Logo
export function InterIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <img
            src="/logos/inter.png"
            alt="Inter"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            {...props as any}
        />
    );
}

// Ton Logo
export function TonIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <img
            src="/logos/ton.png"
            alt="Ton"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            {...props as any}
        />
    );
}
