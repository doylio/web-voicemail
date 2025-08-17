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
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold">
            {process.env.NEXT_PUBLIC_APP_TITLE || "Voicemail"}
          </h1>
          <p className="text-sm text-gray-500">
            Leave a message after the beep.
          </p>
        </div>
        <RecorderClient />
      </main>
    </div>
  );
}
