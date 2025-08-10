import React from "react";

import { AnsweringMachine } from "@/components/AnsweringMachine";

export default function Home(): React.JSX.Element {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-100 to-gray-200">
      <main className="w-full max-w-4xl">
        <AnsweringMachine />
      </main>
    </div>
  );
}
