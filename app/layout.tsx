import type { Metadata } from "next";
import { Montserrat, Anton } from "next/font/google";
import "./globals.css";

const monty = Montserrat({
  variable: "--font-monty-sans",
  subsets: ["latin"],
});
const anton = Anton({
  weight: "400",
  variable: "--font-anton-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FaMDB",
  description: "Your one stop movie database",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${monty.variable} ${anton.variable} antialiased flex w-full justify-center`}
      >
        {children}
      </body>
    </html>
  );
}
