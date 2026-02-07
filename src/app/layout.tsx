import type { Metadata } from "next";
import { Inter, Libre_Baskerville, Source_Serif_4 } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre-baskerville",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LLMbench - Comparative Close Reading of AI Outputs",
  description:
    "A tool for humanistic close reading and annotation of LLM outputs side by side.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${libreBaskerville.variable} ${sourceSerif.variable} antialiased font-sans`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
