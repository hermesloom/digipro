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
import { useSession } from "@/contexts/SessionContext";
import { useVorgang } from "@/contexts/SessionContext";
import { SaveButton } from "@/app/components/SaveButton";

export default function Einrichtung() {
  const today = new Date().toISOString().split("T")[0];
  const { updateVorgang } = useSession();
  const vorgang = useVorgang();

  const [formData, setFormData] = useState({
    vorgangsnummer: vorgang?.einrichtung?.vorgangsnummer || "",
    ort: vorgang?.einrichtung?.ort || "",
    datumBeginn: vorgang?.einrichtung?.datumBeginn || "",
    datumEnde: vorgang?.einrichtung?.datumEnde || "",
    startTime: vorgang?.einrichtung?.startTime || "",
    endTime: vorgang?.einrichtung?.endTime || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  if (!vorgang) {
    return null;
  }

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
            <CardTitle>Einrichtung</CardTitle>
            <CardDescription>
              Erfassen Sie Ort und Zeit der Maßnahme
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid gap-2">
              <Label htmlFor="vorgangsnummer">Vorgangsnummer</Label>
              <Input
                id="vorgangsnummer"
                placeholder="Vorgangsnummer eingeben"
                value={formData.vorgangsnummer}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="ort">Ort</Label>
              <Input
                id="ort"
                placeholder="Ort der Maßnahme"
                value={formData.ort}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label>Beginn der Maßnahme</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label
                    htmlFor="datumBeginn"
                    className="text-muted-foreground"
                  >
                    Datum
                  </Label>
                  <Input
                    id="datumBeginn"
                    type="date"
                    value={formData.datumBeginn}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="startTime" className="text-muted-foreground">
                    Uhrzeit
                  </Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Ende der Maßnahme</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="datumEnde" className="text-muted-foreground">
                    Datum
                  </Label>
                  <Input
                    id="datumEnde"
                    type="date"
                    value={formData.datumEnde}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endTime" className="text-muted-foreground">
                    Uhrzeit
                  </Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <SaveButton
              vorgang={vorgang}
              updateVorgang={updateVorgang}
              sectionName="einrichtung"
              formData={formData}
              className="w-full"
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
