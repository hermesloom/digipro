"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, QrCode, Camera, Upload, X } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useVorgang } from "@/contexts/SessionContext";
import { useSession } from "@/contexts/SessionContext";
import { SaveButton } from "@/app/components/SaveButton";
import { useParams, useRouter, useSearchParams } from "next/navigation";

export default function Beweismittel() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const vorgang = useVorgang();
  const { updateVorgang } = useSession();
  const beweisid = params.beweisid as string;
  const currentBeweismittel = vorgang.beweismittel?.find(
    (b) => b.id === beweisid
  );

  const [formData, setFormData] = useState({
    id: currentBeweismittel?.id || "",
    lfdNummer: currentBeweismittel?.lfdNummer || "",
    art: currentBeweismittel?.art || null,
    sachen: currentBeweismittel?.sachen || "",
    barcode: currentBeweismittel?.barcode || "",
    photos: currentBeweismittel?.photos || [],
  });

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleArtChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      art: value as "sicherstellung" | "beschlagnahme",
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        console.error("File too large:", file.name);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // Compress image if it's too large
        if (result.length > 1024 * 1024) {
          compressImage(result, (compressed) => {
            setFormData((prev) => ({
              ...prev,
              photos: [...prev.photos, compressed],
            }));
          });
        } else {
          setFormData((prev) => ({
            ...prev,
            photos: [...prev.photos, result],
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const compressImage = (
    base64: string,
    callback: (compressed: string) => void
  ) => {
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      // Calculate new dimensions while maintaining aspect ratio
      const maxDimension = 1200;
      if (width > height && width > maxDimension) {
        height = (height * maxDimension) / width;
        width = maxDimension;
      } else if (height > maxDimension) {
        width = (width * maxDimension) / height;
        height = maxDimension;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0, width, height);
      callback(canvas.toDataURL("image/jpeg", 0.7)); // Compress with JPEG at 70% quality
    };
    img.src = base64;
  };

  const removePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    streamRef.current = null;
  };

  const takePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0);
    const photoUrl = canvas.toDataURL("image/jpeg", 0.7);
    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, photoUrl],
    }));
    setIsCameraOpen(false);
  };

  useEffect(() => {
    if (isCameraOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isCameraOpen]);

  useEffect(() => {
    // Check for barcode in URL params when page loads
    const barcode = searchParams.get("barcode");
    if (barcode) {
      setFormData((prev) => ({
        ...prev,
        barcode,
      }));
      // Clean up the URL
      router.replace(`/vorgaenge/${params.id}/beweismittel/${beweisid}`);
    }
  }, [searchParams, router, params.id, beweisid]);

  return (
    <div className="min-h-screen p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="space-y-4">
          <Button variant="ghost" asChild className="w-fit -ml-2">
            <Link
              href={`/vorgaenge/${vorgang.id}`}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Zurück
            </Link>
          </Button>
          <div>
            <CardTitle>Beweismittel</CardTitle>
            <CardDescription>
              Erfassen Sie die sichergestellten oder beschlagnahmten
              Beweismittel
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="lfdNummer">Lfd. Nummer</Label>
                <Input id="lfdNummer" value={formData.lfdNummer} disabled />
              </div>

              <div className="grid gap-2">
                <Label>Art der Maßnahme</Label>
                <Select
                  value={formData.art || undefined}
                  onValueChange={handleArtChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Bitte wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sicherstellung">
                      Sicherstellung
                    </SelectItem>
                    <SelectItem value="beschlagnahme">Beschlagnahme</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="sachen">Sachen</Label>
                <Input
                  id="sachen"
                  placeholder="Beschreibung der Beweismittel"
                  value={formData.sachen}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="barcode">Barcode</Label>
                <div className="flex gap-2">
                  <Input
                    id="barcode"
                    value={formData.barcode}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        barcode: e.target.value,
                      }))
                    }
                    placeholder="Barcode eingeben oder scannen"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      router.push(
                        `/vorgaenge/${params.id}/beweismittel/${beweisid}/scan`
                      )
                    }
                    className="flex items-center gap-2"
                  >
                    <QrCode className="h-4 w-4" />
                    Scannen
                  </Button>
                </div>
              </div>

              <div className="grid gap-4">
                <Label>Fotos</Label>
                <div className="grid gap-4">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() =>
                        document.getElementById("photo-upload")?.click()
                      }
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Foto hochladen
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setIsCameraOpen(true)}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Foto aufnehmen
                    </Button>
                    <input
                      type="file"
                      id="photo-upload"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </div>

                  {formData.photos.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {formData.photos.map((photo, index) => (
                        <div
                          key={index}
                          className="relative aspect-square rounded-md overflow-hidden border"
                        >
                          <Image
                            src={photo}
                            alt={`Foto ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 bg-white/80 hover:bg-white/90"
                            onClick={() => removePhoto(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <SaveButton
              vorgang={vorgang}
              updateVorgang={updateVorgang}
              sectionName="beweismittel"
              formData={vorgang.beweismittel.map((b) =>
                b.id === beweisid ? formData : b
              )}
              className="w-full"
            />
          </form>
        </CardContent>
      </Card>

      <Dialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Foto aufnehmen</DialogTitle>
          </DialogHeader>
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
          <Button onClick={takePhoto}>Foto aufnehmen</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
