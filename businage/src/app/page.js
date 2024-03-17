"use client";

import { permanentRedirect } from "next/navigation";
import { useEffect } from "react";

export default function Home() {

  permanentRedirect("/product-inventory");

  return (

      <main className="grid min-h-screen place-items-center p-24 text-9xl">
        <div>LOADING...</div>
      </main>
  );
}
