"use client";

import { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Download } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";

interface QrCodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sinkId: string;
  sinkName: string;
  sinkLocation?: string;
}

export function QrCodeModal({
  open,
  onOpenChange,
  sinkId,
  sinkName,
  sinkLocation,
}: QrCodeModalProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const qrCodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/bebedouro/${sinkId}`;
      setQrCodeUrl(url);
    }
  }, [sinkId]);

  const handleGeneratePDF = async () => {
    if (!qrCodeRef.current) return;

    try {
      // Função auxiliar para converter cores lab() para RGB usando canvas
      const convertColorToRgb = (color: string): string => {
        if (!color || color === "transparent" || color === "rgba(0, 0, 0, 0)") {
          return color;
        }

        // Se já é RGB/RGBA/HEX, retornar como está
        if (color.startsWith("rgb") || color.startsWith("#")) {
          return color;
        }

        // Usar canvas para converter cores lab() para RGB
        try {
          const tempCanvas = document.createElement("canvas");
          const ctx = tempCanvas.getContext("2d");
          if (ctx) {
            ctx.fillStyle = color;
            return ctx.fillStyle;
          }
        } catch {
          // Se falhar, retornar cor padrão
        }

        return color;
      };

      const canvas = await html2canvas(qrCodeRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: false,
        onclone: (clonedDoc) => {
          // Converter todas as cores lab() para RGB no documento clonado
          const allElements = clonedDoc.querySelectorAll("*");
          const tempCanvas = document.createElement("canvas");
          const ctx = tempCanvas.getContext("2d");

          if (!ctx) return;

          allElements.forEach((el) => {
            const htmlEl = el as HTMLElement;
            if (!htmlEl) return;

            // Obter estilos do elemento clonado
            const style = htmlEl.style;
            let computedStyle: CSSStyleDeclaration | null = null;

            // Tentar obter computed style do documento clonado ou do documento original
            if (clonedDoc.defaultView) {
              computedStyle = clonedDoc.defaultView.getComputedStyle(htmlEl);
            } else if (
              typeof window !== "undefined" &&
              window.getComputedStyle
            ) {
              // Fallback: usar o documento original (menos ideal, mas funciona)
              const cloneId = htmlEl.getAttribute("data-clone-id") ?? "";
              const originalEl = document.querySelector(
                `[data-clone-id="${cloneId}"]`,
              );
              if (originalEl) {
                computedStyle = window.getComputedStyle(originalEl);
              }
            }

            if (computedStyle) {
              // Converter cor de texto
              const textColor = computedStyle.color;
              if (
                textColor &&
                (textColor.includes("lab") || textColor.includes("oklab"))
              ) {
                const rgbColor = convertColorToRgb(textColor);
                style.color = rgbColor;
              }

              // Converter cor de fundo
              const bgColor = computedStyle.backgroundColor;
              if (
                bgColor &&
                bgColor !== "rgba(0, 0, 0, 0)" &&
                (bgColor.includes("lab") || bgColor.includes("oklab"))
              ) {
                const rgbBgColor = convertColorToRgb(bgColor);
                style.backgroundColor = rgbBgColor;
              }

              // Converter cor de borda
              const borderColor = computedStyle.borderColor;
              if (
                borderColor &&
                borderColor !== "rgba(0, 0, 0, 0)" &&
                (borderColor.includes("lab") || borderColor.includes("oklab"))
              ) {
                const rgbBorderColor = convertColorToRgb(borderColor);
                style.borderColor = rgbBorderColor;
              }
            }
          });
        },
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(
        (pdfWidth - 40) / imgWidth,
        (pdfHeight - 80) / imgHeight,
      );
      const imgX = (pdfWidth - imgWidth * ratio) / 2;

      let currentY = 15;

      // Título
      pdf.setFontSize(18);
      const titleLines = pdf.splitTextToSize(
        "QR Code do Bebedouro",
        pdfWidth - 40,
      ) as string[];
      pdf.text(titleLines, pdfWidth / 2, currentY, {
        align: "center",
      });
      currentY += titleLines.length * 7 + 5;

      // Nome do bebedouro
      pdf.setFontSize(12);
      const nameText = `Nome: ${sinkName}`;
      const nameLines = pdf.splitTextToSize(
        nameText,
        pdfWidth - 40,
      ) as string[];
      pdf.text(nameLines, pdfWidth / 2, currentY, { align: "center" });
      currentY += nameLines.length * 6 + 3;

      // Localização (se existir)
      if (sinkLocation) {
        const locationText = `Localização: ${sinkLocation}`;
        const locationLines = pdf.splitTextToSize(
          locationText,
          pdfWidth - 40,
        ) as string[];
        pdf.text(locationLines, pdfWidth / 2, currentY, {
          align: "center",
        });
        currentY += locationLines.length * 6 + 5;
      }

      // Imagem do QR Code
      const imgY = currentY;
      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio,
      );

      // URL na parte inferior
      pdf.setFontSize(10);
      const urlText = `URL: ${qrCodeUrl}`;
      const urlLines = pdf.splitTextToSize(urlText, pdfWidth - 40) as string[];
      const urlY = Math.min(
        imgY + imgHeight * ratio + 10,
        pdfHeight - urlLines.length * 5 - 5,
      );
      pdf.text(urlLines, pdfWidth / 2, urlY, { align: "center" });

      pdf.save(`qrcode-bebedouro-${sinkName.replace(/\s+/g, "-")}.pdf`);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code do Bebedouro</DialogTitle>
          <DialogDescription>
            Escaneie o QR Code para acessar a página pública do bebedouro
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-6 py-4">
          <div
            ref={qrCodeRef}
            className="flex flex-col items-center gap-4 rounded-lg border bg-white p-6"
          >
            <div className="flex flex-col items-center gap-2">
              <h3 className="text-lg font-semibold">{sinkName}</h3>
              {sinkLocation && (
                <p className="text-muted-foreground text-sm">{sinkLocation}</p>
              )}
            </div>
            <div className="flex items-center justify-center rounded-lg bg-white p-4">
              <QRCodeSVG
                value={qrCodeUrl}
                size={256}
                level="H"
                includeMargin={true}
              />
            </div>
            <p className="text-muted-foreground max-w-xs text-center text-xs break-all">
              {qrCodeUrl}
            </p>
          </div>
          {/* <Button
            onClick={handleGeneratePDF}
            className="w-full"
            variant="default"
          >
            <Download className="mr-2 h-4 w-4" />
            Gerar PDF para Impressão
          </Button> */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
