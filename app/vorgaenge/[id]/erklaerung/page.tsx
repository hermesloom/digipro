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
import { useState, useRef, useEffect } from "react";
import SignaturePad from "react-signature-canvas";
import { useVorgang, useSession } from "@/contexts/SessionContext";
import { SaveButton } from "@/app/components/SaveButton";

export default function Erklaerung() {
  const vorgang = useVorgang();
  const { updateVorgang } = useSession();

  const [formData, setFormData] = useState({
    erklaerer: vorgang.erklaerung?.erklaerer || null,
    durchsuchungGestattet: vorgang.erklaerung?.durchsuchungGestattet || null,
    widerspruch: vorgang.erklaerung?.widerspruch || [],
    durchsichtEinverstanden:
      vorgang.erklaerung?.durchsichtEinverstanden || false,
    zeugeVerzichtet: vorgang.erklaerung?.zeugeVerzichtet || false,
    signatureBetroffener: vorgang.erklaerung?.signatureBetroffener || "",
    signatureZeuge: vorgang.erklaerung?.signatureZeuge || "",
  });

  const signatureBetroffenerRef = useRef<SignaturePad | null>(null);
  const signatureZeugeRef = useRef<SignaturePad | null>(null);

  useEffect(() => {
    if (formData.signatureBetroffener && signatureBetroffenerRef.current) {
      signatureBetroffenerRef.current.fromDataURL(
        formData.signatureBetroffener
      );
    }
    if (formData.signatureZeuge && signatureZeugeRef.current) {
      signatureZeugeRef.current.fromDataURL(formData.signatureZeuge);
    }
  }, [formData.signatureBetroffener, formData.signatureZeuge]);

  const widerspruchOptions = vorgang.beweismittel.map((beweismittel) => ({
    value: beweismittel.id,
    label: beweismittel.lfdNummer,
    sachen: beweismittel.sachen || "Keine Beschreibung",
  }));

  const handleWiderspruchChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      widerspruch: prev.widerspruch.includes(value)
        ? prev.widerspruch.filter((item) => item !== value)
        : [...prev.widerspruch, value],
    }));
  };

  const handleErklaererChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      erklaerer: value as "betroffener" | "vertreter",
    }));
  };

  const handleDurchsuchungGestattetChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      durchsuchungGestattet: value as "ja" | "nein" | "nicht",
    }));
  };

  const handleCheckboxChange = (
    field: "durchsichtEinverstanden" | "zeugeVerzichtet"
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const clearSignature = (ref: React.RefObject<SignaturePad | null>) => {
    ref.current?.clear();
    if (ref === signatureBetroffenerRef) {
      setFormData((prev) => ({ ...prev, signatureBetroffener: "" }));
    } else if (ref === signatureZeugeRef) {
      setFormData((prev) => ({ ...prev, signatureZeuge: "" }));
    }
  };

  const handleSignatureSave = () => {
    // Handle Betroffener signature
    if (signatureBetroffenerRef.current) {
      if (signatureBetroffenerRef.current.isEmpty()) {
        setFormData((prev) => ({ ...prev, signatureBetroffener: "" }));
      } else {
        // Check if getTrimmedCanvas is available
        if (
          typeof signatureBetroffenerRef.current.getTrimmedCanvas === "function"
        ) {
          const signatureBetroffener = signatureBetroffenerRef.current
            //.getTrimmedCanvas()
            .toDataURL("image/png");
          setFormData((prev) => ({ ...prev, signatureBetroffener }));
        }
      }
    }

    // Handle Zeuge signature
    if (signatureZeugeRef.current) {
      if (signatureZeugeRef.current.isEmpty()) {
        setFormData((prev) => ({ ...prev, signatureZeuge: "" }));
      } else {
        // Check if getTrimmedCanvas is available
        if (typeof signatureZeugeRef.current.getTrimmedCanvas === "function") {
          const signatureZeuge = signatureZeugeRef.current
            //.getTrimmedCanvas()
            .toDataURL("image/png");
          setFormData((prev) => ({ ...prev, signatureZeuge }));
        }
      }
    }
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
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label>Erklärender</Label>
                <Select
                  value={formData.erklaerer || undefined}
                  onValueChange={handleErklaererChange}
                >
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
                <Select
                  value={formData.durchsuchungGestattet || undefined}
                  onValueChange={handleDurchsuchungGestattetChange}
                >
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
                        checked={formData.widerspruch.includes(option.value)}
                        onCheckedChange={() =>
                          handleWiderspruchChange(option.value)
                        }
                      />
                      <Label
                        htmlFor={`widerspruch-${option.value}`}
                        className="font-normal"
                      >
                        #{option.label} - {option.sachen}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4">
                <Label>Weitere Erklärungen</Label>
                <div className="grid gap-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="durchsicht"
                      checked={formData.durchsichtEinverstanden}
                      onCheckedChange={() =>
                        handleCheckboxChange("durchsichtEinverstanden")
                      }
                    />
                    <Label
                      htmlFor="durchsicht"
                      className="font-normal leading-tight"
                    >
                      Ich bin mit der Durchsicht der mitgenommenen bzw.
                      kopierten Papiere/Datenträger einverstanden
                    </Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="zeuge"
                      checked={formData.zeugeVerzichtet}
                      onCheckedChange={() =>
                        handleCheckboxChange("zeugeVerzichtet")
                      }
                    />
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
                          onEnd={handleSignatureSave}
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
                          onEnd={handleSignatureSave}
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

            <SaveButton
              vorgang={vorgang}
              updateVorgang={updateVorgang}
              sectionName="erklaerung"
              formData={formData}
              className="w-full"
              onBeforeSave={handleSignatureSave}
              label="Speichern und Vorgang abschließen"
              targetRoute="/"
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
