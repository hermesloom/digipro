"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useZxing } from "react-zxing";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BarcodeScanner() {
  const router = useRouter();

  const { ref } = useZxing({
    onDecodeResult(result) {
      // Get the current URL and extract the beweisid
      const path = window.location.pathname;
      const beweisIdPath = path.split("/scan")[0];

      // Navigate back to the beweismittel page with the scanned barcode
      router.push(`${beweisIdPath}?barcode=${result.getText()}`);
    },
    constraints: {
      video: { facingMode: "environment" },
    },
  });

  return (
    <div className="min-h-screen p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="space-y-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="w-fit -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Zurück
          </Button>
          <CardTitle>Barcode scannen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
            <video ref={ref} className="w-full h-full object-cover" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
