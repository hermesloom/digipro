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

export default function Grund() {
  const vorgang = useVorgang();
  const [anordnungsTyp, setAnordnungsTyp] = useState<
    "anordnung" | "gefahr" | null
  >(null);

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
          <form className="space-y-6">
            <div className="grid gap-4">
              <Label>Zweck der Maßnahme</Label>
              <div className="grid gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="strafverfolgung" />
                  <Label
                    htmlFor="strafverfolgung"
                    className="font-normal cursor-pointer"
                  >
                    Strafverfolgung
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="ordnungswidrigkeiten" />
                  <Label
                    htmlFor="ordnungswidrigkeiten"
                    className="font-normal cursor-pointer"
                  >
                    Verfolgung von Ordnungswidrigkeiten
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="gefahrenabwehr" />
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
              <Input id="grund" placeholder="Grund der Maßnahme eingeben" />
            </div>

            <div className="grid gap-2">
              <Label>Art der Anordnung</Label>
              <Select
                value={anordnungsTyp || undefined}
                onValueChange={(value) =>
                  setAnordnungsTyp(value as "anordnung" | "gefahr")
                }
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

            {anordnungsTyp === "anordnung" ? (
              <div className="grid gap-2">
                <Label htmlFor="aktenzeichen">
                  Az. der anordnenden Behörde oder Gericht bzw. Name, Dienstgrad
                </Label>
                <Input
                  id="aktenzeichen"
                  placeholder="Aktenzeichen oder Name eingeben"
                />
              </div>
            ) : anordnungsTyp === "gefahr" ? (
              <div className="grid gap-2">
                <Label htmlFor="person">bei der oder dem</Label>
                <Input id="person" placeholder="Person eingeben" />
              </div>
            ) : null}

            <Button type="submit" className="w-full" asChild>
              <Link href={`/vorgaenge/${vorgang.id}`}>Speichern</Link>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
