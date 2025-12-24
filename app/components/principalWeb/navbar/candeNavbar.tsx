"use client";
import { url } from "inspector";
import { useState } from "react";

// Ahora cada item tiene label y sections
const menuItems = [
    {
        label: "Twitch",
        sections: [
            { title: "Canal Oficial", description: "Transmisiones en vivo", url: "https://www.twitch.tv/candemorracingteam" },
        ],
    },
    {
        label: "Comunidad",
        sections: [
            { title: "Discord", description: "Únete a la comunidad", url: "https://discord.gg/HHusseuHwx" },
            { title: "Pinturas", description: "Personaliza tu coche", url: "https://www.tradingpaints.com/profile/640319/Alejandro-Guerrero" },
            { title: "Merch", description: "Compra productos oficiales", url: "https://candemor-racing-communiteam-shop.fourthwall.com/en-eur" },
        ],
    },
    {
        label: "Giti & Sparco",
        sections: [
            { title: "¿Quiénes son?", description: "Conoce a nuestros sponsors" },
            { title: "Ligas", description: "Competiciones anuales" },
            { title: "Experiencias", description: "Historias de pilotos" },
        ],
    },
    {
        label: "Candeonato",
        sections: [
            { title: "¿Qué es?", description: "Descubre el campeonato" },
            { title: "Eventos", description: "Fechas y circuitos" },
            { title: "Media", description: "Fotos y vídeos" },
        ],
    },
];


export function CandeNavbar() {
    const [hoverItem, setHoverItem] = useState<string | null>(null);

    // Dividir en dos mitades
    const half = Math.ceil(menuItems.length / 2);
    const leftItems = menuItems.slice(0, half);
    const rightItems = menuItems.slice(half);

    return (
        <nav className="absolute bg-[#0a0a0aaf] text-white w-full z-50">
            <ul className="flex justify-center gap-10 items-center h-16 text-sm font-medium">
                {/* Lado izquierdo */}
                {leftItems.map((item) => (
                    <li
                        key={item.label}
                        onMouseEnter={() => setHoverItem(item.label)}
                        onMouseLeave={() => setHoverItem(null)}
                        className="cursor-pointer h-full flex items-center basis-5vw basis-0 text-center hover:scale-110 transition-all duration-300"
                    >
                        {item.label}
                    </li>
                ))}

                {/* CANDEMOR siempre en el centro */}
                <li className="font-bold text-2xl tracking-[2px] cursor-pointer hover:scale-110 transition-all duration-300">
                    <a href="">
                        <p className="dogRough">CANDEMOR</p>
                    </a>
                </li>

                {/* Lado derecho */}
                {rightItems.map((item) => (
                    <li
                        key={item.label}
                        onMouseEnter={() => setHoverItem(item.label)}
                        onMouseLeave={() => setHoverItem(null)}
                        className="cursor-pointer h-full flex items-center basis-5vw basis-0 text-center hover:scale-110 transition-all duration-300"
                    >
                        {item.label}
                    </li>
                ))}
            </ul>

            {/* Dropdown mega menú */}
            <div
                className={`absolute top-full w-full bg-white text-black border border-gray-200
                    transition-all duration-500 ease-in-out
                    ${hoverItem ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5 pointer-events-none"}`}
                onMouseEnter={() => hoverItem && setHoverItem(hoverItem)}
                onMouseLeave={() => setHoverItem(null)}
            >
                <div className="flex justify-around h-40 items-center">
                    {menuItems
                        .find((item) => item.label === hoverItem)
                        ?.sections.map((section) => (
                            <div key={section.title} className="flex flex-col items-center text-center basis-0 grow hover:scale-110 transition-all duration-500">
                                {section.url ? (
                                    <a href={section.url} target="_blank" rel="noopener noreferrer" className="block ">
                                        <h3 className="font-semibold">{section.title}</h3>
                                        <p className="text-gray-600">{section.description}</p>
                                    </a>
                                ) : (
                                    <div>
                                        <h3 className="font-semibold">{section.title}</h3>
                                        <p className="text-gray-600">{section.description}</p>
                                    </div>
                                )}
                            </div>
                        ))}

                </div>
            </div>
        </nav>
    );
}
