import type { Metadata } from "next";
import { Poppins, Press_Start_2P, Orbitron } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});


const pressStart = Press_Start_2P({
  weight: "400",      // mandatory
  subsets: ["latin"],
  variable: "--font-press-start",
});

const orbitron = Orbitron({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-orbitron",
});

export const metadata: Metadata = {
  title: "Gen AI Arcade",
  description: "MLSC VIT Pune's Gen AI Arcade"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${pressStart.variable} font-press-start  antialiased ${orbitron.variable}`}
      >
        {children}
      </body>
    </html>
  );
}

