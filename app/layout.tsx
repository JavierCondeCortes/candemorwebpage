import type { Metadata } from "next";
import { Montserrat} from "next/font/google";
import "./globals.css";

const Montse = Montserrat({
  variable: "--font-Montserrat",
  subsets: ["latin"],
  weight:"500",
});

export const metadata: Metadata = {
  title: "Candemor Community Team",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${Montse.variable} select-none`}
      >
        {children}
      </body>
    </html>
  );
}
