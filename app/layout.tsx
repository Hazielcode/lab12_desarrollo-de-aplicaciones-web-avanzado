import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Toaster } from "sonner";
import { Zap } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Biblioteca // Antigravity",
  description: "Gestión avanzada de bibliotecas impulsada por Antigravity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.className} bg-black text-white min-h-screen flex flex-col selection:bg-white/20`}>
        <nav className="border-b border-white/5 bg-black/40 backdrop-blur-2xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-3 text-lg font-medium text-white hover:opacity-80 transition-opacity">
                <div className="bg-white text-black p-1 rounded-sm">
                  <Zap className="h-4 w-4" fill="currentColor" />
                </div>
                <span className="tracking-tight font-semibold">Biblioteca Antigravity</span>
              </Link>
              <div className="flex gap-8 text-sm font-medium tracking-wide">
                <Link href="/" className="text-zinc-400 hover:text-white transition-colors">
                  Autores
                </Link>
                <Link href="/books" className="text-zinc-400 hover:text-white transition-colors">
                  Buscador de Libros
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full">
          {children}
        </main>
        <Toaster theme="dark" position="bottom-right" toastOptions={{ style: { background: '#000', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' } }} />
      </body>
    </html>
  );
}
