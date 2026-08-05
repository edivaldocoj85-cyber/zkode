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
  title: "Zkode — Sites, Automações e Sistemas sob Medida",
  description:
    "Desenvolvemos sites, automações com IA e sistemas sob medida — com gestão de projetos, custos e propostas em um painel próprio. Orçamento grátis em até 48h.",
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
