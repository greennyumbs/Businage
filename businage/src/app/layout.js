import { Inter } from "next/font/google";
import "./globals.css";
import { NextUIProvider } from "@nextui-org/react";
import { Providers } from "./providers";

import Sidebar from "./components/navigation/sidebar";
import Topbar from "./components/navigation/topbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Businage",
  description: "",
};



export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <Providers>
        <body className={inter.className}>
          <div className="h-screen bg-slate-100">
            <Sidebar />
            <Topbar />

            <main className="ms-60 pt-14 z-0 bg-slate-100">
              {children}
              
            </main>

          </div>

        </body>
      </Providers>
    </html>
  );
}
