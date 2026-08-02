import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme";
import { StoreProvider } from "@/lib/store";

const geistSans = Geist({
  variable: "--font-sans-var",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono-var",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "A3 Sistemas — Sites e sistemas para o seu negócio",
  description:
    "A3 Sistemas: sites rápidos e sistemas sob medida para negócios locais, com domínio, hospedagem e manutenção inclusos.",
};

// Evita flash de tema claro antes da hidratação
const themeScript = `(function(){try{var t=localStorage.getItem('painel-gestor:theme')||'dark';if(t==='dark'){document.documentElement.classList.add('dark');document.documentElement.style.colorScheme='dark';}}catch(e){document.documentElement.classList.add('dark');}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full antialiased">
        <ThemeProvider>
          <StoreProvider>
            <div className="ambient" aria-hidden />
            {children}
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
