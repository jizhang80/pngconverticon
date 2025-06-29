"use client";
import React, { useRef, useState } from "react";
import Button from "./_components/Button";
import { resizePNG, createICO, downloadICO } from "@/app/_tool/convert";

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const resized = await resizePNG(file);
      const ico = createICO(resized);
      const base = file.name.replace(/\.[^.]+$/, "");
      downloadICO(ico, `${base}.ico`);
      setFileName(`${base}.ico`);
    } catch (err) {
      console.error("Conversion failed:", err);
      alert("Failed to convert PNG to ICO.");
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <p className="mb-2 tracking-[-.01em]">
          Get started by{" "}
          <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
            Open PNG File
          </code>
          .
        </p>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <input
            type="file"
            accept="image/png"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <Button name="Open PNG File" onClick={handleButtonClick} />
          {fileName && (
            <p className="mt-2 text-green-700">
              Downloaded: <strong>{fileName}</strong>
            </p>
          )}
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        {/* leave empty footer here*/}
      </footer>
    </div>
  );
}
