"use client";

import { permanentRedirect } from "next/navigation";
import { useEffect } from "react";
import AuthForm from "./components/form/AuthForm";

export default function Home() {
  permanentRedirect("/product-inventory");

  return (
    <main className="grid min-h-screen place-items-center p-24">
      {/* Loading... */}
      <AuthForm />
    </main>
  );
}
