import { Providers } from "@/providers";
import "./globals.css";

export const metadata = {
  title: "DevFlow — Gestão de Desenvolvimento",
  description: "Sistema enterprise de gestão de desenvolvimento de software",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
