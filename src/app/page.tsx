"use client";

import dynamic from "next/dynamic";
import React from "react";

const RecorderClient = dynamic(() => import("@/components/RecorderClient"), {
  ssr: false,
});

export default function Home(): React.JSX.Element {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <main className="w-full max-w-4xl">
        <RecorderClient />
      </main>
    </div>
  );
}
