"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useVorgang } from "@/contexts/SessionContext";
import { useSession } from "@/contexts/SessionContext";
import { SaveButton } from "@/app/components/SaveButton";

export default function Grund() {
  const vorgang = useVorgang();
  const { updateVorgang } = useSession();

  const [formData, setFormData] = useState({
    zweck: {
      strafverfolgung: vorgang.grund?.zweck?.strafverfolgung || false,
      ordnungswidrigkeiten: vorgang.grund?.zweck?.ordnungswidrigkeiten || false,
      gefahrenabwehr: vorgang.grund?.zweck?.gefahrenabwehr || false,
    },
    grund: vorgang.grund?.grund || "",
    anordnungsTyp: vorgang.grund?.anordnungsTyp || null,
    anordnungDetails: vorgang.grund?.anordnungDetails || "",
  });

  const handleCheckboxChange = (id: keyof typeof formData.zweck) => {
    setFormData((prev) => ({
      ...prev,
      zweck: {
        ...prev.zweck,
        [id]: !prev.zweck[id],
      },
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleAnordnungsTypChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      anordnungsTyp: value as "anordnung" | "gefahr",
      anordnungDetails: "", // Reset details when type changes
    }));
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
            <CardTitle>Grund</CardTitle>
            <CardDescription>
              Erfassen Sie den Grund der polizeilichen Maßnahme
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid gap-4">
              <Label>Zweck der Maßnahme</Label>
              <div className="grid gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="strafverfolgung"
                    checked={formData.zweck.strafverfolgung}
                    onCheckedChange={() =>
                      handleCheckboxChange("strafverfolgung")
                    }
                  />
                  <Label
                    htmlFor="strafverfolgung"
                    className="font-normal cursor-pointer"
                  >
                    Strafverfolgung
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ordnungswidrigkeiten"
                    checked={formData.zweck.ordnungswidrigkeiten}
                    onCheckedChange={() =>
                      handleCheckboxChange("ordnungswidrigkeiten")
                    }
                  />
                  <Label
                    htmlFor="ordnungswidrigkeiten"
                    className="font-normal cursor-pointer"
                  >
                    Verfolgung von Ordnungswidrigkeiten
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="gefahrenabwehr"
                    checked={formData.zweck.gefahrenabwehr}
                    onCheckedChange={() =>
                      handleCheckboxChange("gefahrenabwehr")
                    }
                  />
                  <Label
                    htmlFor="gefahrenabwehr"
                    className="font-normal cursor-pointer"
                  >
                    Gefahrenabwehr
                  </Label>
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="grund">
                Aus folgendem Grund (ggf. Straftatbezeichnung)
              </Label>
              <Input
                id="grund"
                placeholder="Grund der Maßnahme eingeben"
                value={formData.grund}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid gap-2">
              <Label>Art der Anordnung</Label>
              <Select
                value={formData.anordnungsTyp || undefined}
                onValueChange={handleAnordnungsTypChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Bitte wählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="anordnung">auf Anordnung</SelectItem>
                  <SelectItem value="gefahr">
                    weil Gefahr im Verzuge bestand
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.anordnungsTyp === "anordnung" ? (
              <div className="grid gap-2">
                <Label htmlFor="anordnungDetails">
                  Az. der anordnenden Behörde oder Gericht bzw. Name, Dienstgrad
                </Label>
                <Input
                  id="anordnungDetails"
                  placeholder="Aktenzeichen oder Name eingeben"
                  value={formData.anordnungDetails}
                  onChange={handleInputChange}
                />
              </div>
            ) : formData.anordnungsTyp === "gefahr" ? (
              <div className="grid gap-2">
                <Label htmlFor="anordnungDetails">bei der oder dem</Label>
                <Input
                  id="anordnungDetails"
                  placeholder="Person eingeben"
                  value={formData.anordnungDetails}
                  onChange={handleInputChange}
                />
              </div>
            ) : null}

            <SaveButton
              vorgang={vorgang}
              updateVorgang={updateVorgang}
              sectionName="grund"
              formData={formData}
              className="w-full"
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
