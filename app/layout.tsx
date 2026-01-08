import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Candemor - Comunidad Twitch",
  description: "Únete a la comunidad de Candemor en Twitch",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
