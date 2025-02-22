"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, X } from "lucide-react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useRef } from "react";
import SignaturePad from "react-signature-canvas";
import { useVorgang } from "@/contexts/SessionContext";

export default function Erklaerung() {
  const vorgang = useVorgang();
  const [selectedWiderspruch, setSelectedWiderspruch] = useState<string[]>([]);
  const signatureBetroffenerRef = useRef<SignaturePad | null>(null);
  const signatureZeugeRef = useRef<SignaturePad | null>(null);

  const widerspruchOptions = [
    { value: "01", label: "01" },
    { value: "02", label: "02" },
    { value: "03", label: "03" },
  ];

  const handleWiderspruchChange = (value: string) => {
    setSelectedWiderspruch((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const clearSignature = (ref: React.RefObject<SignaturePad | null>) => {
    ref.current?.clear();
  };

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
            <CardTitle>Erklärung</CardTitle>
            <CardDescription>
              Erfassen Sie die abschließende Erklärung
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label>Erklärender</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Bitte wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="betroffener">Betroffene/r</SelectItem>
                    <SelectItem value="vertreter">Vertreter/in</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Durchsuchung gestattet?</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Bitte wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ja">ja</SelectItem>
                    <SelectItem value="nein">nein</SelectItem>
                    <SelectItem value="nicht">nicht stattgefunden</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4">
                <Label>Widerspruch erhoben gegen</Label>
                <div className="grid gap-2">
                  {widerspruchOptions.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`widerspruch-${option.value}`}
                        checked={selectedWiderspruch.includes(option.value)}
                        onCheckedChange={() =>
                          handleWiderspruchChange(option.value)
                        }
                      />
                      <Label
                        htmlFor={`widerspruch-${option.value}`}
                        className="font-normal"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4">
                <Label>Weitere Erklärungen</Label>
                <div className="grid gap-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox id="durchsicht" />
                    <Label
                      htmlFor="durchsicht"
                      className="font-normal leading-tight"
                    >
                      Ich bin mit der Durchsicht der mitgenommenen bzw.
                      kopierten Papiere/Datenträger einverstanden
                    </Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Checkbox id="zeuge" />
                    <Label
                      htmlFor="zeuge"
                      className="font-normal leading-tight"
                    >
                      Auf die Hinzuziehung eines unabhängigen Zeugen habe ich
                      verzichtet
                    </Label>
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                <Label>Unterschriften</Label>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label className="font-normal">Betroffener/Vertreter</Label>
                    <div className="relative">
                      <div className="border rounded-md bg-white">
                        <SignaturePad
                          ref={signatureBetroffenerRef}
                          canvasProps={{
                            className: "w-full h-32 rounded-md",
                          }}
                          backgroundColor="white"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => clearSignature(signatureBetroffenerRef)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label className="font-normal">Zeuge/Zeugin</Label>
                    <div className="relative">
                      <div className="border rounded-md bg-white">
                        <SignaturePad
                          ref={signatureZeugeRef}
                          canvasProps={{
                            className: "w-full h-32 rounded-md",
                          }}
                          backgroundColor="white"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => clearSignature(signatureZeugeRef)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              onClick={(e) => {
                e.preventDefault();
                // Here you can get the signatures as base64 strings
                /*const signatureBetroffener = signatureBetroffenerRef.current
                  ?.getTrimmedCanvas()
                  .toDataURL();
                const signatureZeuge = signatureZeugeRef.current
                  ?.getTrimmedCanvas()
                  .toDataURL();*/
                // Handle saving...
              }}
              asChild
            >
              <Link href={`/vorgaenge/${vorgang.id}`}>Speichern</Link>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
