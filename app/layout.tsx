import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TECH GIRL • UnDF 2026/2027",
  description: "Códigos que incluem. Espaço privado de execução do programa TECH GIRL da UnDF.",
  robots: { index: false, follow: false },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
