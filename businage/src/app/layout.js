import { Inter } from "next/font/google";
import "./globals.css";
import { NextUIProvider } from "@nextui-org/react";
import {Providers} from "./providers";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Businage",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Providers>
        <body className={inter.className}>{children}</body>
      </Providers>
    </html>
  );
}
