"use client";

import { useEffect, useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CodePreview({ code, language }: { code: string; language: string }) {
  const [srcDoc, setSrcDoc] = useState("");

  function generateSrcDoc() {
    if (language === "html") {
      setSrcDoc(code);
    } else if (language === "css") {
      setSrcDoc(`<html><style>${code}</style><body><div id="root">CSS Preview Mode</div></body></html>`);
    } else if (language === "javascript" || language === "typescript") {
      setSrcDoc(`
        <html>
          <body>
            <div id="root"></div>
            <script>
              const root = document.getElementById('root');
              const oldLog = console.log;
              console.log = (...args) => {
                root.innerHTML += '<div>' + args.join(' ') + '</div>';
                oldLog(...args);
              };
              try {
                ${code}
              } catch (e) {
                root.innerHTML += '<div style="color: red">' + e.message + '</div>';
              }
            </script>
          </body>
        </html>
      `);
    } else {
      setSrcDoc(`<html><body><pre>${code}</pre></body></html>`);
    }
  }

  useEffect(() => {
    generateSrcDoc();
  }, [code, language]);

  return (
    <div className="flex flex-col h-full border rounded-lg glass overflow-hidden bg-white">
      <div className="p-2 bg-zinc-100 border-b flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
          Live Preview
        </span>
        <Button size="icon" variant="ghost" className="h-6 w-6 text-zinc-500" onClick={generateSrcDoc}>
          <RotateCcw className="h-3 w-3" />
        </Button>
      </div>
      <iframe
        srcDoc={srcDoc}
        title="preview"
        sandbox="allow-scripts"
        className="flex-1 w-full border-none"
      />
    </div>
  );
}
