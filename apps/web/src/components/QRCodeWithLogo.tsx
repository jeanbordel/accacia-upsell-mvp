"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import Image from "next/image";

interface QRCodeWithLogoProps {
  url: string;
  hotelName: string;
  logoUrl?: string;
  size?: number;
}

export default function QRCodeWithLogo({
  url,
  hotelName,
  logoUrl,
  size = 300,
}: QRCodeWithLogoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    const generateQR = async () => {
      if (!canvasRef.current) return;

      try {
        setIsGenerating(true);
        setError(null);

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Could not get canvas context");

        // Generate base QR code
        await QRCode.toCanvas(canvas, url, {
          width: size,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
          errorCorrectionLevel: "H", // High error correction allows for logo overlay
        });

        // If logo exists, overlay it
        if (logoUrl) {
          const img = document.createElement("img");
          img.crossOrigin = "anonymous";
          
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = logoUrl;
          });

          // Calculate logo size (about 20% of QR code)
          const logoSize = size * 0.2;
          const logoX = (size - logoSize) / 2;
          const logoY = (size - logoSize) / 2;

          // Draw white background for logo
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10);

          // Draw logo
          ctx.drawImage(img, logoX, logoY, logoSize, logoSize);
        }

        setIsGenerating(false);
      } catch (err) {
        console.error("QR generation error:", err);
        setError("Failed to generate QR code");
        setIsGenerating(false);
      }
    };

    generateQR();
  }, [url, logoUrl, size]);

  const handleDownload = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = `qr-${hotelName.toLowerCase().replace(/\s+/g, "-")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative rounded-lg border-2 border-gray-200 bg-white p-4 shadow-sm">
        {isGenerating && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80">
            <div className="text-sm text-gray-500">Generating...</div>
          </div>
        )}
        
        {error ? (
          <div className="flex h-[300px] w-[300px] items-center justify-center text-red-500">
            {error}
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            width={size}
            height={size}
            className="block"
          />
        )}
      </div>

      <div className="text-center">
        <div className="mb-1 text-sm font-medium text-gray-700">{hotelName}</div>
        <div className="text-xs text-gray-500">
          {logoUrl ? "QR Code with hotel branding" : "QR Code"}
        </div>
      </div>

      <button
        onClick={handleDownload}
        disabled={isGenerating || !!error}
        className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Download QR Code
      </button>
    </div>
  );
}
