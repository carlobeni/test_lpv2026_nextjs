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
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var a=['bis_skin_checked','bis_register'];var c=function(r){if(!r||!r.querySelectorAll)return;a.forEach(function(k){if(r.removeAttribute&&r.hasAttribute&&r.hasAttribute(k))r.removeAttribute(k);r.querySelectorAll('['+k+']').forEach(function(el){el.removeAttribute(k);});});};c(document.documentElement);new MutationObserver(function(m){for(var i=0;i<m.length;i++){var t=m[i].target;if(t&&t.removeAttribute&&m[i].attributeName)t.removeAttribute(m[i].attributeName);}}).observe(document.documentElement,{attributes:true,subtree:true,attributeFilter:a});}catch(e){}})();`,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-[#faf9f6] text-stone-900 selection:bg-amber-100 selection:text-stone-900"
      >
        {children}
      </body>
    </html>
  );
}
