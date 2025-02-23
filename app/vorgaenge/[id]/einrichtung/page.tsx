"use client";

import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useSession } from "@/contexts/SessionContext";
import { useVorgang } from "@/contexts/SessionContext";
import { SaveButton } from "@/app/components/SaveButton";
import { Alert } from "@/components/ui/alert";

export default function Einrichtung() {
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

  const [dateError, setDateError] = useState(false);

  const validateDates = () => {
    if (
      !formData.datumBeginn ||
      !formData.datumEnde ||
      !formData.startTime ||
      !formData.endTime
    ) {
      setDateError(false);
      return;
    }

    const startDateTime = new Date(
      `${formData.datumBeginn}T${formData.startTime}`
    );
    const endDateTime = new Date(`${formData.datumEnde}T${formData.endTime}`);

    setDateError(startDateTime > endDateTime);
  };

  useEffect(() => {
    validateDates();
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    validateDates();
  };

  const setTimeToNow = (type: "start" | "end") => {
    const now = new Date();
    const date = now.toISOString().split("T")[0];
    const time = now.toTimeString().slice(0, 5);

    setFormData((prev) => ({
      ...prev,
      ...(type === "start"
        ? { datumBeginn: date, startTime: time }
        : { datumEnde: date, endTime: time }),
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
              <div className="grid grid-cols-[1fr_1fr_auto] gap-4 items-end">
                <div className="grid gap-2">
                  <Label
                    htmlFor="datumBeginn"
                    className={`text-muted-foreground ${
                      dateError ? "text-destructive" : ""
                    }`}
                  >
                    Datum
                  </Label>
                  <Input
                    id="datumBeginn"
                    type="date"
                    value={formData.datumBeginn}
                    onChange={handleChange}
                    className={dateError ? "border-destructive" : ""}
                  />
                </div>
                <div className="grid gap-2">
                  <Label
                    htmlFor="startTime"
                    className={`text-muted-foreground ${
                      dateError ? "text-destructive" : ""
                    }`}
                  >
                    Uhrzeit
                  </Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={handleChange}
                    className={dateError ? "border-destructive" : ""}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setTimeToNow("start")}
                  className="flex items-center gap-2"
                >
                  <Clock className="h-4 w-4" />
                  Jetzt
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Ende der Maßnahme</Label>
              <div className="grid grid-cols-[1fr_1fr_auto] gap-4 items-end">
                <div className="grid gap-2">
                  <Label
                    htmlFor="datumEnde"
                    className={`text-muted-foreground ${
                      dateError ? "text-destructive" : ""
                    }`}
                  >
                    Datum
                  </Label>
                  <Input
                    id="datumEnde"
                    type="date"
                    value={formData.datumEnde}
                    onChange={handleChange}
                    className={dateError ? "border-destructive" : ""}
                  />
                </div>
                <div className="grid gap-2">
                  <Label
                    htmlFor="endTime"
                    className={`text-muted-foreground ${
                      dateError ? "text-destructive" : ""
                    }`}
                  >
                    Uhrzeit
                  </Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={handleChange}
                    className={dateError ? "border-destructive" : ""}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setTimeToNow("end")}
                  className="flex items-center gap-2"
                >
                  <Clock className="h-4 w-4" />
                  Jetzt
                </Button>
              </div>
            </div>

            {dateError && (
              <Alert variant="destructive">
                Der Beginn der Maßnahme kann nicht nach dem Ende liegen.
              </Alert>
            )}

            <SaveButton
              vorgang={vorgang}
              updateVorgang={updateVorgang}
              sectionName="einrichtung"
              formData={formData}
              className="w-full"
              disabled={dateError}
              label="Speichern und weiter zum Betroffenen"
              targetRoute="/betroffener"
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
