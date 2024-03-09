"use client";

import { permanentRedirect } from "next/navigation";
import { useEffect } from "react";
import { NextUIProvider } from "@nextui-org/react";

export default function Home() {
  useEffect(() => {
    permanentRedirect("/product-inventory");
  }, []);

  return (
    <NextUIProvider>
      <main className="grid min-h-screen place-items-center p-24 text-9xl">
        <div>LOADING...</div>
      </main>
    </NextUIProvider>
  );
}
