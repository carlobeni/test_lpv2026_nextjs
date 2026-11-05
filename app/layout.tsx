import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Huellas — Galería Minimalista de Perros y Gatos",
  description:
    "Espacio minimalista de colores claros para descubrir y conocer perros y gatos.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#faf9f6] text-stone-900 selection:bg-amber-100 selection:text-stone-900">
        {children}
      </body>
    </html>
  );
}
