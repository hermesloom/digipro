"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useZxing } from "react-zxing";
import { useRouter } from "next/navigation";
import { ArrowLeft, Camera } from "lucide-react";
import { useState, useEffect } from "react";

export default function BarcodeScanner() {
  const router = useRouter();
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [currentCameraIndex, setCurrentCameraIndex] = useState(0);

  // Initialize cameras list
  useEffect(() => {
    async function getCameras() {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      setCameras(videoDevices);
    }
    getCameras();
  }, []);

  const { ref } = useZxing({
    onDecodeResult(result) {
      // Get the current URL and extract the beweisid
      const path = window.location.pathname;
      const beweisIdPath = path.split("/scan")[0];

      // Navigate back to the beweismittel page with the scanned barcode
      router.push(`${beweisIdPath}?barcode=${result.getText()}`);
    },
    constraints: {
      video: {
        deviceId: cameras[currentCameraIndex]?.deviceId,
        facingMode: cameras.length === 0 ? "environment" : undefined,
      },
    },
  });

  const switchCamera = () => {
    if (cameras.length <= 1) return;
    setCurrentCameraIndex((prev) => (prev + 1) % cameras.length);
  };

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
        <CardContent className="space-y-4">
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
            <video ref={ref} className="w-full h-full object-cover" />
          </div>
          {cameras.length > 1 && (
            <Button
              variant="outline"
              onClick={switchCamera}
              className="w-full flex items-center gap-2"
            >
              <Camera className="h-4 w-4" />
              Kamera wechseln
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
