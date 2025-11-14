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
      const canvas = await html2canvas(qrCodeRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
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
        (pdfHeight - 60) / imgHeight
      );
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 20;

      pdf.setFontSize(18);
      pdf.text("QR Code do Bebedouro", pdfWidth / 2, 15, {
        align: "center",
      });

      pdf.setFontSize(12);
      pdf.text(`Nome: ${sinkName}`, pdfWidth / 2, 25, { align: "center" });
      if (sinkLocation) {
        pdf.text(`Localização: ${sinkLocation}`, pdfWidth / 2, 30, {
          align: "center",
        });
      }

      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY + 10,
        imgWidth * ratio,
        imgHeight * ratio
      );

      pdf.setFontSize(10);
      pdf.text(
        `URL: ${qrCodeUrl}`,
        pdfWidth / 2,
        pdfHeight - 10,
        { align: "center" }
      );

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
                <p className="text-muted-foreground text-sm">
                  {sinkLocation}
                </p>
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
            <p className="text-muted-foreground max-w-xs break-all text-center text-xs">
              {qrCodeUrl}
            </p>
          </div>
          <Button
            onClick={handleGeneratePDF}
            className="w-full"
            variant="default"
          >
            <Download className="mr-2 h-4 w-4" />
            Gerar PDF para Impressão
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

